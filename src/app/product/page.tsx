import Link from 'next/link';

const features = [
  ['Quote builder', 'Calculate a working estimate with labor, materials, urgency, and deposit logic in one clean workflow.'],
  ['Follow-up engine', 'Generate SMS, email, call, and multi-day follow-up copy that keeps the next step clear.'],
  ['Saved quote history', 'Keep recent estimates organized so open opportunities do not disappear between calls, jobs, and inboxes.'],
  ['Win-rate tracker', 'Mark quotes as open, won, or lost and see the health of your quoted pipeline at a glance.'],
  ['Monthly script drops', 'Get fresh seasonal, trade-specific, and objection-handling copy for the moments that decide the sale.'],
  ['Simple by design', 'QuoteSprint gives small service businesses the sales workflow they need without forcing a full CRM rollout.'],
];

export default function ProductPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Product</span>
      <h1>A practical quote-and-follow-up system for local-service teams.</h1>
      <p className="lead">QuoteSprint helps home-service businesses respond faster, present estimates more clearly, and keep every open quote moving toward a decision.</p>
      <div className="feature-grid">
        {features.map(([title, copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p></article>)}
      </div>
      <div className="cta-panel">
        <h2>Use the builder free, then upgrade when you want the full operating system.</h2>
        <p>The one-time kits give you the core templates. QuoteSprint Live adds saved quote history, follow-up sequences, monthly script updates, and pipeline tracking.</p>
        <div className="hero-actions">
          <Link href="/app" className="button">Open the builder</Link>
          <Link href="/checkout?plan=live" className="button secondary">Start QuoteSprint Live</Link>
        </div>
      </div>
    </section>
  );
}
