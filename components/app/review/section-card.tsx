"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { PencilSquareIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { SectionScore } from "@/lib/resume-scoring";
import type { ResumeData } from "@/lib/templates/types";

// Type alias for experience entry
type ExperienceEntry = ResumeData["experience"][number];

// Union type for section data updates
type SectionUpdateData = string | string[] | ExperienceEntry[];

const statusConfig = {
  complete: {
    icon: CheckCircleIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    label: "Complete",
  },
  "needs-work": {
    icon: ExclamationTriangleIcon,
    color: "text-amber-500",
    bg: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700",
    label: "Needs Work",
  },
  missing: {
    icon: XCircleIcon,
    color: "text-red-500",
    bg: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700",
    label: "Missing",
  },
} as const;

const sectionToEditorKey: Record<string, string> = {
  personal: "personalDetails",
  contact: "contact",
  summary: "summary",
  experience: "experience",
  education: "education",
  skills: "skills",
};

export function SectionCard({
  section,
  resumeId,
  resumeData,
  onNavigate,
  onUpdateResume,
}: {
  section: SectionScore;
  resumeId: string;
  resumeData?: ResumeData;
  onNavigate?: (section: string) => void;
  onUpdateResume?: (section: string, data: SectionUpdateData) => void;
}) {
  const { user } = useUser();
  const generateImprovedContent = useAction(api.ai.generateImprovedContent);
  const [isFixing, setIsFixing] = useState(false);

  const config = statusConfig[section.status];
  const Icon = config.icon;
  const editorSection = sectionToEditorKey[section.key] || section.key;

  const canAutoFix =
    section.status !== "complete" &&
    !!onUpdateResume &&
    !!resumeData &&
    !!user?.id &&
    (section.key === "summary" || section.key === "experience" || section.key === "skills");

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(editorSection);
    }
  };

  const handleAutoFix = async () => {
    if (!user?.id || !resumeData || !onUpdateResume) return;
    setIsFixing(true);

    try {
      if (section.key === "summary") {
        const currentSummary = resumeData.summary || "";
        const prompt = !currentSummary.trim()
          ? `Generate a professional resume summary for a ${resumeData.personalDetails?.jobTitle || "professional"} with this background:\n${(resumeData.experience || []).map((e: ExperienceEntry) => `${e.title} at ${e.company}: ${e.bullets?.join("; ") || ""}`).join("\n")}`
          : currentSummary;

        const result = await generateImprovedContent({
          content: prompt,
          fieldType: "summary",
          tone: "professional",
        });
        onUpdateResume("summary", result.content);
      } else if (section.key === "experience") {
        const experience = [...(resumeData.experience || [])];
        // Collect ALL jobs that need any kind of fix
        const jobsToFix: { index: number; title: string; company: string; existingBullets: string; targetCount: number; action: string }[] = [];

        for (let i = 0; i < experience.length; i++) {
          const job = experience[i];
          const realBullets = (job.bullets || []).filter((b: string) => b.replace(/<[^>]*>/g, "").trim().length > 0);
          const bulletCount = realBullets.length;
          const existing = realBullets.map((b: string) => b.replace(/<[^>]*>/g, "").trim()).join("; ");

          if (bulletCount < 3) {
            jobsToFix.push({ index: i, title: job.title, company: job.company, existingBullets: existing, targetCount: 3, action: "generate" });
          } else if (bulletCount > 5) {
            jobsToFix.push({ index: i, title: job.title, company: job.company, existingBullets: existing, targetCount: 5, action: "trim" });
          } else {
            // Check for weak bullets (< 10 words)
            const weakCount = realBullets.filter((b: string) => b.replace(/<[^>]*>/g, "").trim().split(/\s+/).length < 10).length;
            if (weakCount > 0) {
              jobsToFix.push({ index: i, title: job.title, company: job.company, existingBullets: existing, targetCount: bulletCount, action: "improve" });
            }
          }
        }

        if (jobsToFix.length > 0) {
          const batchPrompt = jobsToFix
            .map((j, idx) => {
              if (j.action === "trim") return `JOB ${idx + 1}: ${j.title} at ${j.company}\nExisting: ${j.existingBullets}\nKeep only the ${j.targetCount} strongest bullets.`;
              if (j.action === "improve") return `JOB ${idx + 1}: ${j.title} at ${j.company}\nExisting: ${j.existingBullets}\nRewrite all ${j.targetCount} bullets to be more impactful with metrics and strong verbs.`;
              return `JOB ${idx + 1}: ${j.title} at ${j.company}\nExisting: ${j.existingBullets || "(none)"}\nGenerate ${j.targetCount} achievement-oriented bullets.`;
            })
            .join("\n\n");

          const result = await generateImprovedContent({
            content: batchPrompt,
            fieldType: "experience_bullets",
            tone: "custom",
            customPrompt: `For each JOB, return the requested bullet points. Format:\nJOB 1:\n<ul><li>bullet</li></ul>\nJOB 2:\n<ul><li>bullet</li></ul>\nUse strong action verbs and metrics. No explanations.`,
          });

          const jobSections = result.content.split(/JOB\s*\d+\s*:/i).filter((s: string) => s.trim());
          for (let j = 0; j < jobsToFix.length && j < jobSections.length; j++) {
            const bullets = (jobSections[j].match(/<li>(.*?)<\/li>/g) || [])
              .map((li: string) => li.replace(/<\/?li>/g, "").trim())
              .filter((b: string) => b.length > 0);
            if (bullets.length > 0) {
              experience[jobsToFix[j].index] = { ...experience[jobsToFix[j].index], bullets };
            }
          }
          onUpdateResume("experience", experience);
        }
      } else if (section.key === "skills") {
        const currentSkills = resumeData.skills || [];
        const jobTitle = resumeData.personalDetails?.jobTitle || "";
        const experienceContext = (resumeData.experience || [])
          .map((e: ExperienceEntry) => `${e.title} at ${e.company}`)
          .join(", ");

        if (currentSkills.length < 5) {
          // Too few — add more
          const result = await generateImprovedContent({
            content: `Current skills: ${currentSkills.join(", ")}\nJob title: ${jobTitle}\nExperience: ${experienceContext}\n\nSuggest ${10 - currentSkills.length} additional relevant skills.`,
            fieldType: "skills",
            tone: "custom",
            customPrompt: `Return ONLY a comma-separated list of skills. No HTML, no explanations.`,
          });
          const newSkills = result.content.replace(/<[^>]*>/g, "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0 && !currentSkills.includes(s));
          onUpdateResume("skills", [...currentSkills, ...newSkills.slice(0, 10 - currentSkills.length)]);
        } else if (currentSkills.length > 15) {
          // Too many — ask AI to pick the best 12
          const result = await generateImprovedContent({
            content: `All skills: ${currentSkills.join(", ")}\nJob title: ${jobTitle}\nExperience: ${experienceContext}\n\nPick the 12 most relevant and impactful skills for this profile.`,
            fieldType: "skills",
            tone: "custom",
            customPrompt: `Return ONLY a comma-separated list of the 12 best skills. No HTML, no explanations.`,
          });
          const trimmed = result.content.replace(/<[^>]*>/g, "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          if (trimmed.length > 0) {
            onUpdateResume("skills", trimmed.slice(0, 15));
          }
        }
      }
    } catch (error) {
      console.error("Auto-fix error:", error);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value={section.key} className="border-b-0">
          <AccordionTrigger className="!py-3 px-4 hover:no-underline">
              <div className="flex flex-1 items-center gap-3">
                <Icon className={`h-5 w-5 shrink-0 ${config.color}`} />
                <span className="font-medium text-sm">{section.name}</span>

                <div className="hidden sm:block h-1.5 w-20 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${config.bg} transition-all duration-500`}
                    style={{ width: `${section.score}%` }}
                  />
                </div>

                <span
                  className={`ml-auto mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClass}`}
                >
                  {config.label}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 !pb-3">
              {/* Field feedback */}
              <div className="space-y-2">
                {section.feedback.map((fb, i) => {
                  const fbConfig = statusConfig[fb.status];
                  const FbIcon = fbConfig.icon;
                  return (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <FbIcon className={`mt-0.5 h-4 w-4 shrink-0 ${fbConfig.color}`} />
                      <div>
                        <span className="font-medium">{fb.field}</span>
                        <span className="text-muted-foreground"> — {fb.message}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {section.suggestions.length > 0 && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Suggestions</p>
                  <ul className="space-y-1">
                    {section.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full shadow-none"
                  onClick={handleNavigate}
                >
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Edit {section.name}
                </Button>

                {canAutoFix && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-full shadow-none"
                    onClick={handleAutoFix}
                    disabled={isFixing}
                  >
                    {isFixing ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <SparklesIcon className="h-3.5 w-3.5" />
                    )}
                    {isFixing ? "Fixing..." : "AI Fix"}
                  </Button>
                )}
              </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
