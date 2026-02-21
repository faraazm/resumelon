"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownTrayIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { TemplateRenderer, getTemplate, ResumeData } from "@/lib/templates";
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
}

function formatRelativeDate(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days} days ago`;

  const date = new Date(timestamp);
  return `Updated ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function ResumeCard({
  resume,
  userName,
  onDelete,
  onDuplicate,
  onTailor,
}: {
  resume: ResumeCardData;
  userName?: string;
  onDelete: (id: Id<"resumes">) => void;
  onDuplicate?: (id: Id<"resumes">) => void;
  onTailor?: (id: Id<"resumes">) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [isDownloading, setIsDownloading] = useState(false);

  const fallbackFirst = userName?.split(" ")[0] || "";
  const fallbackLast = userName?.split(" ").slice(1).join(" ") || "";

  const resumeData: ResumeData = {
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
  };

  const template = getTemplate(resume.template || "modern");

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
    <Card className="overflow-hidden !py-0 !gap-0">
      <CardContent className="!p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Thumbnail */}
          <Link
            href={`/app/resumes/${resume._id}/edit`}
            className="block shrink-0 p-4 sm:p-5"
          >
            <div
              ref={containerRef}
              className="relative mx-auto w-[180px] sm:w-[200px] overflow-hidden rounded-md border border-border/60 bg-white shadow-sm cursor-pointer transition-shadow hover:shadow-md"
              style={{ aspectRatio: "8.5 / 11" }}
            >
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: "816px",
                  height: "1056px",
                  transform: `scale(${scale})`,
                }}
              >
                <TemplateRenderer data={resumeData} template={template} />
              </div>
            </div>
          </Link>

          {/* Info + Actions */}
          <div className="flex flex-1 flex-col justify-center px-4 pb-4 sm:pl-2 sm:pr-5 sm:py-5">
            <Link
              href={`/app/resumes/${resume._id}/edit`}
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
                className="rounded-full shadow-none"
                asChild
              >
                <Link href={`/app/resumes/${resume._id}/edit`}>
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
                variant="outline"
                size="sm"
                className="rounded-full shadow-none"
                onClick={() => onDelete(resume._id)}
              >
                Delete
              </Button>
            </div>

            {/* Tailor CTA */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 px-3.5 py-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Applying for a job?</span> Generate a new version of this resume tailored to the job description
                </p>
              </div>
              {onTailor ? (
                <Button
                  size="sm"
                  className="shrink-0 rounded-full gap-1.5 shadow-none w-full sm:w-auto"
                  onClick={() => onTailor(resume._id)}
                >
                  Tailor
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="shrink-0 rounded-full gap-1.5 shadow-none w-full sm:w-auto"
                  asChild
                >
                  <Link href={`/app/resumes/optimize?resumeId=${resume._id}`}>
                    Tailor
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
