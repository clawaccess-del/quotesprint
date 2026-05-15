import Link from 'next/link';
import { cookies } from 'next/headers';
import { QuoteBuilder } from '@/components/QuoteBuilder';
import { AIEnhancer } from '@/components/AIEnhancer';
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/access';

export default async function AppPage() {
  const cookieStore = await cookies();
  const access = verifyAccessToken(cookieStore.get(ACCESS_COOKIE)?.value);

  if (!access) {
    return (
      <section className="page-shell checkout-shell">
        <span className="eyebrow">Paid access</span>
        <h1>Unlock the live QuoteSprint builder.</h1>
        <p className="lead">The full builder is served after checkout. Choose a one-time kit, start QuoteSprint Live, or add AI credits for deeper brand-voice customization.</p>
        <div className="checkout-card">
          <h2>Get access</h2>
          <p>Secure checkout is handled by Stripe. After payment, QuoteSprint automatically verifies the purchase and opens the builder in this browser.</p>
          <div className="hero-actions">
            <Link href="/checkout?plan=live_ai" className="button">Start Live + AI</Link>
            <Link href="/pricing" className="button secondary">Compare plans</Link>
          </div>
          <p className="fine-print">Already purchased? Use the confirmation link from checkout to restore access in this browser.</p>
        </div>
      </section>
    );
  }

  const aiEnabled = access.plan === 'live_ai';

  return (
    <section className="page-shell wide">
      <span className="eyebrow">{aiEnabled ? 'QuoteSprint Live + AI' : access.plan === 'live' ? 'QuoteSprint Live' : 'QuoteSprint customer access'}</span>
      <h1>Generate the quote, save the opportunity, and send the next message.</h1>
      <p className="lead">Use QuoteSprint to create company-specific estimates, deposit asks, follow-up copy, call scripts, industry-specific objection responses, four-step sequences, and lightweight quote tracking.</p>
      <div className="access-banner">
        <strong>Access active</strong>
        <span>{aiEnabled ? 'AI credits unlocked with a 100-credit monthly cap.' : access.plan === 'live' ? 'Monthly non-AI system unlocked. Upgrade anytime for AI credits.' : 'One-time product unlocked for this browser.'}</span>
      </div>
      <QuoteBuilder />
      <AIEnhancer enabled={aiEnabled} />
    </section>
  );
}
