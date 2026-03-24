"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import {
  DocumentDuplicateIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  FannedDocuments,
  StackedDocuments,
  TemplateGrid,
} from "./template-visuals";

// ── Feature Data ──────────────────────────────────────────────────────────────

interface Feature {
  title: string;
  description: string;
  features: string[];
  visual: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
}

const featureData: Feature[] = [
  {
    title: "Tailored Resume Generation",
    description:
      "Paste a job description and get a resume customized with the right keywords, skills, and phrasing for that specific role. Every resume is built from your base resume and optimized for the job.",
    features: [
      "AI-powered keyword matching for the job listing",
      "Automatic skill and experience rephrasing",
      "Tailored to each job description you provide",
      "Every resume reads like it was hand-crafted",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50"
        cards={[
          { templateId: "bold-modern", rotate: -8, x: -45, y: 15, delay: 0.1 },
          { templateId: "timeline-blue", rotate: 0, x: 0, y: 0, delay: 0.24 },
          { templateId: "creative-bold", rotate: 7, x: 40, y: -12, delay: 0.38 },
        ]}
        badges={[
          {
            icon: DocumentDuplicateIcon,
            label: "Resume Tailored",
            position: "top-right",
            delay: 0.7,
          },
          {
            icon: ClipboardDocumentCheckIcon,
            label: "Keyword Matched",
            position: "bottom-left",
            delay: 0.8,
            variant: "success",
          },
        ]}
      />
    ),
    cta: {
      label: "Start generating",
      href: "/sign-up",
    },
  },
  {
    title: "AI-Powered Cover Letters",
    description:
      "Stop writing cover letters from scratch. resumeclone generates personalized, compelling cover letters that complement your tailored resume for each application.",
    features: [
      "Pulls key details from your resume automatically",
      "Matches tone and language to the job description",
      "Highlights your most relevant experience",
      "Ready to send in minutes, not hours",
    ],
    visual: (
      <StackedDocuments
        type="cover-letter"
        gradient="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50"
        sparkleColor="text-teal-500"
        cards={[
          { templateId: "ats-classic", rotate: 5, x: 30, y: 10, delay: 0.1 },
          { templateId: "elegant-serif", rotate: -3, x: -10, y: -5, delay: 0.28 },
        ]}
        badges={[
          {
            icon: SparklesIcon,
            label: "AI Writing",
            position: "top-left",
            delay: 0.6,
          },
          {
            icon: DocumentTextIcon,
            label: "Ready in 30s",
            position: "bottom-right",
            delay: 0.8,
          },
        ]}
      />
    ),
    cta: {
      label: "Try cover letters",
      href: "/sign-up",
    },
  },
  {
    title: "ATS-Safe Templates & Export",
    description:
      "Every template is designed to look professional and parse perfectly through Applicant Tracking Systems. Export as PDF or DOCX with one click—no watermarks, no limitations.",
    features: [
      "Tested with major ATS platforms",
      "Clean, parseable formatting every time",
      "High-quality PDF and DOCX export",
      "Version management for all your resumes",
    ],
    visual: (
      <TemplateGrid
        type="resume"
        gradient="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
        templates={[
          { id: "ats-classic", rotate: -3, x: -6, y: 5, delay: 0.1 },
          { id: "bold-modern", rotate: 2, x: 5, y: -3, delay: 0.2 },
          { id: "executive-navy", rotate: -2, x: -4, y: 3, delay: 0.3 },
          { id: "creative-bold", rotate: 3, x: 6, y: -5, delay: 0.4 },
        ]}
        badges={[
          {
            icon: ShieldCheckIcon,
            label: "ATS Score: 98%",
            position: "top-left",
            delay: 0.6,
            variant: "success",
          },
          {
            icon: ArrowDownTrayIcon,
            label: "PDF Export",
            position: "bottom-right",
            delay: 0.7,
            variant: "accent",
          },
        ]}
      />
    ),
    cta: {
      label: "Browse templates",
      href: "/sign-up",
    },
  },
];

// ── Feature Section Layout ────────────────────────────────────────────────────

function FeatureSection({
  feature,
  reversed,
}: {
  feature: Feature;
  reversed: boolean;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className={`flex w-full flex-col rounded-2xl bg-white border border-border md:flex-row md:rounded-3xl overflow-hidden ${
          reversed ? "md:flex-row-reverse" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Content Side */}
        <motion.div
          className="flex flex-col justify-center gap-y-6 p-8 md:w-1/2 md:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col gap-y-6">
            <motion.h3
              className="text-2xl font-semibold tracking-tight leading-normal md:text-3xl"
              variants={itemVariants}
            >
              {feature.title}
            </motion.h3>
            <motion.p
              className="text-base leading-relaxed text-muted-foreground"
              variants={itemVariants}
            >
              {feature.description}
            </motion.p>

            <motion.ul
              className="flex flex-col gap-y-2"
              variants={containerVariants}
            >
              {feature.features.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex flex-row items-center gap-x-2"
                  variants={itemVariants}
                >
                  <CheckIcon
                    className="h-5 w-5 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed">{item}</p>
                </motion.li>
              ))}
            </motion.ul>

            {feature.cta && (
              <motion.div variants={itemVariants}>
                <Button asChild variant="outline" className="gap-1">
                  <Link href={feature.cta.href}>
                    {feature.cta.label}
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Visual Side */}
        <div className="relative flex items-center justify-center md:w-1/2 min-h-[400px] sm:min-h-[460px] overflow-hidden rounded-b-2xl md:rounded-b-none md:rounded-r-3xl">
          {feature.visual}
        </div>
      </motion.div>
    </div>
  );
}

export function FeatureSections() {
  return (
    <section
      id="features"
      className="bg-background py-8"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="features-heading"
            className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl"
          >
            Everything You Need to Land Interviews
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From tailored resume generation to AI cover letters—every feature is
            built to help you apply faster and get more callbacks.
          </p>
        </div>
      </div>
      {featureData.map((feature, index) => (
        <FeatureSection
          key={index}
          feature={feature}
          reversed={index % 2 === 1}
        />
      ))}
    </section>
  );
}
