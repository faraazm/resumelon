"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface AnalysisData {
  jobTitle: string;
  companyName: string;
  matchScore: number;
  missingSkills: string[];
  presentSkills: string[];
  suggestedSummary: string;
  suggestedBullets: Array<{
    experienceId: string;
    originalBullet: string;
    improvedBullet: string;
  }>;
}

interface AnalysisViewProps {
  analysis: AnalysisData;
  onGenerate: (selectedSkills: string[]) => void;
  onGenerateAll: () => void;
  isLoading: boolean;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number) {
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-red-500";
}

export function AnalysisView({
  analysis,
  onGenerate,
  onGenerateAll,
  isLoading,
}: AnalysisViewProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    analysis.missingSkills
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (analysis.matchScore / 100) * circumference;

  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-center"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Job Match Analysis
        </h1>
        <p className="mt-1 text-muted-foreground">
          {analysis.jobTitle}
          {analysis.companyName && ` at ${analysis.companyName}`}
        </p>
      </motion.div>

      {/* Match Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mt-6 flex justify-center"
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={getScoreBg(analysis.matchScore)}
            />
          </svg>
          <span className={`text-2xl font-bold ${getScoreColor(analysis.matchScore)}`}>
            {analysis.matchScore}%
          </span>
        </div>
      </motion.div>

      {/* Skills */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Present Skills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-2">
                Matching Skills ({analysis.presentSkills.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.presentSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 text-xs"
                  >
                    <CheckIcon className="mr-1 h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
                {analysis.presentSkills.length === 0 && (
                  <p className="text-xs text-muted-foreground">None found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Missing Skills (selectable) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-2">
                Missing Skills ({analysis.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={`text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "opacity-60"
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {isSelected ? (
                        <CheckIcon className="mr-1 h-3 w-3" />
                      ) : (
                        <XMarkIcon className="mr-1 h-3 w-3" />
                      )}
                      {skill}
                    </Badge>
                  );
                })}
                {analysis.missingSkills.length === 0 && (
                  <p className="text-xs text-muted-foreground">None missing</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Suggested Summary Preview */}
      {analysis.suggestedSummary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-4"
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-2">
                Suggested Summary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.suggestedSummary}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="mt-6 flex flex-col sm:flex-row justify-center gap-3"
      >
        <Button
          onClick={() => onGenerate(selectedSkills)}
          disabled={isLoading}
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
              Generate with Selected Changes
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onGenerateAll}
          disabled={isLoading}
        >
          Generate All
        </Button>
      </motion.div>
    </motion.div>
  );
}
