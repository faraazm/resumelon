"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface JobDescriptionStepProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onGenerateInstantly: () => void;
  onAnalyzeFirst: () => void;
  isLoading: boolean;
}

export function JobDescriptionStep({
  jobDescription,
  onJobDescriptionChange,
  onGenerateInstantly,
  onAnalyzeFirst,
  isLoading,
}: JobDescriptionStepProps) {
  const hasText = jobDescription.trim().length > 0;

  return (
    <motion.div
      key="job-description"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl px-4 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Optimize for a new job
        </h1>
        <p className="mt-2 text-muted-foreground">
          Paste the job description and we&apos;ll tailor your resume to match
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8"
      >
        <Textarea
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          className="min-h-[220px] max-h-[400px] overflow-y-auto text-left resize-none"
          disabled={isLoading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="mt-6 flex flex-col sm:flex-row justify-center gap-3"
      >
        <Button
          onClick={onGenerateInstantly}
          disabled={!hasText || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Generate Instantly
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onAnalyzeFirst}
          disabled={!hasText || isLoading}
          className="gap-2"
        >
          <ChartBarIcon className="h-4 w-4" />
          Analyze First
        </Button>
      </motion.div>
    </motion.div>
  );
}
