"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { BrandName } from "./logo";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ComparisonItem {
  text: string;
}

interface ComparisonColumnProps {
  title: string;
  items: ComparisonItem[];
  variant: "negative" | "positive";
}

const withoutItems: ComparisonItem[] = [
  { text: "2–3 hours per application" },
  { text: "Generic, one-size-fits-all resumes" },
  { text: "Low response rates" },
  { text: "Constant burnout and frustration" },
  { text: "No cover letters (or bad ones)" },
];

const withItems: ComparisonItem[] = [
  { text: "Minutes per tailored application" },
  { text: "Tailored resumes for every job" },
  { text: "Higher interview rates" },
  { text: "Efficient, stress-free job search" },
  { text: "Personalized cover letters included" },
];

function ComparisonColumn({ title, items, variant }: ComparisonColumnProps) {
  const isPositive = variant === "positive";

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 ${
        isPositive
          ? "border-primary bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-6 ${
          isPositive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.text} className="flex items-start gap-3">
            {isPositive ? (
              <CheckIcon className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            ) : (
              <XMarkIcon className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            )}
            <span className="text-foreground">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonSection() {
  return (
    <SectionWrapper background="muted" id="comparison" ariaLabelledBy="comparison-heading">
      <SectionHeader
        id="comparison-heading"
        heading={
          <>
            Without <BrandName className="text-primary" /> vs With{" "}
            <BrandName className="text-primary" />
          </>
        }
        description="See the difference a smarter job search makes."
      />

      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <ComparisonColumn
          title="Without resumeclone"
          items={withoutItems}
          variant="negative"
        />
        <ComparisonColumn
          title="With resumeclone"
          items={withItems}
          variant="positive"
        />
      </motion.div>
    </SectionWrapper>
  );
}
