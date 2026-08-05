import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Helper to sign Google JWT assertion for OAuth2 token acquisition
function signGoogleJwt(clientEmail: string, privateKey: string): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Claim = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const signatureInput = `${base64Header}.${base64Claim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey, 'base64url');

  return `${signatureInput}.${signature}`;
}

// Fetch Google Drive API Access Token
async function getGoogleDriveAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const jwtToken = signGoogleJwt(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth token retrieval failed: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Share Google Drive file reader access with customer email
async function shareGoogleDriveFile(fileId: string, email: string, accessToken: string): Promise<{ permissionId: string; webViewLink: string }> {
  // 1. Create permission
  const permRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?fields=id`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      role: 'reader',
      type: 'user',
      emailAddress: email
    })
  });

  if (!permRes.ok) {
    const errText = await permRes.text();
    throw new Error(`Google Drive permissions creation failed for file ${fileId}: ${errText}`);
  }

  const permData = await permRes.json();
  const permissionId = permData.id;

  // 2. Fetch webViewLink to file
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  let webViewLink = `https://drive.google.com/file/d/${fileId}/view`;
  if (metaRes.ok) {
    const metaData = await metaRes.json();
    if (metaData.webViewLink) {
      webViewLink = metaData.webViewLink;
    }
  }

  return { permissionId, webViewLink };
}

export async function POST(req: NextRequest) {
  try {
    // PayHere Ceylon IPN uses x-www-form-urlencoded encoding
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const merchantId = params.get('merchant_id');
    const orderId = params.get('order_id');
    const paymentId = params.get('payment_id');
    const payhereAmount = params.get('payhere_amount');
    const payhereCurrency = params.get('payhere_currency');
    const statusCode = params.get('status_code');
    const md5sig = params.get('md5sig');

    if (!merchantId || !orderId || !payhereAmount || !payhereCurrency || !statusCode || !md5sig) {
      console.error('[PayHere IPN] Missing mandatory parameters in webhook body.');
      return new Response('Bad Request: Missing parameters', { status: 400 });
    }

    const merchantSecret = (process.env.PAYHERE_MERCHANT_SECRET || process.env.PAYHERE_SECRET || '').trim();
    if (!merchantSecret) {
      console.error('[PayHere IPN] PAYHERE_MERCHANT_SECRET environment variable is missing.');
      return new Response('Internal Server Error: Merchant secret unconfigured', { status: 500 });
    }

    // 1. Verify payment MD5 signature
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const rawSignatureString = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret;
    const computedSignature = crypto
      .createHash('md5')
      .update(rawSignatureString)
      .digest('hex')
      .toUpperCase();

    if (computedSignature !== md5sig.toUpperCase()) {
      console.error(`[PayHere IPN] Signature validation failed. Expected: ${computedSignature}, Received: ${md5sig}`);
      return new Response('Forbidden: Signature mismatch', { status: 403 });
    }

    console.log(`[PayHere IPN] Signature verified for order ${orderId}. Status code: ${statusCode}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRole) {
      console.warn('[PayHere IPN] Supabase credentials unconfigured. Graceful skip database updates.');
      return new Response('OK', { status: 200 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

    // Fetch the order information
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, digital_products(*))')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      console.error(`[PayHere IPN] Order with ID ${orderId} not found.`, orderErr);
      return new Response('Order not found', { status: 404 });
    }

    // If payment was completed successfully (status_code = 2)
    if (statusCode === '2') {
      if (order.status === 'paid') {
        console.log(`[PayHere IPN] Order ${orderId} is already marked as PAID. Duplicate IPN skipped.`);
        return new Response('OK', { status: 200 });
      }

      const customerEmail = order.customer_email;
      const driveLinks: { title: string; link: string }[] = [];

      // 2. Perform secure Google Drive asset delivery if JWT credentials exist
      const googleCredsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      
      if (googleCredsJson) {
        try {
          const creds = JSON.parse(googleCredsJson);
          const accessToken = await getGoogleDriveAccessToken(creds.client_email, creds.private_key);

          const items = order.order_items || [];
          for (const item of items) {
            const product = item.digital_products;
            if (product && product.google_drive_file_id) {
              const fileId = product.google_drive_file_id;
              try {
                console.log(`[PayHere IPN] Sharing Google Drive file ${fileId} with ${customerEmail}`);
                
                const { permissionId, webViewLink } = await shareGoogleDriveFile(fileId, customerEmail, accessToken);

                // Insert into public.file_permissions
                const { error: permInsertErr } = await supabaseAdmin
                  .from('file_permissions')
                  .insert({
                    order_id: orderId,
                    customer_email: customerEmail,
                    google_drive_file_id: fileId,
                    google_permission_id: permissionId
                  });

                if (permInsertErr) {
                  console.error('[PayHere IPN] Failed logging permission in DB:', permInsertErr);
                }

                driveLinks.push({
                  title: product.title,
                  link: webViewLink
                });
              } catch (driveShareErr) {
                console.error(`[PayHere IPN] Failed sharing file ${fileId}:`, driveShareErr);
              }
            }
          }
        } catch (authErr) {
          console.error('[PayHere IPN] Google Service Account auth failed:', authErr);
        }
      } else {
        console.warn('[PayHere IPN] GOOGLE_SERVICE_ACCOUNT_JSON not set. Access privileges could not be dynamically configured.');
        
        // Mock fallback/audit registry when testing without drive credentials
        const items = order.order_items || [];
        for (const item of items) {
          const product = item.digital_products;
          if (product && product.google_drive_file_id) {
            await supabaseAdmin.from('file_permissions').insert({
              order_id: orderId,
              customer_email: customerEmail,
              google_drive_file_id: product.google_drive_file_id,
              google_permission_id: 'mock_permission_id'
            });
            driveLinks.push({
              title: product.title,
              link: `https://drive.google.com/file/d/${product.google_drive_file_id}/view`
            });
          }
        }
      }

      // 3. Update Order Status to 'paid' in Supabase
      const { error: updateErr } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateErr) {
        console.error('[PayHere IPN] Order status update failed in database:', updateErr);
        return new Response('Database write error', { status: 500 });
      }

      // 4. Send Confirmation Email using Resend API if key is present
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey && driveLinks.length > 0) {
        try {
          const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0c0a09; color: #f4f4f5; border-radius: 16px;">
              <h2 style="color: #8b5cf6;">Bitium Technology - Digital Assets Delivery</h2>
              <p>Hi ${order.customer_name || 'Valued Customer'},</p>
              <p>Thank you for your purchase! We have successfully shared the high-resolution files with your email <strong>${customerEmail}</strong>.</p>
              <p>You can access your purchases directly through the Google Drive links below:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #1c1917; text-align: left;">
                    <th style="padding: 10px; border-bottom: 1px solid #2e2a24;">Item Name</th>
                    <th style="padding: 10px; border-bottom: 1px solid #2e2a24; text-align: right;">Access Link</th>
                  </tr>
                </thead>
                <tbody>
                  ${driveLinks.map(item => `
                    <tr>
                      <td style="padding: 12px 10px; border-bottom: 1px solid #1c1917;">${item.title}</td>
                      <td style="padding: 12px 10px; border-bottom: 1px solid #1c1917; text-align: right;">
                        <a href="${item.link}" target="_blank" style="background-color: #8b5cf6; color: #ffffff; padding: 6px 12px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 12px;">Open Drive</a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <p style="font-size: 12px; color: #a1a1aa;">Note: Please make sure you are logged in to your Google Account associated with <strong>${customerEmail}</strong> to view and download these files.</p>
              <hr style="border: 0; border-top: 1px solid #1c1917; margin-top: 30px;">
              <p style="font-size: 11px; text-align: center; color: #71717a;">Bitium Technology © ${new Date().getFullYear()} - Headless digital assets delivery</p>
            </div>
          `;

          const emailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: 'Bitium Downloads <downloads@bitiumtechnology.com>',
              to: customerEmail,
              subject: 'Your Digital Assets from Bitium Technology',
              html: emailContent
            })
          });

          if (!emailRes.ok) {
            console.error('[PayHere IPN] Resend email dispatch failed:', await emailRes.text());
          }
        } catch (emailErr) {
          console.error('[PayHere IPN] Custom email notification failed:', emailErr);
        }
      }
    } else if (statusCode === '-2' || statusCode === '-1') {
      // If status is failed/cancelled
      console.warn(`[PayHere IPN] Payment failed/cancelled for order ${orderId}. Status: ${statusCode}`);
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
    }

    return new Response('OK', { status: 200 });

  } catch (err: any) {
    console.error('[PayHere IPN] Unhandled processing error in notification webhook:', err);
    return new Response(`Server Error: ${err.message}`, { status: 500 });
  }
}
