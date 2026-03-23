"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentLoadingProps {
  message?: string;
}

const loadingSteps = [
  "Extracting text from document",
  "Analyzing resume structure",
  "Identifying contact information",
  "Parsing work experience",
  "Extracting education details",
  "Categorizing skills",
  "Formatting for ATS compatibility",
];

export function DocumentLoading({ message = "AI is analyzing your resume..." }: DocumentLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          setCompletedSteps((completed) => [...completed, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 px-4">
        {/* Spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-border"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <Image
            src="/images/resumeclone-logo.png"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
          />
        </div>

        {/* Main message */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This usually takes a few seconds
          </p>
        </div>

        {/* Progress steps */}
        <div className="w-full max-w-sm space-y-1.5">
          {loadingSteps.map((label, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.includes(index);
            const isPending = index > currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : isCompleted
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {/* Status dot / check */}
                <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                      >
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="active"
                        className="h-2 w-2 rounded-full bg-foreground"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-border" />
                    )}
                  </AnimatePresence>
                </div>

                <span>{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
