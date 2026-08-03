import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { google } from "npm:googleapis@126.0.0";
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase Client inside Edge Function using Service Role for DB updates
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // Handle CORS pre-flight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // PayHere Ceylon IPN payload is x-www-form-urlencoded
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const merchantId = params.get("merchant_id");
    const orderId = params.get("order_id");
    const paymentId = params.get("payment_id");
    const payhereAmount = params.get("payhere_amount");
    const payhereCurrency = params.get("payhere_currency");
    const statusCode = params.get("status_code");
    const md5sig = params.get("md5sig");

    if (!merchantId || !orderId || !payhereAmount || !payhereCurrency || !statusCode || !md5sig) {
      console.error("Missing required parameters in IPN request");
      return new Response("Bad Request: Missing parameters", { status: 400 });
    }

    // 1. MD5 Signature Verification
    const merchantSecret = Deno.env.get("PAYHERE_MERCHANT_SECRET");
    if (!merchantSecret) {
      console.error("PAYHERE_MERCHANT_SECRET environment variable is missing");
      return new Response("Internal Server Error", { status: 500 });
    }

    // UpperCase(MD5(merchant_secret))
    const hashedSecret = createHash("md5")
      .update(merchantSecret)
      .toString()
      .toUpperCase();

    // Verify formula: merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret
    const rawSignatureString = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret;
    const computedSignature = createHash("md5")
      .update(rawSignatureString)
      .toString()
      .toUpperCase();

    if (computedSignature !== md5sig.toUpperCase()) {
      console.error(`Fraud Attempt: Signature mismatch. Received: ${md5sig}, Computed: ${computedSignature}`);
      return new Response("Forbidden: Invalid Signature", { status: 403 });
    }

    console.log(`IPN verified for Order: ${orderId}. Processing status code: ${statusCode}`);

    // Check if Payment was successful (status_code = 2 represents paid)
    if (statusCode === "2") {
      // 2. Fetch Order and Buyer details from DB
      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*, digital_products(*))")
        .eq("id", orderId)
        .single();

      if (orderErr || !order) {
        console.error("Failed to retrieve order:", orderErr);
        return new Response("Order not found", { status: 404 });
      }

      // Check if order is already processed to prevent duplicate deliveries
      if (order.status === "paid") {
        console.log(`Order ${orderId} already marked as paid. Skipping processing.`);
        return new Response("OK", { status: 200 });
      }

      const customerEmail = order.customer_email;

      // 3. Authenticate with Google Drive API via Service Account JSON
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
      if (!serviceAccountJson) {
        console.error("GOOGLE_SERVICE_ACCOUNT_JSON secret is missing");
        return new Response("Google Cloud auth credentials missing", { status: 500 });
      }

      const credentials = JSON.parse(serviceAccountJson);
      
      const jwtClient = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        ["https://www.googleapis.com/auth/drive"]
      );

      await jwtClient.authorize();
      const drive = google.drive({ version: "v3", auth: jwtClient });

      // 4. Iterate products, add Viewer permissions & record in database
      const items = order.order_items || [];
      const driveLinks: { title: string; link: string }[] = [];

      for (const item of items) {
        const product = item.digital_products;
        if (product && product.google_drive_file_id) {
          const fileId = product.google_drive_file_id;

          try {
            console.log(`Sharing file ${fileId} with customer ${customerEmail}`);

            // Call Google Drive API to add reader/viewer permission to the buyer's email
            const permissionRes = await drive.permissions.create({
              fileId: fileId,
              requestBody: {
                role: "reader",
                type: "user",
                emailAddress: customerEmail,
              },
              sendNotificationEmail: false, // Disables default Google drive notification to send customized UI email
              fields: "id",
            });

            const permissionId = permissionRes.data.id;

            // Log details into public.file_permissions
            await supabaseAdmin.from("file_permissions").insert({
              order_id: orderId,
              customer_email: customerEmail,
              google_drive_file_id: fileId,
              google_permission_id: permissionId,
            });

            // Get direct webViewLink to file
            const fileMeta = await drive.files.get({
              fileId: fileId,
              fields: "webViewLink, title",
            });

            driveLinks.push({
              title: fileMeta.data.title || product.title,
              link: fileMeta.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
            });
          } catch (driveErr) {
            console.error(`Google Drive API error for file ${fileId}:`, driveErr);
            // In a production app, queue this for retry, or alert support. Do not block checkout completion.
          }
        }
      }

      // 5. Update Order Status to 'paid' in Supabase
      const { error: updateErr } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateErr) {
        console.error("Order status update failed:", updateErr);
        return new Response("Database write failed", { status: 500 });
      }

      // 6. Send Custom Delivery Email via Resend API
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey && driveLinks.length > 0) {
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

        try {
          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Bitium Downloads <downloads@bitiumtechnology.com>",
              to: customerEmail,
              subject: "Your Digital Assets from Bitium Technology",
              html: emailContent,
            }),
          });

          if (!resendResponse.ok) {
            console.error("Resend API failed:", await resendResponse.text());
          } else {
            console.log(`Custom email delivered successfully to ${customerEmail}`);
          }
        } catch (emailErr) {
          console.error("Email delivery failed:", emailErr);
        }
      }
    } else {
      console.log(`Payment status code is ${statusCode}. Order status is not updated.`);
      // Update order to failed if appropriate
      if (statusCode === "-2" || statusCode === "-1") {
        await supabaseAdmin
          .from("orders")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", orderId);
      }
    }

    return new Response("OK", { headers: corsHeaders, status: 200 });
  } catch (err: any) {
    console.error("Unhandled IPN Processing Error:", err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
