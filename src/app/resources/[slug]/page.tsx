import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { articles, getArticle } from '@/lib/articles';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | LeadSprint`,
    description: article.description,
    openGraph: { title: article.title, description: article.description, type: 'article' },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);

  return (
    <article className="page-shell article-shell">
      <Link href="/resources" className="eyebrow">Resources / {article.category}</Link>
      <h1>{article.title}</h1>
      <p className="lead">{article.description}</p>
      <div className="article-meta">
        <span>Audience: {article.audience}</span>
        <span>Search intent: {article.intent}</span>
      </div>

      <div className="article-card callout-card">
        <h2>Quick answer</h2>
        <p>{article.sections[0].body[0]}</p>
      </div>

      {article.sections.map((section) => (
        <section key={section.heading} className="article-section">
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}

      {article.checklist && (
        <section className="article-card">
          <h2>Use this checklist</h2>
          <ul className="check-list">
            {article.checklist.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}

      <section className="article-card cta-card">
        <h2>Want this built for your business?</h2>
        <p>LeadSprint helps home-service businesses respond faster, write better follow-ups, track open opportunities, and keep every quote moving without a heavy CRM.</p>
        <div className="cta-row">
          <Link href="/pricing" className="button-primary">See plans</Link>
          <Link href="/app" className="button-secondary">Try the workspace</Link>
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2>Related guides</h2>
          <div className="feature-grid">
            {related.map((item) => <Link className="resource-link-card" href={`/resources/${item.slug}`} key={item.slug}><strong>{item.title}</strong><span>{item.description}</span></Link>)}
          </div>
        </section>
      )}
    </article>
  );
}
