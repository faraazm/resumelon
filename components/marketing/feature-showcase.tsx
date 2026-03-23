"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ImagePlaceholder } from "./image-placeholder";

interface FeatureShowcaseItem {
  title: string;
  description: string;
  bullets: string[];
  imagePlaceholder: string;
}

interface FeatureShowcaseProps {
  features: FeatureShowcaseItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeatureShowcase({ features }: FeatureShowcaseProps) {
  return (
    <div className="space-y-8">
      {features.map((feature, index) => {
        const reversed = index % 2 === 1;
        return (
          <motion.div
            key={index}
            className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white border border-border md:flex-row md:rounded-3xl ${
              reversed ? "md:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col justify-center gap-y-5 p-8 md:w-1/2 md:p-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
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
              <motion.ul className="flex flex-col gap-y-2" variants={containerVariants}>
                {feature.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    className="flex flex-row items-center gap-x-2"
                    variants={itemVariants}
                  >
                    <CheckIcon className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                    <p className="leading-relaxed">{bullet}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <div className="relative flex flex-col justify-center bg-muted/20 p-8 md:w-1/2 md:p-12 min-h-[300px]">
              <ImagePlaceholder
                label={feature.imagePlaceholder}
                aspectRatio="auto"
                className="h-full min-h-[250px]"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
