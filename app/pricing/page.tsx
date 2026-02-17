"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Navbar, Footer } from "@/components/marketing";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with your first resume",
    features: [
      "1 resume",
      "3 basic templates",
      "PDF download",
      "ATS-optimized format",
      "Basic formatting options",
    ],
    cta: "Get Started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro Monthly",
    price: "$19.99",
    period: "/month",
    description: "Full access to all features with monthly flexibility",
    features: [
      "Unlimited resumes",
      "All premium templates",
      "PDF & DOCX downloads",
      "AI content suggestions",
      "Cover letter generator",
      "Priority support",
    ],
    cta: "Start Pro Monthly",
    href: "/sign-up?plan=monthly",
    highlighted: false,
  },
  {
    name: "Pro Yearly",
    price: "$99.99",
    period: "/year",
    description: "Best value — save 58% compared to monthly",
    features: [
      "Everything in Pro Monthly",
      "Save 58% vs monthly",
      "Locked-in pricing",
      "Early access to new features",
    ],
    cta: "Start Pro Yearly",
    href: "/sign-up?plan=yearly",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navbar />
      </motion.div>
      <main className="flex-1">
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that's right for you. Start free and upgrade
                anytime.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className={`relative rounded-2xl border bg-card p-8 ${
                    plan.highlighted
                      ? "border-primary shadow-lg"
                      : "border-border"
                  }`}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Best Value
                    </Badge>
                  )}

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      {plan.name}
                    </h2>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-5xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 shrink-0 text-green-500" />
                        <span className="text-foreground">{feature}</span>
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
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mx-auto mt-16 max-w-2xl"
            >
              <h3 className="text-center text-lg font-semibold text-foreground">
                Frequently asked questions
              </h3>
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="font-medium text-foreground">
                    Can I cancel anytime?
                  </dt>
                  <dd className="mt-2 text-muted-foreground">
                    Yes, you can cancel your subscription at any time. You'll
                    continue to have access until the end of your billing
                    period.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">
                    What payment methods do you accept?
                  </dt>
                  <dd className="mt-2 text-muted-foreground">
                    We accept all major credit cards (Visa, MasterCard, American
                    Express) through our secure payment processor, Stripe.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">
                    Is there a refund policy?
                  </dt>
                  <dd className="mt-2 text-muted-foreground">
                    We offer a 14-day money-back guarantee. If you're not
                    satisfied with Pro, contact us within 14 days for a full
                    refund.
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
