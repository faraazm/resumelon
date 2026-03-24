"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { InlineCTA } from "./inline-cta";
import { BrandName } from "./logo";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: ArrowUpTrayIcon,
    text: "Upload your base resume once",
  },
  {
    icon: DocumentTextIcon,
    text: "Paste a job description",
  },
  {
    icon: SparklesIcon,
    text: "Get a tailored resume + cover letter in seconds",
  },
  {
    icon: RocketLaunchIcon,
    text: "Download and apply with confidence",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SolutionSection() {
  return (
    <SectionWrapper background="muted" id="solution" ariaLabelledBy="solution-heading">
      <SectionHeader
        id="solution-heading"
        heading={
          <>
            Meet <BrandName className="text-primary" />
          </>
        }
        description="resumeclone automates the tedious parts of tailoring resumes and cover letters. Paste a job description, and get a customized, ATS-optimized resume ready to send."
      />

      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
            variants={itemVariants}
          >
            <step.icon className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <p className="font-medium text-foreground">{step.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex justify-center">
        <InlineCTA signedOutLabel="Generate My First Resume" />
      </div>
    </SectionWrapper>
  );
}
