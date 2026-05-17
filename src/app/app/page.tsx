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
    <section className="page-shell wide dashboard-shell">
      <div className="dashboard-topbar">
        <div>
          <span className="eyebrow">{aiEnabled ? 'LeadSprint Live + AI' : access.plan === 'live' ? 'LeadSprint Live' : 'LeadSprint customer access'}</span>
          <h1>Client dashboard</h1>
          <p>Manage leads, quotes, follow-ups, sales activity, and saved customer history.</p>
        </div>
        <div className="dashboard-quick-actions">
          <Link href="/support" className="button secondary">Support</Link>
          <a className="button secondary" href="/api/download?product=starter">Download kit</a>
        </div>
      </div>
      <QuoteBuilder accountEmail={access.customerEmail} aiEnabled={aiEnabled} />
    </section>
  );
}
