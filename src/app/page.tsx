import Link from 'next/link';
import { QuoteBuilder } from '@/components/QuoteBuilder';
import { PlanCard } from '@/components/PlanCard';
import { industries, plans, researchNotes } from '@/lib/content';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Built for service businesses that sell on speed</span>
          <h1>Turn a fresh lead into a clear quote, follow-up text, and booking script in under two minutes.</h1>
          <p>QuoteSprint is a digital product for contractors and local-service teams who lose money when leads sit, quotes feel messy, or follow-up sounds improvised.</p>
          <div className="hero-actions">
            <Link href="/app" className="button">Try the live builder</Link>
            <Link href="/checkout?plan=pro" className="button secondary">Buy the Pro Kit</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>5 min</strong><span>target response window</span></div>
          <div className="stat"><strong>3 scripts</strong><span>SMS, email, and call close</span></div>
          <div className="stat"><strong>0 CRM bloat</strong><span>just the workflow that wins</span></div>
        </div>
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">Market thesis</span>
          <h2>A narrow product beats another generic AI tool.</h2>
          <p>Digital products sell when they package a specific outcome. QuoteSprint focuses on one expensive moment: the gap between a new inquiry and a confident booked estimate.</p>
        </div>
        <div className="note-stack">
          {researchNotes.map((note) => <p key={note}>{note}</p>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Live product preview</span>
          <h2>The core tool is already useful before Stripe is connected.</h2>
          <p>Adjust the job details and QuoteSprint generates a professional estimate, deposit ask, SMS, email, and call script.</p>
        </div>
        <QuoteBuilder />
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Use cases</span>
          <h2>Specific enough to feel made for the buyer.</h2>
        </div>
        <div className="industry-grid">
          {industries.map((industry) => <span key={industry}>{industry}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Offer ladder</span>
          <h2>Simple ecommerce pricing now, subscription expansion later.</h2>
        </div>
        <div className="plans">
          {plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
      </section>
    </>
  );
}
