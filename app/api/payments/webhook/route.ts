import { NextResponse } from 'next/server';
import { createDigitalPurchase } from '@/lib/digital';

// In a real production environment, you would import Stripe:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  try {
    console.log('Payment webhook received successfully');
    
    // In production:
    // let event;
    // try {
    //   event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
    // } catch (err: any) {
    //   return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    // }
    
    // For local mock demonstration, parse the JSON payload directly:
    const event = JSON.parse(payload);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.metadata?.email;
      const artworkIdsString = session.metadata?.artwork_ids || ''; // comma-separated ids

      if (customerEmail && artworkIdsString) {
        const artworkIds = artworkIdsString.split(',');
        console.log(`Processing successful payment for: ${customerEmail}, items: ${artworkIdsString}`);

        for (const artworkId of artworkIds) {
          const purchase = await createDigitalPurchase(customerEmail, artworkId, session.id);
          if (purchase) {
            console.log(`Generated download token for ${artworkId}: ${purchase.download_token}`);
            
            // Send Order Success Email logic goes here:
            // e.g. await sendEmail({
            //   to: customerEmail,
            //   subject: 'Your Bitium Technologies - Secure Download Link',
            //   body: `Here is your secure link: https://bitium.com/downloads/success?token=${purchase.download_token}`
            // });
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error handling payment webhook:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
