"use client";

import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { scoreResume } from "@/lib/resume-scoring";
import { ScoreOverview } from "@/components/app/review/score-overview";
import { SectionCard } from "@/components/app/review/section-card";

interface ImproveTabProps {
  resumeData: any;
  resumeId: string;
  onNavigate: (section: string) => void;
}

export function ImproveTab({ resumeData, resumeId, onNavigate }: ImproveTabProps) {
  const score = useMemo(() => {
    return scoreResume({
      personalDetails: resumeData.personalDetails,
      contact: resumeData.contact,
      summary: resumeData.summary,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: resumeData.skills,
    });
  }, [resumeData]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 space-y-4">
          {/* Score Overview */}
          <ScoreOverview score={score} />

          {/* Section Cards */}
          <div className="space-y-3">
            {score.sections.map((section) => (
              <SectionCard key={section.key} section={section} resumeId={resumeId} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
