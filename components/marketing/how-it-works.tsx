"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { InlineCTA } from "./inline-cta";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    step: "1",
    icon: ArrowUpTrayIcon,
    title: "Upload Your Base Resume",
    description:
      "Upload your existing resume or fill in your details using our guided form. We'll organize everything into a clean, professional format.",
  },
  {
    step: "2",
    icon: DocumentTextIcon,
    title: "Paste a Job Description",
    description:
      "Paste the job listing you're applying for. resumelon analyzes it to identify key requirements and keywords.",
  },
  {
    step: "3",
    icon: SparklesIcon,
    title: "Generate Your Tailored Resume",
    description:
      "Our AI instantly creates an optimized resume and cover letter tailored to the role. Keywords, skills, and phrasing are customized automatically.",
  },
  {
    step: "4",
    icon: ArrowDownTrayIcon,
    title: "Download & Apply",
    description:
      "Export your ATS-optimized resume as PDF or DOCX. Apply with a tailored resume in minutes instead of hours.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function HowItWorks() {
  return (
    <SectionWrapper background="default" id="how-it-works" ariaLabelledBy="how-it-works-heading">
      <SectionHeader
        id="how-it-works-heading"
        heading="From Generic to Tailored—In Minutes"
        description="No complicated software. No design skills needed. Four simple steps to a smarter job search."
      />

      <motion.div
        className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {steps.map((item) => (
          <motion.div
            key={item.step}
            className="relative rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            variants={itemVariants}
          >
            <div className="mb-4 flex items-center gap-4">
              <item.icon className="h-7 w-7 text-primary" aria-hidden="true" />
              <span className="text-4xl font-bold text-muted-foreground/50">
                {item.step}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 flex justify-center">
        <InlineCTA signedOutLabel="Generate My First Resume" />
      </div>
    </SectionWrapper>
  );
}
