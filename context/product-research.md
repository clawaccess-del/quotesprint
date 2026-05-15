# QuoteSprint product research snapshot

## Selected product

QuoteSprint: a speed-to-lead quote and follow-up kit for home-service businesses.

## Why this product

- Digital products and micro-SaaS are attractive because they can be built once, sold repeatedly, and delivered instantly with high margins.
- The strongest digital offers solve a narrow, urgent, expensive problem rather than selling generic templates.
- Home-service leads decay quickly. Faster first response, clearer estimate framing, and confident follow-up directly affect booked work.
- This can be built without outside help because the first product is a browser-based workflow tool plus templates, not a call center, CRM, or AI receptionist infrastructure.

## MVP shipped

- Marketing homepage
- Product page
- Pricing page
- Resource/ecosystem page
- Stripe-ready checkout page and API route
- Working quote builder that generates:
  - working estimate
  - deposit amount
  - SMS follow-up
  - email follow-up
  - call script

## Stripe notes

Stripe Checkout is connected in Vercel production/preview/development using live Stripe products and one-time prices. Stored price IDs live in OpenClaw user secrets under projects.quotesprint.stripe.priceIds.
