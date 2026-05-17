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
        <h1>Unlock the live LeadSprint workspace.</h1>
        <p className="lead">The full lead management workspace is served after checkout. Choose a one-time kit, start LeadSprint Live, or add AI credits for deeper brand-voice customization.</p>
        <div className="checkout-card">
          <h2>Get access</h2>
          <p>Secure checkout is handled by Stripe. After payment, LeadSprint automatically verifies the purchase and opens the builder. Returning customers can log in by email.</p>
          <div className="hero-actions">
            <Link href="/checkout?plan=live_ai" className="button">Start Live + AI</Link>
            <Link href="/login" className="button secondary">Log in by email</Link>
            <Link href="/pricing" className="button secondary">Compare plans</Link>
          </div>
          <p className="fine-print">Already purchased? Enter the checkout email on the login page and LeadSprint will send a secure access link.</p>
        </div>
      </section>
    );
  }

  const aiEnabled = access.plan === 'live_ai';

  return (
    <section className="page-shell wide">
      <span className="eyebrow">{aiEnabled ? 'LeadSprint Live + AI' : access.plan === 'live' ? 'LeadSprint Live' : 'LeadSprint customer access'}</span>
      <h1>Capture the lead, generate the quote, save the opportunity, and send the next message.</h1>
      <p className="lead">Use LeadSprint to manage customer details, create company-specific estimates, write deposit asks, generate follow-up copy, handle objections, run four-step sequences, and track the pipeline.</p>
      <div className="access-banner">
        <strong>Access active</strong>
        <span>{aiEnabled ? 'AI credits unlocked with a 100-credit monthly cap.' : access.plan === 'live' ? 'Monthly non-AI system unlocked. Upgrade anytime for AI credits.' : 'One-time product unlocked for this browser.'}</span>
      </div>
      <div className="download-panel">
        <strong>Downloads included</strong>
        <span>Save the relevant LeadSprint kit for offline use, onboarding, or team reference.</span>
        <div className="hero-actions">
          <a className="button secondary" href="/api/download?product=starter">Download Starter Kit</a>
          {['pro', 'agency', 'live', 'live_ai'].includes(access.plan) ? <a className="button secondary" href="/api/download?product=pro">Download Pro Kit</a> : null}
          {access.plan === 'agency' ? <a className="button secondary" href="/api/download?product=agency">Download Agency Kit</a> : null}
        </div>
      </div>
      <QuoteBuilder accountEmail={access.customerEmail} aiEnabled={aiEnabled} />
    </section>
  );
}
