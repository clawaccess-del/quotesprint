import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const priceEnv: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_ID_STARTER,
  pro: process.env.STRIPE_PRICE_ID_PRO,
  agency: process.env.STRIPE_PRICE_ID_AGENCY,
};

export async function POST(request: Request) {
  const { plan = 'pro' } = await request.json().catch(() => ({ plan: 'pro' }));
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = priceEnv[plan];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!secret || !price) {
    return NextResponse.json({
      ok: false,
      message: 'Stripe is scaffolded but not connected yet. Add STRIPE_SECRET_KEY and the matching STRIPE_PRICE_ID_* value in Vercel.',
    });
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    success_url: `${siteUrl}/app?success=true`,
    cancel_url: `${siteUrl}/pricing`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
