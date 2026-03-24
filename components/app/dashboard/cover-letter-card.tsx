"use client";

import { useRef, useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { formatRelativeDate } from "./format-date";
import { CoverLetterRenderer, CoverLetterData } from "@/lib/cover-letter/CoverLetterRenderer";
import { getTemplate, getTemplateDefaultHeadingFont, getTemplateDefaultBodyFont, TemplateConfig } from "@/lib/templates";

async function generateCoverLetterPDF(
  coverLetterId: string,
  options: { filename?: string } = {}
): Promise<void> {
  const { filename = "cover-letter.pdf" } = options;

  const response = await fetch("/api/cover-letter-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coverLetterId, filename }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

interface CoverLetterCardData {
  _id: Id<"coverLetters">;
  title: string;
  updatedAt: number;
  personalDetails?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
  };
  letterContent?: {
    companyName: string;
    hiringManagerName: string;
    content: string;
  };
  template?: string;
  style?: {
    font: string;
    headingFont?: string;
    bodyFont?: string;
    spacing: string;
    accentColor: string;
    backgroundColor?: string;
  };
}

export const CoverLetterCard = memo(function CoverLetterCard({
  coverLetter,
  onDelete,
  onDuplicate,
  onTailor,
  selected,
  onSelect,
}: {
  coverLetter: CoverLetterCardData;
  onDelete: (id: Id<"coverLetters">) => void;
  onDuplicate?: (id: Id<"coverLetters">) => void;
  onTailor?: (id: Id<"coverLetters">) => void;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const filename = `${coverLetter.title || "cover-letter"}.pdf`.replace(/[^a-z0-9.-]/gi, "_");
      await generateCoverLetterPDF(coverLetter._id, { filename });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const personalDetails = useMemo(() => coverLetter.personalDetails || {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
  }, [coverLetter.personalDetails]);

  const letterContent = useMemo(() => coverLetter.letterContent || {
    companyName: "",
    hiringManagerName: "",
    content: "",
  }, [coverLetter.letterContent]);

  // Template and styling computation
  const templateId = coverLetter.template || "ats-classic";
  const baseTemplate = useMemo(() => getTemplate(templateId), [templateId]);
  const spacing = coverLetter.style?.spacing || "normal";
  const accentColor = coverLetter.style?.accentColor || baseTemplate.colors.accent;
  const backgroundColor = coverLetter.style?.backgroundColor || "#ffffff";

  const adjustedTemplate: TemplateConfig = useMemo(() => ({
    ...baseTemplate,
    spacing: {
      ...baseTemplate.spacing,
      sectionGap: spacing === "compact" ? "mb-2" : spacing === "spacious" ? "mb-4" : "mb-3",
      itemGap: spacing === "compact" ? "mt-1" : spacing === "spacious" ? "mt-2.5" : "mt-2",
      pagePadding: spacing === "compact" ? "p-[0.4in]" : spacing === "spacious" ? "p-[0.6in]" : "p-[0.5in]",
      lineHeight: spacing === "compact" ? "leading-tight" : spacing === "spacious" ? "leading-snug" : "leading-snug",
    },
    colors: {
      ...baseTemplate.colors,
      accent: accentColor,
      divider: accentColor,
    },
  }), [baseTemplate, spacing, accentColor]);

  const headingFontId = coverLetter.style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId = coverLetter.style?.bodyFont || getTemplateDefaultBodyFont(templateId);

  const coverLetterData: CoverLetterData = useMemo(() => ({
    personalDetails: {
      firstName: personalDetails.firstName || "",
      lastName: personalDetails.lastName || "",
      jobTitle: personalDetails.jobTitle || "",
      email: personalDetails.email || "",
      phone: personalDetails.phone || "",
      address: personalDetails.address || "",
    },
    letterContent: {
      companyName: letterContent.companyName || "",
      hiringManagerName: letterContent.hiringManagerName || "",
      content: letterContent.content || "",
    },
  }), [personalDetails, letterContent]);

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

  return (
    <Card className={`overflow-hidden !py-0 !gap-0 ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="!p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Thumbnail Preview */}
          <Link
            href={`/cover-letters/${coverLetter._id}/edit`}
            className="block shrink-0 p-4 sm:p-5"
          >
            <div
              ref={containerRef}
              className="relative mx-auto w-[180px] sm:w-[200px] overflow-hidden rounded-md border border-border cursor-pointer"
              style={{ aspectRatio: "8.5 / 11", backgroundColor: "#ffffff" }}
            >
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: "816px",
                  height: "1056px",
                  transform: `scale(${scale})`,
                  backgroundColor,
                }}
              >
                <CoverLetterRenderer
                  data={coverLetterData}
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
              href={`/cover-letters/${coverLetter._id}/edit`}
              className="block"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {coverLetter.title}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatRelativeDate(coverLetter.updatedAt)}
            </p>

            {/* Company Info */}
            {letterContent.companyName && (
              <p className="mt-2 text-sm text-muted-foreground">
                {letterContent.companyName}
              </p>
            )}

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
                <Link href={`/cover-letters/${coverLetter._id}/edit`}>
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </Button>
              {onDuplicate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 shadow-none"
                  onClick={() => onDuplicate(coverLetter._id)}
                >
                  <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                  Copy
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 shadow-none text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(coverLetter._id)}
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
                    <linearGradient id="sparkle-gradient-cl" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0" style={{ stroke: "url(#sparkle-gradient-cl)" }} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Tailor to a job</span>
                  <span className="text-sm text-muted-foreground">Re-generate this cover letter for a different job</span>
                </div>
              </div>
              {onTailor ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-full shadow-none bg-white dark:bg-background w-full sm:w-auto"
                  onClick={() => onTailor(coverLetter._id)}
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
                  <Link href={`/cover-letters/${coverLetter._id}/tailor`}>
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
