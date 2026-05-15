'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { plans } from '@/lib/content';

function CheckoutInner() {
  const params = useSearchParams();
  const selected = params.get('plan') || 'pro';
  const plan = plans.find((item) => item.id === selected) || plans[1];

  async function startCheckout() {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan.id }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
    else alert(data.message || 'Checkout is temporarily unavailable. Please try again in a few minutes.');
  }

  return (
    <section className="page-shell checkout-shell">
      <span className="eyebrow">Checkout</span>
      <h1>{plan.name}</h1>
      <p className="lead">{plan.blurb}</p>
      <div className="checkout-card">
        <div className="price"><span>{plan.price}</span> <small>{plan.cadence}</small></div>
        <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <button className="button full" onClick={startCheckout}>Continue to secure checkout</button>
        <p className="fine-print">Secure payment is handled by Stripe. You can review the order before completing checkout.</p>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<section className="page-shell"><p>Loading checkout…</p></section>}><CheckoutInner /></Suspense>;
}
