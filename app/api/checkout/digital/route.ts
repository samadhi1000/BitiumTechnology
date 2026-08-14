import { NextResponse } from 'next/server';
import { createDigitalPurchase, getDigitalArtworkById } from '@/lib/digital';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || body.customerEmail;
    let items = body.items;

    if (!items && body.artwork_id) {
      items = [{ id: body.artwork_id }];
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items selected for checkout' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 });
    }

    // Resolve details and calculate totals
    const purchases = [];
    
    // In production, we would initialize Stripe:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({ ... })
    // For local development and demonstration, we simulate the webhook flow by creating the tokens immediately:
    
    for (const item of items) {
      const artwork = await getDigitalArtworkById(item.id);
      if (!artwork) {
        return NextResponse.json({ error: `Artwork with ID ${item.id} not found` }, { status: 404 });
      }

      // Generate a digital purchase token
      const purchase = await createDigitalPurchase(email, artwork.id);
      if (purchase) {
        purchases.push({
          artworkId: artwork.id,
          title: artwork.title,
          token: purchase.download_token
        });
      }
    }

    // Return the mock checkout url which directly takes the user to the success page
    // in real production, this would be stripe.url, and the webhook would create the tokens.
    // For multiple items, we pass the first token as primary and send others in context or emails.
    const primaryToken = purchases[0]?.token || '';
    const mockRedirectUrl = `/downloads/success?token=${primaryToken}&email=${encodeURIComponent(email)}`;

    return NextResponse.json({ 
      url: mockRedirectUrl,
      success: true,
      purchases
    });
  } catch (err: any) {
    console.error('Error creating checkout transaction:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
