import Stripe from 'stripe';

export type Entitlement = {
  plan: string;
  mode: 'payment' | 'subscription';
  sessionId: string;
  customerEmail?: string;
};

const planRank: Record<string, number> = {
  starter: 1,
  pro: 2,
  agency: 3,
  live: 4,
  live_ai: 5,
};

const allowedPlans = new Set(Object.keys(planRank));

function betterPlan(current?: Entitlement | null, next?: Entitlement | null) {
  if (!next) return current || null;
  if (!current) return next;
  return (planRank[next.plan] || 0) > (planRank[current.plan] || 0) ? next : current;
}

function findManualEntitlementByEmail(email: string): Entitlement | null {
  const manualAccess = process.env.MANUAL_ACCESS_EMAILS || '';
  const match = manualAccess
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawEmail, rawPlan] = entry.split(':');
      return { email: rawEmail?.trim().toLowerCase(), plan: rawPlan?.trim() || 'live_ai' };
    })
    .find((entry) => entry.email === email && allowedPlans.has(entry.plan));

  if (!match) return null;
  return {
    plan: match.plan,
    mode: 'subscription',
    sessionId: `manual:${email}`,
    customerEmail: email,
  };
}

export async function findStripeEntitlementByEmail(stripe: Stripe, email: string): Promise<Entitlement | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  let best: Entitlement | null = findManualEntitlementByEmail(normalizedEmail);
  const customers = await stripe.customers.search({ query: `email:'${normalizedEmail.replace(/'/g, "\\'")}'`, limit: 10 });

  for (const customer of customers.data) {
    const customerEmail = typeof customer.email === 'string' ? customer.email : normalizedEmail;

    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 20 });
    for (const subscription of subscriptions.data) {
      if (!['active', 'trialing'].includes(subscription.status)) continue;
      const plan = subscription.metadata?.plan;
      if (!plan || !allowedPlans.has(plan)) continue;
      best = betterPlan(best, {
        plan,
        mode: 'subscription',
        sessionId: subscription.id,
        customerEmail,
      });
    }

    const sessions = await stripe.checkout.sessions.list({ customer: customer.id, limit: 20 });
    for (const session of sessions.data) {
      const plan = session.metadata?.plan;
      if (!plan || !allowedPlans.has(plan)) continue;

      if (session.mode === 'subscription') {
        if (session.subscription && best?.sessionId === session.subscription) continue;
        continue;
      }

      if (session.mode === 'payment' && session.payment_status === 'paid') {
        best = betterPlan(best, {
          plan,
          mode: 'payment',
          sessionId: session.id,
          customerEmail: session.customer_details?.email || customerEmail,
        });
      }
    }
  }

  return best;
}
