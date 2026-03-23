"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { InlineCTA } from "./inline-cta";

interface PageHeroProps {
  badge?: string;
  heading: React.ReactNode;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export function PageHero({
  badge,
  heading,
  description,
  ctaLabel = "Generate My First Resume",
  ctaHref = "/sign-up",
  secondaryCtaLabel,
  secondaryCtaHref,
}: PageHeroProps) {
  return (
    <SectionWrapper background="default" padding="lg">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {badge && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {badge}
          </div>
        )}
        <h1 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
        <motion.p
          className="mt-6 text-lg text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InlineCTA signedOutLabel={ctaLabel} signedOutHref={ctaHref} />
          {secondaryCtaLabel && secondaryCtaHref && (
            <a
              href={secondaryCtaHref}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {secondaryCtaLabel}
            </a>
          )}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
