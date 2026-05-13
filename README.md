# EV Loader Arcade

Cybersecurity training games behind a Stripe paywall.
Stack: Next.js 15 (App Router) + Supabase (auth + DB) + Stripe (subscriptions) + Tailwind. Hosted on Vercel.

## Routes

- `/` landing + pricing + FAQ
- `/login`, `/signup` auth
- `/account` profile + subscription management (Stripe Customer Portal)
- `/gallery` protected game grid
- `/play/[slug]` protected game runtime (currently `vulnhunt`)
- `/api/stripe/checkout` create Checkout Session
- `/api/stripe/portal` open Customer Portal
- `/api/stripe/webhook` Stripe events -> Supabase

Auth + active subscription enforced in `src/middleware.ts`.

## Setup

```
npm install
cp .env.example .env.local
# fill in Supabase + Stripe values
npm run dev
```

### Supabase

1. Create project at supabase.com
2. Paste `supabase/schema.sql` into SQL editor and run
3. Auth -> Providers -> enable Email
4. Copy URL + anon key + service role key into `.env.local`

### Stripe

1. Create three Products with monthly Prices (Starter / Pro / Team) and copy each price ID into the matching `STRIPE_PRICE_*` env var
2. `stripe listen --forward-to localhost:3000/api/stripe/webhook` for local testing; copy signing secret into `STRIPE_WEBHOOK_SECRET`
3. In production, add the same webhook endpoint via Stripe Dashboard

### Vercel

Push to GitHub, import in Vercel, add all env vars from `.env.example`. Set `NEXT_PUBLIC_APP_URL` to the deployed URL.

## Adding a new game

1. Append a tile to `src/lib/games.ts` (`status: "live"` once playable)
2. Add a runtime renderer in `src/app/(app)/play/[slug]/page.tsx`
3. The middleware already gates `/play/*` behind auth + subscription
