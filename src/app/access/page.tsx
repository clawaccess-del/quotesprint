import Link from 'next/link';

export default function AccessPage() {
  return (
    <section className="page-shell checkout-shell">
      <span className="eyebrow">Customer access</span>
      <h1>QuoteSprint opens automatically after checkout.</h1>
      <p className="lead">After a successful Stripe payment, QuoteSprint verifies the purchase and unlocks the live builder in this browser. No complicated account setup is required.</p>
      <div className="checkout-card">
        <h2>Need access?</h2>
        <p>If you have not purchased yet, choose the plan that fits your workflow. If you just completed checkout and landed here, return to the payment confirmation link or start checkout again with the same email.</p>
        <div className="hero-actions">
          <Link href="/checkout?plan=live_ai" className="button">Start Live + AI</Link>
          <Link href="/pricing" className="button secondary">Compare plans</Link>
        </div>
      </div>
    </section>
  );
}
