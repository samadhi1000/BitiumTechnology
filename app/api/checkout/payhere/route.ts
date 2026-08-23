import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import catalogData from '@/lib/digital-catalog.json';

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { items, customerEmail, customerName, phone, address, city } = await req.json();

    if (!items || items.length === 0 || !customerEmail) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    let totalAmount = 0;
    const itemNames: string[] = [];
    let orderId = `mock_order_${Date.now()}`;
    const isMock = !supabaseUrl || !supabaseServiceRole;

    if (!isMock) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
      
      const productIds = items.map((i: any) => i.id);
      const { data: dbProducts } = await supabaseAdmin
        .from('digital_products')
        .select('id, price, title')
        .in('id', productIds);

      const orderItemsPayload: any[] = [];
      items.forEach((item: any) => {
        const prod = dbProducts?.find((p: any) => p.id === item.id);
        const resolvedPrice = prod?.price || Number(item.price) || 650;
        const resolvedTitle = prod?.title || item.title || 'Digital Item';
        const quantity = Number(item.quantity) || 1;

        totalAmount += resolvedPrice * quantity;
        itemNames.push(resolvedTitle);
        orderItemsPayload.push({
          product_id: item.id,
          price: resolvedPrice
        });
      });

      const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_email: customerEmail,
          customer_name: customerName || 'Digital Customer',
          total_amount: totalAmount,
          status: 'pending',
          payment_method: 'payhere'
        })
        .select()
        .single();

      if (!orderErr && order?.id) {
        orderId = order.id;
        const itemsWithOrderId = orderItemsPayload.map(item => ({
          ...item,
          order_id: order.id
        }));
        try {
          await supabaseAdmin.from('order_items').insert(itemsWithOrderId);
        } catch (_) {}
      }
    } else {
      // Fallback mode - use statically imported catalog or payload fallback
      const localCatalog = (catalogData || []) as any[];

      for (const item of items) {
        const artwork = localCatalog.find((a: any) => a.id === item.id || a.title?.toLowerCase() === item.title?.toLowerCase());
        const resolvedPrice = artwork?.price || Number(item.price) || 650;
        const resolvedTitle = artwork?.title || item.title || 'Digital Item';

        totalAmount += resolvedPrice * (Number(item.quantity) || 1);
        itemNames.push(resolvedTitle);
      }
    }

    // Trim to remove any accidental whitespace from env vars
    const merchantId = (process.env.PAYHERE_MERCHANT_ID || '1222222').trim();
    const merchantSecret = (process.env.PAYHERE_MERCHANT_SECRET || process.env.PAYHERE_SECRET || 'dummy_secret').trim();
    const currency = 'LKR';

    // Format amount: parseFloat ensures no stale comma separators, toFixed(2) gives exactly 2 decimals
    // e.g. 1800 → "1800.00", never "1,800.00"
    const amountFormatted = parseFloat(totalAmount.toString()).toFixed(2);

    // PayHere hash formula:
    // MD5( merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase() ).toUpperCase()
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const hashInput = merchantId + orderId + amountFormatted + currency + hashedSecret;
    console.log('[PayHere Hash Debug]', { merchantId, orderId, amountFormatted, currency, hashedSecret, hashInput });

    const md5Signature = crypto
      .createHash('md5')
      .update(hashInput)
      .digest('hex')
      .toUpperCase();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bitiumtechnology.com';
    const logoUrl = `${appUrl}/images/bitium-logo.webp`;

    const payherePayload = {
      // PAYHERE_SANDBOX=true forces sandbox mode even on Vercel production
      // Falls back to: true in development/mock mode, false in production with DB
      sandbox: process.env.PAYHERE_SANDBOX === 'true' || process.env.NODE_ENV !== 'production' || isMock,
      merchant_id: merchantId,
      return_url: `${appUrl}/checkout/success?order_id=${orderId}`,
      cancel_url: `${appUrl}/checkout/cancel?order_id=${orderId}`,
      notify_url: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL || `${appUrl}/api/payhere/notify`}`,
      order_id: orderId,
      items: itemNames.join(', '),
      amount: amountFormatted,
      currency: currency,
      logo_url: logoUrl,
      logo: logoUrl,
      first_name: customerName?.split(' ')[0] || 'Guest',
      last_name: customerName?.split(' ').slice(1).join(' ') || 'User',
      email: customerEmail,
      phone: phone || '0000000000',
      address: address || 'No Address Provided',
      city: city || 'Colombo',
      country: 'Sri Lanka',
      hash: md5Signature
    };

    return NextResponse.json(payherePayload);
  } catch (err: any) {
    console.error('Checkout API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


