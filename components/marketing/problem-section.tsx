"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import {
  ClockIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
  PencilSquareIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

const painPoints = [
  {
    icon: ClockIcon,
    text: "You spend hours tweaking resumes for each job posting",
  },
  {
    icon: DocumentDuplicateIcon,
    text: "Copy-pasting bullet points over and over again",
  },
  {
    icon: XCircleIcon,
    text: "Still getting auto-rejected by ATS systems",
  },
  {
    icon: PencilSquareIcon,
    text: "Writing cover letters from scratch every single time",
  },
  {
    icon: FaceFrownIcon,
    text: "Applying to 50+ jobs feels completely impossible",
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
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function ProblemSection() {
  return (
    <SectionWrapper background="default" id="problem" ariaLabelledBy="problem-heading">
      <SectionHeader
        id="problem-heading"
        heading="Applying to Jobs Shouldn't Feel Like a Full-Time Job"
        description="If your job search feels like an endless grind of rewriting, reformatting, and getting ghosted—you're not alone. The traditional way of applying is broken."
      />

      <motion.div
        className="mt-12 mx-auto max-w-2xl space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {painPoints.map((point) => (
          <motion.div
            key={point.text}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            variants={itemVariants}
          >
            <point.icon className="h-6 w-6 shrink-0 text-red-500" aria-hidden="true" />
            <p className="text-foreground">{point.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-8 text-center text-muted-foreground max-w-xl mx-auto">
        The burnout is real. The frustration is real. And no matter how much effort you put in, you feel stuck. There has to be a better way.
      </p>
    </SectionWrapper>
  );
}
