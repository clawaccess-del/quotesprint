import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSignedToken } from '@/lib/access';
import { findStripeEntitlementByEmail, type Entitlement } from '@/lib/entitlements';
import { findClientAccountByEmail } from '@/lib/supabase';

function redirectToLogin(siteUrl: string, sent = true) {
  return NextResponse.redirect(`${siteUrl}/login${sent ? '?sent=1' : ''}`, 303);
}

async function sendLoginEmail(email: string, loginUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM || 'LeadSprint <login@quotesprint.app>';
  if (!apiKey) throw new Error('Missing RESEND_API_KEY');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Your LeadSprint login link',
      html: `<p>Use this secure link to log in to LeadSprint:</p><p><a href="${loginUrl}">Log in to LeadSprint</a></p><p>This link expires in 15 minutes.</p>`,
      text: `Use this secure link to log in to LeadSprint: ${loginUrl}\n\nThis link expires in 15 minutes.`,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend failed: ${response.status} ${body}`);
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!email) return redirectToLogin(siteUrl);

  try {
    let entitlement: Entitlement | null = await findClientAccountByEmail(email)
      .then((client) => client ? ({
        plan: client.plan,
        mode: 'subscription' as const,
        sessionId: `client:${client.accountId}`,
        customerEmail: client.email,
      }) : null)
      .catch(() => null);

    if (!entitlement && secret) {
      const stripe = new Stripe(secret);
      entitlement = await findStripeEntitlementByEmail(stripe, email);
    }

    if (entitlement) {
      const token = createSignedToken({
        ...entitlement,
        customerEmail: entitlement.customerEmail || email,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });
      await sendLoginEmail(email, `${siteUrl}/api/auth/verify?token=${encodeURIComponent(token)}`);
    }
  } catch (error) {
    console.error('Login link request failed', error);
  }

  return redirectToLogin(siteUrl);
}
