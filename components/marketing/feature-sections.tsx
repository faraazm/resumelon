"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Feature {
  title: string;
  description: string;
  features: string[];
  cta?: {
    label: string;
    href: string;
  };
}

const featureData: Feature[] = [
  {
    title: "AI-Powered Resume Building",
    description:
      "Let our intelligent assistant help you craft compelling bullet points and optimize your resume for any job description.",
    features: [
      "Smart content suggestions based on your role",
      "Automatic keyword optimization for ATS",
      "Real-time writing improvements",
      "Job description analysis and tailoring",
    ],
    cta: {
      label: "Learn More",
      href: "/sign-up",
    },
  },
  {
    title: "ATS-Optimized Templates",
    description:
      "Every template is designed to pass Applicant Tracking Systems while still looking professional and modern.",
    features: [
      "Tested with major ATS platforms",
      "Clean, parseable formatting",
      "Professional typography",
      "Customizable sections and layouts",
    ],
    cta: {
      label: "Learn More",
      href: "/sign-up",
    },
  },
  {
    title: "One-Click Export",
    description:
      "Download your polished resume instantly. No watermarks, no limitations. Your resume, ready when you are.",
    features: [
      "High-quality PDF export",
      "Perfect formatting every time",
      "Unlimited downloads",
      "Print-ready resolution",
    ],
    cta: {
      label: "Learn More",
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
        <div className="relative flex flex-col justify-center bg-gray-100 p-8 md:w-1/2 md:p-12 min-h-[300px]">
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground text-sm">
              Feature preview
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function FeatureSections() {
  return (
    <section id="features" className="bg-muted/30 py-8" aria-labelledby="features-heading">
      <h2 id="features-heading" className="sr-only">
        Key Features
      </h2>
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
