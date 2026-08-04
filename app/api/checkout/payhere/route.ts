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
      const { data: dbProducts, error: dbError } = await supabaseAdmin
        .from('digital_products')
        .select('id, price, title')
        .in('id', productIds);

      if (dbError || !dbProducts || dbProducts.length === 0) {
        return NextResponse.json({ error: 'Failed to verify items' }, { status: 400 });
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

      const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_email: customerEmail,
          customer_name: customerName,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: 'payhere'
        })
        .select()
        .single();

      if (orderErr || !order) {
        console.error('Order creation error:', orderErr);
        return NextResponse.json({ error: 'Order placement failed' }, { status: 500 });
      }

      orderId = order.id;

      const itemsWithOrderId = orderItemsPayload.map(item => ({
        ...item,
        order_id: order.id
      }));
      
      await supabaseAdmin.from('order_items').insert(itemsWithOrderId);
    } else {
      // Fallback mode — use statically imported catalog (works on Vercel)
      console.warn('Database config missing, using local fallback mode for testing');
      const localCatalog = catalogData as any[];

      for (const item of items) {
        const artwork = localCatalog.find((a: any) => a.id === item.id);
        if (artwork) {
          totalAmount += artwork.price * (item.quantity || 1);
          itemNames.push(artwork.title);
        }
      }
      if (itemNames.length === 0) {
        return NextResponse.json({ error: 'Items not found in catalog' }, { status: 400 });
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

    const payherePayload = {
      // PAYHERE_SANDBOX=true forces sandbox mode even on Vercel production
      // Falls back to: true in development/mock mode, false in production with DB
      sandbox: process.env.PAYHERE_SANDBOX === 'true' || process.env.NODE_ENV !== 'production' || isMock,
      merchant_id: merchantId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel?order_id=${orderId}`,
      notify_url: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL || 'http://localhost:3000'}/payhere-ipn`,
      order_id: orderId,
      items: itemNames.join(', '),
      amount: amountFormatted,
      currency: currency,
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


