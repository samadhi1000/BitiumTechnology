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
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

    let totalAmount = 0;
    const itemNames: string[] = [];
    let orderId = `dig_ord_${Date.now()}`;
    const isMock = !supabaseUrl || !supabaseServiceRole || supabaseUrl.includes('placeholder');

    const localCatalog = catalogData as any[];

    // Calculate total amount and resolve item names safely
    for (const item of items) {
      let resolvedPrice = 0;
      let resolvedTitle = item.title || 'Digital Artwork';

      // 1. Check local static catalog first
      const matchedLocal = localCatalog.find((a: any) => a.id === item.id || a.title?.toLowerCase() === item.title?.toLowerCase());
      if (matchedLocal) {
        resolvedPrice = matchedLocal.price;
        resolvedTitle = matchedLocal.title;
      } else if (item.price && !isNaN(Number(item.price))) {
        // 2. Use price provided in verified payload
        resolvedPrice = Number(item.price);
      } else {
        // Default minimum price if completely missing
        resolvedPrice = 650;
      }

      totalAmount += resolvedPrice * (item.quantity || 1);
      itemNames.push(resolvedTitle);
    }

    // Try to register pending order in Supabase if active
    if (!isMock && supabaseUrl && supabaseServiceRole) {
      try {
        const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
        const { data: order, error: orderErr } = await supabaseClient
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

        if (!orderErr && order?.id) {
          orderId = order.id;
        }
      } catch (dbErr) {
        console.warn('Supabase order insert fallback to local order ID:', dbErr);
      }
    }

    const merchantId = (process.env.PAYHERE_MERCHANT_ID || '1237287').trim();
    const merchantSecret = (process.env.PAYHERE_MERCHANT_SECRET || process.env.PAYHERE_SECRET || 'MjA2MzA3MDQyNzM4NzU0NDg0NDUyOTAyMzU3MTI3MjYwNzM4OTA1OA==').trim();
    const currency = 'LKR';

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bitiumtechnology.com';

    // Construct PayHere checkout configuration payload
    const payherePayload = {
      sandbox: process.env.PAYHERE_SANDBOX === 'true' || process.env.NODE_ENV !== 'production' || isMock,
      merchant_id: merchantId,
      return_url: `${appUrl}/downloads?status=success&order_id=${orderId}`,
      cancel_url: `${appUrl}/downloads?status=cancelled&order_id=${orderId}`,
      notify_url: `${process.env.PAYHERE_NOTIFY_URL || `${appUrl}/api/payhere/notify`}`,
      order_id: orderId,
      items: itemNames.join(', ').slice(0, 100),
      amount: amountFormatted,
      currency: currency,
      hash: md5Signature,
      first_name: (customerName || 'Digital').split(' ')[0] || 'Customer',
      last_name: (customerName || 'Customer').split(' ').slice(1).join(' ') || 'User',
      email: customerEmail.trim().toLowerCase(),
      phone: phone || '0770000000',
      address: address || 'Bitium Digital Vault',
      city: city || 'Colombo',
      country: 'Sri Lanka',
      delivery_address: address || 'Digital Instant Delivery',
      delivery_city: city || 'Online',
      delivery_country: 'Sri Lanka'
    };

    return NextResponse.json(payherePayload, { status: 200 });

  } catch (error: any) {
    console.error('PayHere Checkout API Error:', error);
    return NextResponse.json({ 
      error: 'An internal server error occurred while preparing gateway parameters.' 
    }, { status: 500 });
  }
}
