import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const priceEnv: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_ID_STARTER,
  pro: process.env.STRIPE_PRICE_ID_PRO,
  agency: process.env.STRIPE_PRICE_ID_AGENCY,
  live: process.env.STRIPE_PRICE_ID_LIVE_MONTHLY,
};

const subscriptionPlans = new Set(['live']);

export async function POST(request: Request) {
  const { plan = 'pro' } = await request.json().catch(() => ({ plan: 'pro' }));
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = priceEnv[plan];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!secret || !price) {
    return NextResponse.json({
      ok: false,
      message: 'Checkout is temporarily unavailable. Please try again in a few minutes.',
    }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: subscriptionPlans.has(plan) ? 'subscription' : 'payment',
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${siteUrl}/app?success=true`,
    cancel_url: `${siteUrl}/pricing`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
