# CLAUDE.md - Project Reference Guide

## Project Overview

AI-powered resume and career document builder that helps job seekers create, tailor, and optimize resumes, cover letters, and related documents through a guided, visual editing experience.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** Convex
- **Auth:** Clerk
- **Payments:** Stripe
- **UI:** ShadCN + Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Heroicons

## Core Features

- Marketing landing page with social proof
- Authenticated user accounts (Clerk)
- Dashboard for managing resumes/letters
- Guided resume builder (sections: personal, contact, summary, employment, skills, education, custom)
- Drag-and-drop resume import with parsing
- AI-generated summaries and bullet rewrites
- Resume scoring and improvement suggestions
- Live preview with customizable templates, fonts, spacing, colors
- ATS-optimized layouts
- PDF/DOCX exports
- Versioning and duplication
- Job-specific tailoring flows
- Cover letter generator (pulls from resume + job description)
- Stripe subscription tiers (monthly $19.99, yearly $99.99)

## Design Principles

### UI/UX
- Always use ShadCN components
- Reference existing UI before creating new components
- Colors: neutral/light, minimal - check Tailwind/ShadCN config for variables
- Subtle colors only for warnings/success/danger states
- No gradients or excessive colors
- Simple, clean, minimal aesthetic

### Responsiveness & Accessibility
- 100% mobile responsive
- 100% accessible
- No layout shifts on state changes

### Loading States
- Avoid skeleton loaders/spinners for instant-loading content (prevents flicker)
- Only show loaders if request takes noticeably long

## Code Standards

### General
- Keep code DRY - never repeat yourself
- Check existing code before writing new code
- Make code reusable when possible
- Write clean, readable code

### Convex Best Practices
- Always `await` all promises
- Avoid `.filter()` on database queries - use `.withIndex()` or filter in code
- Only use `.collect()` with small result sets (< 1000 docs)
- Use argument validators for all public functions
- Implement access control on all public functions
- Use `internal.*` (not `api.*`) for scheduled functions and `ctx.run*` calls
- Use helper functions in `convex/model/` for shared logic
- Avoid sequential `ctx.runMutation`/`ctx.runQuery` in actions - batch them
- Always pass table name to `ctx.db.get()`, `ctx.db.patch()`, `ctx.db.delete()`
- Don't use `Date.now()` in queries (breaks caching)

### Next.js + Convex
- Wrap app with `<ConvexClientProvider>` in layout
- Use `useQuery()` hook for data fetching
- Client components need `"use client"` directive

## Project Structure

```
app/
  api/
    stripe/
      checkout/route.ts    # Create checkout sessions
      webhook/route.ts     # Handle Stripe webhooks
      portal/route.ts      # Billing portal sessions
      subscription/route.ts # Get subscription status
  layout.tsx               # Root layout with Clerk + Convex providers
  page.tsx                 # Landing page

convex/
  _generated/              # Auto-generated Convex files
  schema.ts                # Database schema
  *.ts                     # Convex functions (queries, mutations, actions)

lib/
  stripe.ts                # Stripe client and plan config

middleware.ts              # Clerk auth middleware
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY` - Monthly plan price ID
- `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY` - Yearly plan price ID

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stripe/checkout` | Create checkout session `{ interval: "monthly" \| "yearly" }` |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| POST | `/api/stripe/portal` | Create billing portal session |
| GET | `/api/stripe/subscription` | Get user's subscription status |

## Subscription Plans

| Plan | Price | Interval |
|------|-------|----------|
| Pro Monthly | $19.99 | month |
| Pro Yearly | $99.99 | year |
