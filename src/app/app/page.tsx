import Link from 'next/link';
import { QuoteBuilder } from '@/components/QuoteBuilder';

export default function AppPage() {
  return (
    <section className="page-shell wide">
      <span className="eyebrow">Live builder</span>
      <h1>Generate the quote, save the opportunity, and send the next message.</h1>
      <p className="lead">Use QuoteSprint to create a clear estimate, deposit ask, follow-up copy, call script, four-step sequence, and lightweight quote tracker.</p>
      <div className="hero-actions app-actions">
        <Link href="/checkout?plan=live" className="button">Start QuoteSprint Live</Link>
        <Link href="/pricing" className="button secondary">Compare plans</Link>
      </div>
      <QuoteBuilder />
    </section>
  );
}
