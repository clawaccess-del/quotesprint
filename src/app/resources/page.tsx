import Link from 'next/link';
import { articles } from '@/lib/articles';

const resources = [
  ['Speed-to-lead checklist', 'A simple response rhythm for replying while the customer is still ready to book.'],
  ['Lead intake checklist', 'The customer details, job notes, and urgency signals to capture before the opportunity gets cold.'],
  ['Quote follow-up swipe file', 'Short message patterns for estimate delivery, deposit requests, quiet leads, and final check-ins.'],
  ['Home-service ROI calculator', 'A practical way to see how one recovered job can pay for a better follow-up system.'],
  ['Open opportunity tracker', 'A lightweight way to review pending leads and estimates before they turn cold.'],
  ['Deposit language guide', 'Clear wording that helps customers understand how to reserve an appointment without pressure.'],
];

const categories = Array.from(new Set(articles.map((article) => article.category)));

export default function ResourcesPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Resources</span>
      <h1>Cleaner lead intake, better follow-up, and fewer forgotten opportunities.</h1>
      <p className="lead">LeadSprint gives home-service businesses practical tools for every moment between first contact and booked work.</p>

      <div className="feature-grid">
        {resources.map(([title, copy]) => <article key={title}><h2>{title}</h2><p>{copy}</p><Link href="/app">Try it in the builder</Link></article>)}
      </div>

      <section className="article-index-intro">
        <span className="eyebrow">Speed-to-lead learning center</span>
        <h2>Helpful guides for turning more home-service leads into booked jobs.</h2>
        <p>Start with the core speed-to-lead and follow-up guides, then use the trade-specific templates for the way your customers actually ask questions.</p>
      </section>

      {categories.map((category) => (
        <section className="article-index-section" key={category}>
          <h2>{category}</h2>
          <div className="article-index-grid">
            {articles.filter((article) => article.category === category).map((article) => (
              <Link className="resource-link-card" href={`/resources/${article.slug}`} key={article.slug}>
                <span>{article.intent}</span>
                <strong>{article.title}</strong>
                <p>{article.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
