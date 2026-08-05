import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import catalogData from '@/lib/digital-catalog.json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { items, customerEmail, customerName, phone, address, city } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !customerEmail) {
      return NextResponse.json({ error: 'Missing required parameters: items and customerEmail are mandatory.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let totalAmount = 0;
    const itemNames: string[] = [];
    let orderId = `guest_order_${Date.now()}`;
    const isMock = !supabaseUrl || !supabaseServiceRole;

    if (!isMock) {
      // Initialize zero-trust admin Supabase client to bypass RLS policies
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
      
      const productIds = items.map((i: any) => i.id);
      
      // Fetch prices from database to prevent price tampering from frontend payload
      const { data: dbProducts, error: dbError } = await supabaseAdmin
        .from('digital_products')
        .select('id, price, title')
        .in('id', productIds);

      if (dbError || !dbProducts || dbProducts.length === 0) {
        console.error('Database item verification failed:', dbError);
        return NextResponse.json({ error: 'Failed to verify items in database catalog.' }, { status: 400 });
      }

      const orderItemsPayload: any[] = [];
      dbProducts.forEach(prod => {
        const quantity = items.find((i: any) => i.id === prod.id)?.quantity || 1;
        totalAmount += prod.price * quantity;
        itemNames.push(prod.title);
        orderItemsPayload.push({
          product_id: prod.id,
          price: prod.price
        });
      });

      // Insert pending order
      const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_email: customerEmail.trim().toLowerCase(),
          customer_name: customerName || 'Digital Customer',
          total_amount: totalAmount,
          status: 'pending',
          payment_method: 'payhere'
        })
        .select()
        .single();

      if (orderErr || !order) {
        console.error('Supabase order insert error:', orderErr);
        return NextResponse.json({ error: 'Order creation failed.' }, { status: 500 });
      }

      orderId = order.id;

      // Link order items
      const itemsWithOrderId = orderItemsPayload.map(item => ({
        ...item,
        order_id: orderId
      }));
      
      const { error: itemsErr } = await supabaseAdmin
        .from('order_items')
        .insert(itemsWithOrderId);

      if (itemsErr) {
        console.error('Supabase order items insertion failed:', itemsErr);
        return NextResponse.json({ error: 'Order item registry failed.' }, { status: 500 });
      }
    } else {
      // Fallback mode for local development/Vercel demonstration
      console.warn('Supabase DB environment variables not configured. Using local JSON fallback.');
      const localCatalog = catalogData as any[];

      for (const item of items) {
        const artwork = localCatalog.find((a: any) => a.id === item.id);
        if (artwork) {
          totalAmount += artwork.price * (item.quantity || 1);
          itemNames.push(artwork.title);
        }
      }

      if (itemNames.length === 0) {
        return NextResponse.json({ error: 'No matching items found in the digital catalog.' }, { status: 400 });
      }
    }

    const merchantId = (process.env.PAYHERE_MERCHANT_ID || '').trim();
    const merchantSecret = (process.env.PAYHERE_MERCHANT_SECRET || process.env.PAYHERE_SECRET || '').trim();
    const currency = 'LKR';

    if (!merchantId || !merchantSecret) {
      console.error('PayHere credentials missing from server-side configuration.');
      return NextResponse.json({ error: 'Payment gateway configuration missing on server.' }, { status: 500 });
    }

    // Format amount strictly to 2 decimal places to match PayHere specifications
    const amountFormatted = parseFloat(totalAmount.toString()).toFixed(2);

    // Hash Generation Flow:
    // 1. MD5 hash of Merchant Secret (uppercase hex)
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    // 2. MD5 hash of: Merchant ID + Order ID + Amount + Currency + Hashed Secret (uppercase hex)
    const hashInput = merchantId + orderId + amountFormatted + currency + hashedSecret;
    const md5Signature = crypto
      .createHash('md5')
      .update(hashInput)
      .digest('hex')
      .toUpperCase();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Construct PayHere checkout configuration payload
    const payherePayload = {
      sandbox: process.env.PAYHERE_SANDBOX === 'true' || process.env.NODE_ENV !== 'production' || isMock,
      merchant_id: merchantId,
      return_url: `${appUrl}/downloads?status=success&order_id=${orderId}`,
      cancel_url: `${appUrl}/downloads?status=cancelled&order_id=${orderId}`,
      notify_url: `${process.env.PAYHERE_NOTIFY_URL || `${appUrl}/api/payhere/notify`}`,
      order_id: orderId,
      items: itemNames.join(', ').slice(0, 255), // PayHere items limit is 255 chars
      amount: amountFormatted,
      currency: currency,
      first_name: customerName?.split(' ')[0] || 'Digital',
      last_name: customerName?.split(' ').slice(1).join(' ') || 'Customer',
      email: customerEmail.trim().toLowerCase(),
      phone: phone || '0770000000',
      address: address || 'Digital Delivery',
      city: city || 'Colombo',
      country: 'Sri Lanka',
      hash: md5Signature
    };

    return NextResponse.json({
      success: true,
      ...payherePayload
    });

  } catch (err: any) {
    console.error('Secure checkout API error:', err);
    return NextResponse.json({ error: 'Internal Server Error during checkout generation.' }, { status: 500 });
  }
}
