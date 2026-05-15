import Link from 'next/link';
import { QuoteBuilder } from '@/components/QuoteBuilder';
import { PlanCard } from '@/components/PlanCard';
import { customerBenefits, industries, monthlyScriptDrops, oneTimePlans, subscriptionPlans } from '@/lib/content';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Built for service businesses that sell on speed</span>
          <h1>Company-specific quotes, follow-ups, and booking scripts in minutes.</h1>
          <p>QuoteSprint uses your company profile, brand voice, service area, and industry playbooks to turn new inquiries into professional estimates, tailored follow-up messages, and a cleaner path to booked work.</p>
          <div className="hero-actions">
            <Link href="/app" className="button">Try the live builder</Link>
            <Link href="/checkout?plan=live" className="button secondary">Start QuoteSprint Live</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>5 min</strong><span>response window worth protecting</span></div>
          <div className="stat"><strong>4-step</strong><span>follow-up sequence for every quote</span></div>
          <div className="stat"><strong>$29/mo</strong><span>live quote history and tracking</span></div>
        </div>
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">Why it works</span>
          <h2>The best quote is the one your customer can say yes to quickly.</h2>
          <p>Most missed jobs do not need a bigger software stack. They need a faster response, clearer pricing language, a simple deposit ask, and a follow-up rhythm that does not depend on memory.</p>
        </div>
        <div className="note-stack">
          {customerBenefits.map((note) => <p key={note}>{note}</p>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Live product</span>
          <h2>Build the quote around the company, not just the job type.</h2>
          <p>Add the business name, service area, brand voice, trust promise, and customer-specific job details. QuoteSprint then changes the actual proof points, risks, prep notes, objections, and follow-up language for each industry.</p>
        </div>
        <QuoteBuilder />
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">QuoteSprint Live</span>
          <h2>A monthly layer for teams that want more custom, more useful outputs.</h2>
          <p>Subscribe for company profile memory, industry-specific playbooks, saved quote history, monthly script drops, richer follow-up sequences, objection handling updates, and a simple win-rate tracker.</p>
        </div>
        <div className="feature-grid">
          {monthlyScriptDrops.map((item) => <article key={item.title}><h2>{item.title}</h2><p>{item.copy}</p></article>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Use cases</span>
          <h2>Built for home-service businesses where speed and clarity win the job.</h2>
        </div>
        <div className="industry-grid">
          {industries.map((industry) => <span key={industry}>{industry}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Choose your workflow</span>
          <h2>Buy the kit once, or keep the live system running every month.</h2>
        </div>
        <div className="plans subscription-plans">
          {subscriptionPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
        <div className="plans">
          {oneTimePlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
      </section>
    </>
  );
}
