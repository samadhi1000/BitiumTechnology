import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Client with Service Role Key to safely insert orders
export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRole) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json({ error: 'Internal Server Error: Database config missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

    const { items, customerEmail, customerName, phone, address, city } = await req.json();

    // 1. Basic Validation
    if (!items || items.length === 0 || !customerEmail) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 2. Fetch products and calculate total price
    const productIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from('digital_products')
      .select('id, price, title')
      .in('id', productIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: 'Failed to verify items' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItemsPayload: any[] = [];
    const itemNames: string[] = [];

    dbProducts.forEach(prod => {
      const quantity = items.find((i: any) => i.id === prod.id)?.quantity || 1;
      totalAmount += prod.price * quantity;
      itemNames.push(prod.title);
      orderItemsPayload.push({
        product_id: prod.id,
        price: prod.price
      });
    });

    // 3. Create Pending Order in Supabase
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

    // Insert Order Items
    const itemsWithOrderId = orderItemsPayload.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsErr) {
      console.error('Order items insertion error:', itemsErr);
      return NextResponse.json({ error: 'Failed to record order items' }, { status: 500 });
    }

    // 4. Generate PayHere Parameters & MD5 Signature
    const merchantId = process.env.PAYHERE_MERCHANT_ID!;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;
    const currency = 'LKR'; 
    const orderId = order.id;

    // Formatting amount to 2 decimal places as required by PayHere
    const amountFormatted = totalAmount.toFixed(2);

    // Generate MD5 hash of Merchant Secret (Uppercase)
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    // MD5 Signature calculation formula:
    // UpperCase(MD5(MerchantID + OrderID + Amount + Currency + UpperCase(MD5(MerchantSecret))))
    const md5Signature = crypto
      .createHash('md5')
      .update(merchantId + orderId + amountFormatted + currency + hashedSecret)
      .digest('hex')
      .toUpperCase();

    // 5. Construct Payload for Frontend redirection
    const payherePayload = {
      sandbox: process.env.NODE_ENV !== 'production',
      merchant_id: merchantId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?order_id=${orderId}`,
      notify_url: `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/payhere-ipn`,
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
