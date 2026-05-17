import Link from 'next/link';
import { PlanCard } from '@/components/PlanCard';
import { customerBenefits, industries, monthlyScriptDrops, oneTimePlans, subscriptionPlans } from '@/lib/content';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Lead management for service businesses that sell on speed</span>
          <h1>Capture leads, quote jobs, follow up, and track the pipeline in one simple system.</h1>
          <p>LeadSprint uses your company profile, brand voice, service area, customer details, and industry playbooks to turn new inquiries into organized leads, professional estimates, tailored follow-up, and a cleaner path to booked work.</p>
          <div className="hero-actions">
            <Link href="/app" className="button">Open the builder</Link>
            <Link href="/checkout?plan=live" className="button secondary">Start LeadSprint Live</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>5 min</strong><span>response window worth protecting</span></div>
          <div className="stat"><strong>5-stage</strong><span>lead pipeline from new to won</span></div>
          <div className="stat"><strong>$29/mo</strong><span>live lead, quote, and follow-up tracking</span></div>
        </div>
      </section>

      <section className="section split">
        <div>
          <span className="eyebrow">Why it works</span>
          <h2>The job is won in the handoff between first contact and follow-up.</h2>
          <p>Most missed jobs do not need a bigger software stack. They need a faster response, clean lead notes, clearer pricing language, a simple deposit ask, and a follow-up rhythm that does not depend on memory.</p>
        </div>
        <div className="note-stack">
          {customerBenefits.map((note) => <p key={note}>{note}</p>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Live product</span>
          <h2>Manage the lead around the customer, the company, and the job.</h2>
          <p>Add the business name, service area, brand voice, trust promise, customer contact details, job notes, and quote details. LeadSprint then keeps the opportunity organized while changing the proof points, risks, prep notes, objections, and follow-up language for each industry.</p>
        </div>
        <div className="product-preview-grid">
          <article className="copy-card">
            <h3>Company profile</h3>
            <p>Save the business name, service area, brand voice, differentiators, and trust promise so every lead response sounds like the company.</p>
          </article>
          <article className="copy-card">
            <h3>Industry playbook</h3>
            <p>Switching from HVAC to plumbing, painting, roofing, or cleaning changes the risks, prep notes, proof points, objections, and follow-up strategy.</p>
          </article>
          <article className="copy-card">
            <h3>Lead workspace</h3>
            <p>After checkout, customers get the live workspace with saved leads, quote history, follow-up sequences, objection copy, and pipeline tracking.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">LeadSprint Live</span>
          <h2>A monthly lead management layer for teams that need every opportunity organized.</h2>
          <p>Subscribe for company profile memory, saved leads, industry-specific quote playbooks, customer history, monthly workflow drops, richer follow-up sequences, objection handling updates, and a simple win-rate tracker.</p>
        </div>
        <div className="feature-grid">
          {monthlyScriptDrops.map((item) => <article key={item.title}><h2>{item.title}</h2><p>{item.copy}</p></article>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Use cases</span>
          <h2>Built for home-service businesses where lead speed, clarity, and follow-up win the job.</h2>
        </div>
        <div className="industry-grid">
          {industries.map((industry) => <span key={industry}>{industry}</span>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Choose your workflow</span>
          <h2>Buy the kit once, or keep the live lead system running every month.</h2>
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
