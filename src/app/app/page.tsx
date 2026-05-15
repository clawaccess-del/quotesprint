import Link from 'next/link';
import { cookies } from 'next/headers';
import { QuoteBuilder } from '@/components/QuoteBuilder';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';

export default async function AppPage() {
  const cookieStore = await cookies();
  const access = verifyAccessToken(cookieStore.get(ACCESS_COOKIE)?.value);

  if (!access) {
    return (
      <section className="page-shell checkout-shell">
        <span className="eyebrow">Paid access</span>
        <h1>Unlock the live QuoteSprint builder.</h1>
        <p className="lead">The full builder is served after checkout. Choose a one-time kit or start QuoteSprint Live to access company profiles, industry playbooks, saved quote history, follow-up sequences, and pipeline tracking.</p>
        <div className="checkout-card">
          <h2>Get access</h2>
          <p>Secure checkout is handled by Stripe. After payment, QuoteSprint automatically verifies the purchase and opens the builder in this browser.</p>
          <div className="hero-actions">
            <Link href="/checkout?plan=live" className="button">Start QuoteSprint Live</Link>
            <Link href="/pricing" className="button secondary">Compare plans</Link>
          </div>
          <p className="fine-print">Already purchased? Use the confirmation link from checkout to restore access in this browser.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell wide">
      <span className="eyebrow">{access.plan === 'live' ? 'QuoteSprint Live' : 'QuoteSprint customer access'}</span>
      <h1>Generate the quote, save the opportunity, and send the next message.</h1>
      <p className="lead">Use QuoteSprint to create company-specific estimates, deposit asks, follow-up copy, call scripts, industry-specific objection responses, four-step sequences, and lightweight quote tracking.</p>
      <div className="access-banner">
        <strong>Access active</strong>
        <span>{access.plan === 'live' ? 'Monthly subscription' : 'One-time product'} unlocked for this browser.</span>
      </div>
      <QuoteBuilder />
    </section>
  );
}
