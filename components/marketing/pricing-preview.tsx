"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with your first resume",
    features: [
      { text: "1 resume", included: true },
      { text: "3 basic templates", included: true },
      { text: "PDF download", included: true },
      { text: "ATS-optimized format", included: true },
      { text: "AI content suggestions", included: false },
      { text: "Unlimited resumes", included: false },
      { text: "Cover letter generator", included: false },
    ],
    cta: "Start free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    yearlyPrice: "$99.99/year",
    description: "Everything you need to mass apply and land your dream job",
    features: [
      { text: "Unlimited resumes", included: true },
      { text: "All premium templates", included: true },
      { text: "PDF & DOCX downloads", included: true },
      { text: "ATS-optimized format", included: true },
      { text: "AI content suggestions", included: true },
      { text: "Cover letter generator", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Go Pro",
    href: "/pricing",
    highlighted: true,
  },
];

export function PricingPreview() {
  return (
    <SectionWrapper background="muted" id="pricing" ariaLabelledBy="pricing-heading">
      <SectionHeader
        id="pricing-heading"
        heading="Simple, Affordable Pricing"
        description="Pay less than the cost of one missed opportunity. Start free, upgrade when you're ready to scale."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border bg-card p-8 ${
              plan.highlighted
                ? "border-primary shadow-lg"
                : "border-border"
            }`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="ml-1 text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>
              {plan.yearlyPrice && (
                <p className="mt-1 text-sm text-muted-foreground">
                  or {plan.yearlyPrice} (save 58%)
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <ul className="mb-8 space-y-3" aria-label={`${plan.name} plan features`}>
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3">
                  {feature.included ? (
                    <CheckIcon className="h-5 w-5 shrink-0 text-green-500" aria-hidden="true" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                  )}
                  <span
                    className={
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground/60"
                    }
                  >
                    {feature.included ? "" : <span className="sr-only">Not included: </span>}
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="w-full"
              variant={plan.highlighted ? "default" : "outline"}
              size="lg"
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
