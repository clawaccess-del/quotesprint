# LeadSprint

LeadSprint is a self-serve digital product for home-service businesses: a fast quote, follow-up, and speed-to-lead kit that turns messy job details into a professional estimate, SMS follow-up, email follow-up, call script, and ROI note.

## Product thesis

Research points to a valuable, buildable niche: digital tools and templates have high margins, and home-service leads decay quickly when businesses respond slowly. LeadSprint packages a workflow utility that is specific enough to sell clearly and simple enough to ship without external dependencies.

## Stack

- Next.js App Router
- TypeScript
- Plain CSS, no design framework dependency
- Stripe-ready checkout route at `/api/checkout`

## Local setup

```bash
npm install
npm run dev
```

## Stripe setup later

Set these env vars in Vercel when ready:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_PRICE_ID_STARTER`
- `STRIPE_PRICE_ID_PRO`
- `STRIPE_PRICE_ID_AGENCY`

The current checkout page gracefully falls back to a Stripe setup note until keys are present.
