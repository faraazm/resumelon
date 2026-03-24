"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const useCases = [
  {
    icon: AcademicCapIcon,
    title: "Students & New Grads",
    description:
      "Applying to internships and entry-level roles? Generate a tailored resume for each application without spending hours rewriting every time.",
  },
  {
    icon: ArrowPathIcon,
    title: "Career Switchers",
    description:
      "Transitioning to a new industry? resumeclone helps you reframe your existing experience to match new job requirements and highlight transferable skills.",
  },
  {
    icon: BriefcaseIcon,
    title: "Experienced Professionals",
    description:
      "Targeting senior roles? Create an ATS-optimized, keyword-matched resume for each position without sacrificing the quality your experience deserves.",
  },
  {
    icon: UserGroupIcon,
    title: "Active Job Seekers",
    description:
      "In a competitive market, every application counts. resumeclone helps you apply with tailored resumes that actually get past the filters.",
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

export function UseCases() {
  return (
    <SectionWrapper background="muted" id="use-cases" ariaLabelledBy="use-cases-heading">
      <SectionHeader
        id="use-cases-heading"
        heading="Built for Every Type of Job Seeker"
        description="Whether you're just starting out or making a career move, resumeclone adapts to your needs."
      />

      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        role="list"
      >
        {useCases.map((useCase) => (
          <motion.article
            key={useCase.title}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
            variants={itemVariants}
            role="listitem"
          >
            <useCase.icon className="mb-4 h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {useCase.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {useCase.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
