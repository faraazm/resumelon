"use client";

import { useEffect, useRef, useState, useMemo, memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import {
  TemplateRenderer,
  getTemplate,
  ResumeData,
  TemplateConfig,
  getTemplateDefaultHeadingFont,
  getTemplateDefaultBodyFont,
} from "@/lib/templates";
import { generateResumePDF } from "@/lib/pdf-generator";

interface ResumeCardData {
  _id: Id<"resumes">;
  title: string;
  updatedAt: number;
  template: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    photo?: string;
  };
  contact?: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary?: string;
  experience?: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education?: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills?: string[];
  style?: {
    font: string;
    headingFont?: string;
    bodyFont?: string;
    spacing: string;
    accentColor: string;
    backgroundColor?: string;
    showPhoto?: boolean;
    showDividers?: boolean;
  };
  sectionOrder?: string[];
}

import { formatRelativeDate } from "./format-date";

function buildAdjustedTemplate(
  resume: ResumeCardData,
  baseTemplate: TemplateConfig
): { adjustedTemplate: TemplateConfig; headingFontId: string; bodyFontId: string } {
  const style = resume.style;
  const templateId = resume.template || "professional";
  const headingFontId = style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId = style?.bodyFont || getTemplateDefaultBodyFont(templateId);

  const showPhoto = style?.showPhoto !== undefined
    ? style.showPhoto
    : baseTemplate.layout.showPhoto;

  const showDividers = style?.showDividers !== undefined
    ? style.showDividers
    : baseTemplate.layout.sectionDivider !== "none";

  const sectionDivider = showDividers
    ? (baseTemplate.layout.sectionDivider === "none" ? "line" : baseTemplate.layout.sectionDivider)
    : "none";

  const accentColor = style?.accentColor || baseTemplate.colors.accent;

  const validSections = ["summary", "experience", "education", "skills"];
  const sectionOrder = resume.sectionOrder
    ? resume.sectionOrder.filter((s) => validSections.includes(s)) as ("summary" | "experience" | "education" | "skills")[]
    : baseTemplate.sections.order;

  const adjustedTemplate: TemplateConfig = {
    ...baseTemplate,
    spacing: {
      ...baseTemplate.spacing,
      sectionGap:
        style?.spacing === "compact"
          ? "mb-2"
          : style?.spacing === "spacious"
            ? "mb-4"
            : "mb-3",
      itemGap:
        style?.spacing === "compact"
          ? "mt-1"
          : style?.spacing === "spacious"
            ? "mt-2.5"
            : "mt-2",
      pagePadding:
        style?.spacing === "compact"
          ? "p-[0.4in]"
          : style?.spacing === "spacious"
            ? "p-[0.6in]"
            : "p-[0.5in]",
      lineHeight:
        style?.spacing === "compact"
          ? "leading-tight"
          : style?.spacing === "spacious"
            ? "leading-snug"
            : "leading-snug",
    },
    layout: {
      ...baseTemplate.layout,
      showPhoto,
      sectionDivider,
    },
    colors: {
      ...baseTemplate.colors,
      accent: accentColor,
      divider: accentColor,
    },
    sections: {
      ...baseTemplate.sections,
      order: sectionOrder,
      visible: resume.sectionOrder
        ? {
            summary: resume.sectionOrder.includes("summary"),
            experience: resume.sectionOrder.includes("experience"),
            education: resume.sectionOrder.includes("education"),
            skills: resume.sectionOrder.includes("skills"),
          }
        : baseTemplate.sections.visible,
    },
  };

  return { adjustedTemplate, headingFontId, bodyFontId };
}

export const ResumeCard = memo(function ResumeCard({
  resume,
  userName,
  onDelete,
  onDuplicate,
  onTailor,
  selected,
  onSelect,
}: {
  resume: ResumeCardData;
  userName?: string;
  onDelete: (id: Id<"resumes">) => void;
  onDuplicate?: (id: Id<"resumes">) => void;
  onTailor?: (id: Id<"resumes">) => void;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [isDownloading, setIsDownloading] = useState(false);

  const fallbackFirst = userName?.split(" ")[0] || "";
  const fallbackLast = userName?.split(" ").slice(1).join(" ") || "";

  const resumeData: ResumeData = useMemo(() => ({
    personalDetails: {
      firstName: resume.personalDetails?.firstName || fallbackFirst,
      lastName: resume.personalDetails?.lastName || fallbackLast,
      jobTitle: resume.personalDetails?.jobTitle || "",
    },
    contact: resume.contact || { email: "", phone: "", linkedin: "", location: "" },
    summary: resume.summary || "",
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
  }), [resume, fallbackFirst, fallbackLast]);

  const baseTemplate = useMemo(() => getTemplate(resume.template || "modern"), [resume.template]);
  const { adjustedTemplate, headingFontId, bodyFontId } = useMemo(
    () => buildAdjustedTemplate(resume, baseTemplate),
    [resume, baseTemplate]
  );
  const backgroundColor = resume.style?.backgroundColor || "#ffffff";

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = containerWidth / 816;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const filename = `${resume.title || "resume"}.pdf`.replace(/[^a-z0-9.-]/gi, "_");
      await generateResumePDF(resume._id, { filename });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className={`overflow-hidden !py-0 !gap-0 ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="!p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Thumbnail */}
          <Link
            href={`/resumes/${resume._id}/edit`}
            className="block shrink-0 p-4 sm:p-5"
          >
            <div
              ref={containerRef}
              className="relative mx-auto w-[180px] sm:w-[200px] overflow-hidden rounded-md border border-border cursor-pointer"
              style={{ aspectRatio: "8.5 / 11", backgroundColor }}
            >
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: "816px",
                  height: "1056px",
                  transform: `scale(${scale})`,
                }}
              >
                <TemplateRenderer
                  data={resumeData}
                  template={adjustedTemplate}
                  headingFontId={headingFontId}
                  bodyFontId={bodyFontId}
                />
              </div>
            </div>
          </Link>

          {/* Info + Actions */}
          <div className="flex flex-1 flex-col justify-center px-4 pb-4 sm:pl-2 sm:pr-5 sm:py-5">
            <Link
              href={`/resumes/${resume._id}/edit`}
              className="block"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {resume.title}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatRelativeDate(resume.updatedAt)}
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5 shadow-none"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                )}
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5 shadow-none"
                asChild
              >
                <Link href={`/resumes/${resume._id}/edit`}>
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </Button>
              {onDuplicate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full shadow-none"
                  onClick={() => onDuplicate(resume._id)}
                >
                  Copy
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 shadow-none text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(resume._id)}
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>

            {/* Tailor CTA */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg bg-muted px-3.5 py-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <svg className="absolute h-0 w-0" aria-hidden="true">
                  <defs>
                    <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0" style={{ stroke: "url(#sparkle-gradient)" }} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Tailor to a job</span>
                  <span className="text-sm text-muted-foreground">Match this resume to a specific job description</span>
                </div>
              </div>
              {onTailor ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-full shadow-none bg-white dark:bg-background w-full sm:w-auto"
                  onClick={() => onTailor(resume._id)}
                >
                  Tailor
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-full shadow-none bg-white dark:bg-background w-full sm:w-auto"
                  asChild
                >
                  <Link href={`/resumes/optimize?resumeId=${resume._id}`}>
                    Tailor
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
