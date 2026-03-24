"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Feature {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  cta?: {
    label: string;
    href: string;
  };
}

const featureData: Feature[] = [
  {
    title: "Bulk Resume Generation",
    description:
      "Generate dozens or hundreds of tailored resumes from a single base resume. Each one is customized with the right keywords, skills, and phrasing for the specific job description.",
    features: [
      "AI-powered keyword matching for every job listing",
      "Automatic skill and experience rephrasing",
      "Batch processing for multiple job descriptions",
      "Each resume reads like it was hand-crafted",
    ],
    image: "/images/feature-images/dashboard-resumes.png",
    imageAlt: "Dashboard showing multiple tailored resumes",
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
      "Ready to send in seconds, not hours",
    ],
    image: "/images/feature-images/cover-letter-editor.png",
    imageAlt: "AI-powered cover letter editor interface",
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
    image: "/images/feature-images/design-tab-templates.png",
    imageAlt: "Template selection panel with ATS-optimized designs",
    cta: {
      label: "Browse templates",
      href: "/sign-up",
    },
  },
];

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
      transition: {
        staggerChildren: 0.1,
      },
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
        className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white border border-border md:flex-row md:rounded-3xl ${
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
                  <CheckIcon className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
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
        <div className="relative flex items-center justify-center bg-muted/20 p-6 md:w-1/2 md:p-8 min-h-[300px]">
          <div className="relative w-full h-full min-h-[280px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={feature.image}
              alt={feature.imageAlt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function FeatureSections() {
  return (
    <section id="features" className="bg-background py-8" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="features-heading"
            className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl"
          >
            Everything You Need to Land Interviews
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From bulk resume generation to AI cover letters—every feature is built to help you apply faster and get more callbacks.
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
