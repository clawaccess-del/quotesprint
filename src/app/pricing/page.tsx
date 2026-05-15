import { PlanCard } from '@/components/PlanCard';
import { plans } from '@/lib/content';

export default function PricingPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Pricing</span>
      <h1>Sell it as a high-margin digital product first.</h1>
      <p className="lead">One-time purchase tiers keep the first version simple. Stripe checkout is already scaffolded so payment can be connected with live price IDs.</p>
      <div className="plans">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>
    </section>
  );
}
