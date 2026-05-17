import Link from 'next/link';

const features = [
  ['Company profile memory', 'Save business name, service area, brand voice, differentiators, and trust promises so every response sounds like the company.'],
  ['Lead intake workspace', 'Capture names, phone numbers, emails, addresses, notes, status, and the next sales step before the opportunity gets buried.'],
  ['Industry-specific quote builder', 'Calculate a working estimate with labor, materials, urgency, deposit logic, and a playbook that changes by trade.'],
  ['Follow-up engine', 'Generate SMS, email, call, objection, and multi-day follow-up copy that keeps the next step clear.'],
  ['Customer and quote history', 'Keep recent leads and estimates organized so open opportunities do not disappear between calls, jobs, and inboxes.'],
  ['Win-rate tracker', 'Mark opportunities as new, quoted, followed-up, won, or lost and see pipeline health at a glance.'],
  ['Simple by design', 'LeadSprint gives small service businesses the lead workflow they need without forcing a full CRM rollout.'],
];

export default function ProductPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Product</span>
      <h1>A practical lead management system for local-service teams.</h1>
      <p className="lead">LeadSprint helps home-service businesses respond faster, capture customer details, present estimates clearly, follow up consistently, and track every opportunity from first contact to booked work.</p>
      <div className="feature-grid">
        {features.map(([title, copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p></article>)}
      </div>
      <div className="cta-panel">
        <h2>Use the builder free, then upgrade when you want the full lead operating system.</h2>
        <p>The one-time kits give you the core templates. LeadSprint Live adds company profile memory, customer records, industry playbooks, saved quote history, follow-up sequences, monthly workflow updates, and pipeline tracking.</p>
        <div className="hero-actions">
          <Link href="/app" className="button">Open the builder</Link>
          <Link href="/checkout?plan=live" className="button secondary">Start LeadSprint Live</Link>
        </div>
      </div>
    </section>
  );
}
