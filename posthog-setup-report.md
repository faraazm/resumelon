# PostHog Integration Report

## Summary

PostHog analytics was integrated into the resumelon Next.js 16.1.6 App Router project. The integration covers client-side initialization, user identification, 15 custom events across client and server code, and a PostHog dashboard with 4 business insights.

### Files Modified

| File | Change |
|------|--------|
| `next.config.ts` | Added PostHog reverse proxy rewrites (`/ingest` → `https://us.i.posthog.com`) and `skipTrailingSlashRedirect: true` |
| `instrumentation-client.ts` | Client-side PostHog init via Next.js 15.3+ instrumentation hook |
| `lib/posthog-server.ts` | Server-side PostHog singleton using `posthog-node` |
| `app/(dashboard)/layout.tsx` | User identification via Clerk on dashboard mount |
| `app/(dashboard)/resumes/new/page.tsx` | Resume creation, upload, and upgrade dialog events |
| `app/(dashboard)/resumes/new/generate/page.tsx` | AI generation start and resume created events |
| `app/(dashboard)/resumes/optimize/page.tsx` | Job match analysis, tailoring, and upgrade dialog events |
| `app/(dashboard)/cover-letters/new/page.tsx` | Cover letter creation and AI generation events |
| `app/(dashboard)/onboarding/page.tsx` | Onboarding completion event |
| `app/(dashboard)/settings/page.tsx` | Account deletion event + `posthog.reset()` |
| `app/api/stripe/checkout/route.ts` | Checkout initiated server-side event |
| `app/api/stripe/webhook/route.ts` | Subscription activated, canceled, and payment failed events |
| `app/api/pdf/route.ts` | PDF export server-side event |

### Client-Side Initialization

`instrumentation-client.ts` initializes PostHog using the Next.js 15.3+ instrumentation approach (no provider component):

```typescript
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: '2026-01-30',
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
```

### User Identification

Users are identified in `app/(dashboard)/layout.tsx` using their Clerk `userId` as the PostHog `distinctId`, with `email` and `name` as person properties. `posthog.reset()` is called on account deletion.

---

## Events

| Event | Description | File | Side |
|-------|-------------|------|------|
| `resume_created` | User creates a new resume (scratch, upload, AI-generated, or optimized) | `app/(dashboard)/resumes/new/page.tsx` | Client |
| `resume_uploaded` | User uploads an existing resume document for parsing | `app/(dashboard)/resumes/new/page.tsx` | Client |
| `resume_ai_generation_started` | User triggers AI resume generation from uploaded documents | `app/(dashboard)/resumes/new/generate/page.tsx` | Client |
| `resume_tailored` | User generates a tailored/optimized resume for a specific job description | `app/(dashboard)/resumes/optimize/page.tsx` | Client |
| `resume_job_match_analyzed` | User analyzes job match score before generating tailored resume | `app/(dashboard)/resumes/optimize/page.tsx` | Client |
| `cover_letter_created` | User creates a new cover letter (scratch or AI-generated) | `app/(dashboard)/cover-letters/new/page.tsx` | Client |
| `cover_letter_ai_generated` | User generates a cover letter with AI using resume and job description | `app/(dashboard)/cover-letters/new/page.tsx` | Client |
| `upgrade_dialog_shown` | Upgrade dialog is shown when user hits a usage limit | `app/(dashboard)/resumes/new/page.tsx` | Client |
| `onboarding_completed` | User completes the onboarding flow | `app/(dashboard)/onboarding/page.tsx` | Client |
| `account_deleted` | User deletes their account (churn event) | `app/(dashboard)/settings/page.tsx` | Client |
| `pdf_exported` | User exports a resume as PDF | `app/api/pdf/route.ts` | Server |
| `checkout_initiated` | User initiates a Stripe checkout session for a subscription | `app/api/stripe/checkout/route.ts` | Server |
| `subscription_activated` | User subscription becomes active after successful payment | `app/api/stripe/webhook/route.ts` | Server |
| `subscription_canceled` | User subscription is canceled | `app/api/stripe/webhook/route.ts` | Server |
| `payment_failed` | A subscription payment fails | `app/api/stripe/webhook/route.ts` | Server |

---

## Dashboard & Insights

**Dashboard:** [Analytics basics](https://us.posthog.com/project/355272/dashboard/1394427)

| Insight | Description | URL |
|---------|-------------|-----|
| Signup to subscription conversion funnel | 4-step funnel: onboarding_completed → resume_created → checkout_initiated → subscription_activated | [Link](https://us.posthog.com/project/355272/insights/BJAtzGAm) |
| Upgrade dialog to checkout conversion | Daily trends: upgrade_dialog_shown, checkout_initiated, subscription_activated | [Link](https://us.posthog.com/project/355272/insights/BhOpyRml) |
| Churn signals | Weekly trends: account_deleted, subscription_canceled, payment_failed | [Link](https://us.posthog.com/project/355272/insights/Xr8HC1oa) |
| Document creation activity | Daily trends: resume_created, cover_letter_created, pdf_exported | [Link](https://us.posthog.com/project/355272/insights/aoC6Xg4B) |
