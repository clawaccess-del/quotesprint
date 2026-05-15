import Link from 'next/link';

const resources = [
  ['Speed-to-lead checklist', 'A one-page operating rhythm for responding before the lead calls someone else.'],
  ['Quote follow-up swipe file', 'Short message patterns for estimate delivery, deposit requests, and gentle urgency.'],
  ['Home-service ROI calculator', 'A simple way to show how one recovered job can justify the kit.'],
];

export default function ResourcesPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Ecosystem</span>
      <h1>Resources that make the product easier to market.</h1>
      <p className="lead">The site includes SEO-friendly resource positioning so QuoteSprint is more than a checkout page. It can attract service-business owners searching for quote, follow-up, and lead response help.</p>
      <div className="feature-grid">
        {resources.map(([title, copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p><Link href="/app">Use the builder</Link></article>)}
      </div>
    </section>
  );
}
