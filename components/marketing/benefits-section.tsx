"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { BrandName } from "./logo";
import {
  RocketLaunchIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ClockIcon,
  DocumentTextIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

const benefits = [
  {
    icon: RocketLaunchIcon,
    title: "Apply at Scale",
    description:
      "Generate dozens or hundreds of tailored resumes in minutes—not hours. Mass apply to every relevant opening without sacrificing quality.",
  },
  {
    icon: ShieldCheckIcon,
    title: "ATS Optimization Built In",
    description:
      "Every resume is structured to pass Applicant Tracking Systems and rank higher. Stop getting filtered out before a human sees your application.",
  },
  {
    icon: CpuChipIcon,
    title: "Smart Customization",
    description:
      "Automatically adapts keywords, skills, and phrasing based on each job description. Every resume reads like it was written specifically for that role.",
  },
  {
    icon: ClockIcon,
    title: "Save 10+ Hours Per Week",
    description:
      "Stop rewriting resumes and cover letters manually. Reclaim your time and focus on preparing for interviews instead.",
  },
  {
    icon: DocumentTextIcon,
    title: "Cover Letters Included",
    description:
      "Generate personalized, compelling cover letters for every application. Each one is tailored to the job description and your experience.",
  },
  {
    icon: SwatchIcon,
    title: "Multiple Templates",
    description:
      "Choose from modern, professional, ATS-safe designs. Every template is tested to look great on screen and parse perfectly through automated systems.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function BenefitsSection() {
  return (
    <SectionWrapper background="default" id="benefits" ariaLabelledBy="benefits-heading">
      <SectionHeader
        id="benefits-heading"
        heading={
          <>
            Why <BrandName className="text-primary" /> Works
          </>
        }
        description="Built from the ground up to help you apply faster, smarter, and at scale. Every feature is designed to get you more interviews."
      />

      <motion.div
        className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        role="list"
      >
        {benefits.map((benefit) => (
          <motion.article
            key={benefit.title}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
            variants={itemVariants}
            role="listitem"
          >
            <benefit.icon className="mb-4 h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {benefit.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
