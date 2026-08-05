import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, email } = body;

    if (!orderId || !email) {
      return NextResponse.json({ error: 'Missing required validation arguments: orderId and email.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRole) {
      // Local development mock mode fallback
      console.warn('Supabase credentials missing for secure asset retrieval. Returning local mock download links.');
      return NextResponse.json({
        success: true,
        links: [
          {
            title: 'Mock High-Res Artwork',
            link: `https://drive.google.com/drive/folders/mock_folder_id?order_id=${orderId}`
          }
        ]
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

    // 1. Verify that order exists and status is marked 'paid' for the given customer email
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, status, customer_email')
      .eq('id', orderId)
      .eq('customer_email', email.trim().toLowerCase())
      .single();

    if (orderErr || !order) {
      console.warn(`[Asset Retrieve] Unverified access attempt for Order: ${orderId}, Email: ${email}`);
      return NextResponse.json({ error: 'Order not verified or permission denied. Please verify payment credentials.' }, { status: 403 });
    }

    if (order.status !== 'paid') {
      return NextResponse.json({ 
        error: `Order payment status is currently '${order.status}'. Downloads are only unlocked upon completed payments.` 
      }, { status: 403 });
    }

    // 2. Fetch the corresponding digital assets
    // Try to retrieve from file_permissions (populated on webhook trigger)
    const { data: permissions, error: permErr } = await supabaseAdmin
      .from('file_permissions')
      .select('google_drive_file_id')
      .eq('order_id', orderId);

    const driveLinks: { title: string; link: string }[] = [];

    if (!permErr && permissions && permissions.length > 0) {
      // Fetch details from digital_products linked to these file permissions
      const fileIds = permissions.map(p => p.google_drive_file_id);
      
      const { data: products } = await supabaseAdmin
        .from('digital_products')
        .select('title, google_drive_file_id')
        .in('google_drive_file_id', fileIds);

      if (products && products.length > 0) {
        products.forEach(prod => {
          driveLinks.push({
            title: prod.title,
            link: `https://drive.google.com/file/d/${prod.google_drive_file_id}/view`
          });
        });
      }
    }

    // Fallback: If permissions log is not populated yet, fetch via order items
    if (driveLinks.length === 0) {
      const { data: orderItems, error: itemsErr } = await supabaseAdmin
        .from('order_items')
        .select('price, digital_products(title, google_drive_file_id)')
        .eq('order_id', orderId);

      if (itemsErr) {
        console.error('[Asset Retrieve] Failed fetching order items list:', itemsErr);
        return NextResponse.json({ error: 'Failed to retrieve order items registry.' }, { status: 500 });
      }

      if (orderItems && orderItems.length > 0) {
        orderItems.forEach((item: any) => {
          const product = item.digital_products;
          if (product && product.google_drive_file_id) {
            driveLinks.push({
              title: product.title,
              link: `https://drive.google.com/file/d/${product.google_drive_file_id}/view`
            });
          }
        });
      }
    }

    if (driveLinks.length === 0) {
      return NextResponse.json({ error: 'No digital download assets found associated with this purchase.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      links: driveLinks
    });

  } catch (err: any) {
    console.error('[Asset Retrieve] Secure download retrieval error:', err);
    return NextResponse.json({ error: 'Internal Server Error during asset delivery.' }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  // Support GET request checks with query params
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('order_id');
  const email = searchParams.get('email');

  if (!orderId || !email) {
    return NextResponse.json({ error: 'Missing required query parameters: order_id and email.' }, { status: 400 });
  }

  // Create a pseudo request and forward to POST handler for DRY logic
  const mockReq = new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({ orderId, email })
  });

  return POST(mockReq);
}
