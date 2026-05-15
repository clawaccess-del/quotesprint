# QuoteSprint product context

## Product

QuoteSprint is a speed-to-lead quote, follow-up, and tracking system for home-service businesses.

## Positioning

QuoteSprint helps contractors and local-service teams respond quickly, present clear estimates, ask for deposits with confidence, and keep open quotes from going cold.

## Current offer ladder

- Starter Kit, $29 one-time
- Pro Kit, $79 one-time
- Agency License, $199 one-time
- QuoteSprint Live, $29/month
- QuoteSprint Live + AI, $49/month with 100 monthly AI credits

## QuoteSprint Live value

QuoteSprint Live adds recurring value through saved quote history, follow-up sequence generation, monthly industry script drops, objection-handling updates, and simple win-rate/pipeline tracking. QuoteSprint Live + AI adds a capped AI layer for brand-voice rewrites, custom objection handling, fuller emails, and expanded follow-up sequences. The non-AI system remains the core product and fallback.

## Current implementation

- Marketing homepage
- Product page
- Pricing page
- Resource page
- Secure checkout page
- Working quote builder with estimate, deposit, SMS, email, call script, advanced copy direction, follow-up sequence, saved quote history, and local win-rate tracking
- Live Stripe Checkout for one-time purchases, monthly subscription, and monthly AI subscription
- Paid access gate after Stripe verification
- Optional AI endpoint with plan gate and 100-credit monthly cap. Requires `OPENAI_API_KEY` in Vercel before AI generation is active.
