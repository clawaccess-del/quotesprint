import Link from 'next/link';

const features = [
  ['Estimate framing', 'Calculate a working quote with labor, materials, urgency, and deposit logic.'],
  ['First-response scripts', 'Generate SMS, email, and call scripts that sound direct, professional, and fast.'],
  ['Sales confidence', 'Turn “I’ll get back to you” into a clear booking ask with the next step included.'],
  ['No heavy setup', 'Built for owners and crews who do not want to configure a full CRM before seeing value.'],
];

export default function ProductPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Product</span>
      <h1>A practical quote-and-follow-up engine for local-service teams.</h1>
      <p className="lead">QuoteSprint is both a sellable digital kit and a working browser tool. It packages calculators, scripts, and response workflows around the highest-intent moment in a home-service sale.</p>
      <div className="feature-grid">
        {features.map(([title, copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p></article>)}
      </div>
      <div className="cta-panel">
        <h2>Start with the builder, then buy the full workflow kit.</h2>
        <p>The live builder proves the product. The paid kits add deeper templates, seasonal campaigns, objection handling, and agency usage rights.</p>
        <Link href="/app" className="button">Open the builder</Link>
      </div>
    </section>
  );
}
