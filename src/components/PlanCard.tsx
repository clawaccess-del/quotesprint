import Link from 'next/link';

type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className={`plan-card ${plan.featured ? 'featured' : ''}`}>
      {plan.featured ? <span className="pill">Best fit</span> : null}
      <h3>{plan.name}</h3>
      <p>{plan.blurb}</p>
      <div className="price"><span>{plan.price}</span> <small>{plan.cadence}</small></div>
      <ul>
        {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      <Link href={`/checkout?plan=${plan.id}`} className="button full">Buy {plan.name}</Link>
    </article>
  );
}
