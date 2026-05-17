import { PlanCard } from '@/components/PlanCard';
import { oneTimePlans, subscriptionPlans } from '@/lib/content';

export default function PricingPage() {
  return (
    <section className="page-shell">
      <span className="eyebrow">Pricing</span>
      <h1>Start with the toolkit, or run LeadSprint every month.</h1>
      <p className="lead">One-time products are best for owners who want templates and calculators. LeadSprint Live is best for teams that want company profile memory, customer records, industry-specific outputs, saved quote history, active follow-up sequences, monthly workflow updates, and performance tracking.</p>
      <div className="section-heading pricing-heading">
        <h2>Monthly plan</h2>
        <p>For businesses that manage new inquiries every week and need a repeatable lead-to-booked workflow.</p>
      </div>
      <div className="plans subscription-plans">{subscriptionPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>
      <div className="section-heading pricing-heading">
        <h2>One-time kits</h2>
        <p>For quick implementation, training, and offline use.</p>
      </div>
      <div className="plans">{oneTimePlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>
    </section>
  );
}
