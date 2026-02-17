"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentLoadingProps {
  message?: string;
}

const loadingSteps = [
  { label: "Extracting text from document", icon: "📄" },
  { label: "Analyzing resume structure", icon: "🔍" },
  { label: "Identifying contact information", icon: "📧" },
  { label: "Parsing work experience", icon: "💼" },
  { label: "Extracting education details", icon: "🎓" },
  { label: "Categorizing skills", icon: "⚡" },
  { label: "Formatting for ATS compatibility", icon: "✨" },
];

export function DocumentLoading({ message = "AI is analyzing your resume..." }: DocumentLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Progress through steps
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
        {/* AI Brain Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            style={{ width: 120, height: 120, margin: -10 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner pulsing circle */}
          <motion.div
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 0 20px rgba(59, 130, 246, 0.1)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🤖
            </motion.span>
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * 2 * Math.PI) / 3) * 60, 0],
                y: [0, Math.sin((i * 2 * Math.PI) / 3) * 60, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Using AI to accurately extract your information
          </p>
        </motion.div>

        {/* Progress steps */}
        <div className="w-full max-w-sm space-y-2">
          {loadingSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.includes(index);
            const isPending = index > currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isPending ? 0.4 : 1,
                  x: 0
                }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors ${
                  isActive
                    ? "bg-primary/10 border border-primary/20"
                    : isCompleted
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-muted/30"
                }`}
              >
                {/* Icon */}
                <span className="text-base">{step.icon}</span>

                {/* Label */}
                <span className={`flex-1 text-sm ${
                  isActive
                    ? "text-primary font-medium"
                    : isCompleted
                    ? "text-emerald-700"
                    : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>

                {/* Status indicator */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="flex gap-0.5"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
                    >
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground text-center max-w-xs"
        >
          Tip: AI parsing ensures your information is accurately placed in the right sections for ATS compatibility
        </motion.p>
      </div>
    </div>
  );
}
