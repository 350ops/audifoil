# maldivian.tours

A curated marketplace connecting Hulhumalé Phase 2 boat owners (mostly fishing boats that dock back in the early hours and sit idle through the day) with travellers, expats and airline crew looking for half-day or full-day experiences — snorkeling, sandbank visits, dolphin watching, fishing, sunset cruises.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, Edge Functions)
- **Payments**: [Stripe](https://stripe.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
