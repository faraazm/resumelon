"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckIcon,
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

  const selectAll = () => setSelectedSkills([...analysis.missingSkills]);
  const deselectAll = () => setSelectedSkills([]);
  const allSelected = selectedSkills.length === analysis.missingSkills.length;

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
        <p className="mt-1 text-sm text-muted-foreground truncate">
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
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* Present Skills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="!py-0">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Matching Skills ({analysis.presentSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.presentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 break-words max-w-full"
                  >
                    <CheckIcon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{skill}</span>
                  </span>
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
          <Card className="!py-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">
                  Missing Skills ({analysis.missingSkills.length})
                </h3>
                {analysis.missingSkills.length > 0 && (
                  <button
                    type="button"
                    onClick={allSelected ? deselectAll : selectAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {allSelected ? "Deselect all" : "Select all"}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mb-2.5">
                Tap to select skills to add to your resume
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all max-w-full cursor-pointer ring-1 ring-inset ${
                        isSelected
                          ? "bg-foreground/5 text-foreground ring-foreground/20"
                          : "bg-muted/50 text-muted-foreground ring-border hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                          isSelected
                            ? "border-foreground bg-foreground text-white"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <CheckIcon className="h-2.5 w-2.5" />}
                      </span>
                      <span className="truncate">{skill}</span>
                    </button>
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
          <Card className="!py-0">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-2">
                Suggested Summary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
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
        className="mt-6 flex flex-col-reverse sm:flex-row justify-center gap-3"
      >
        <Button
          variant="outline"
          onClick={onGenerateAll}
          disabled={isLoading}
        >
          <SparklesIcon className="h-4 w-4 mr-2" />
          Add All Missing Skills to Resume
        </Button>
        <Button
          onClick={() => onGenerate(selectedSkills)}
          disabled={isLoading || selectedSkills.length === 0}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating Tailored Resume...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Add {selectedSkills.length} Selected Skill{selectedSkills.length !== 1 ? "s" : ""} to Resume
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
