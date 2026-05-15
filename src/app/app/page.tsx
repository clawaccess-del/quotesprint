import { QuoteBuilder } from '@/components/QuoteBuilder';

export default function AppPage() {
  return (
    <section className="page-shell wide">
      <span className="eyebrow">Live builder</span>
      <h1>Generate the quote, the deposit ask, and the follow-up copy.</h1>
      <p className="lead">This is the first shippable version of the product: useful, demoable, and ready to sit behind Stripe later if desired.</p>
      <QuoteBuilder />
    </section>
  );
}
