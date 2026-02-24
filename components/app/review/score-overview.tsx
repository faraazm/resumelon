"use client";

import type { ResumeScore } from "@/lib/resume-scoring";

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: "stroke-emerald-500", text: "text-emerald-600" };
  if (score >= 60) return { stroke: "stroke-amber-500", text: "text-amber-600" };
  return { stroke: "stroke-red-500", text: "text-red-600" };
}

export function ScoreOverview({ score }: { score: ResumeScore }) {
  const { stroke, text } = getScoreColor(score.overall);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Score ring */}
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/40"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${stroke} transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${text}`}>{score.overall}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {score.sectionsComplete} of {score.totalSections} sections complete
      </p>
    </div>
  );
}
