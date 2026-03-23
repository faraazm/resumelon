"use client";

import { TemplateConfig, getFontFamily } from "@/lib/templates/types";
import { sanitizeHtml } from "@/lib/sanitize";

export interface CoverLetterData {
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
  };
  letterContent: {
    companyName: string;
    hiringManagerName: string;
    content: string;
  };
}

interface CoverLetterRendererProps {
  data: CoverLetterData;
  template: TemplateConfig;
  headingFontId: string;
  bodyFontId: string;
  className?: string;
}

export function CoverLetterRenderer({
  data,
  template,
  headingFontId,
  bodyFontId,
  className = "",
}: CoverLetterRendererProps) {
  const { personalDetails, letterContent } = data;
  const headingFont = getFontFamily(headingFontId);
  const bodyFont = getFontFamily(bodyFontId);
  const accentColor = template.colors.accent;

  const fullName = `${personalDetails.firstName} ${personalDetails.lastName}`.trim();
  const hasContact = personalDetails.email || personalDetails.phone || personalDetails.address;

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const spacingClass =
    template.spacing.lineHeight === "leading-tight"
      ? "leading-tight"
      : template.spacing.lineHeight === "leading-relaxed"
        ? "leading-relaxed"
        : "leading-snug";

  return (
    <div
      className={`w-full h-full ${template.spacing.pagePadding} ${spacingClass} ${className}`}
      style={{
        fontFamily: bodyFont,
        color: template.colors.body,
        ["--heading-font" as string]: headingFont,
      }}
    >
      {/* Sender Header */}
      {(fullName || hasContact) && (
        <div className="mb-6">
          {fullName && (
            <p
              className="text-lg font-semibold"
              style={{
                fontFamily: headingFont,
                color: accentColor,
                fontSize: template.typography.nameFontSize || "18px",
              }}
            >
              {fullName}
            </p>
          )}
          {personalDetails.jobTitle && (
            <p className="text-sm" style={{ color: template.colors.muted }}>
              {personalDetails.jobTitle}
            </p>
          )}
          {hasContact && (
            <div className="mt-1 text-xs space-y-0.5" style={{ color: template.colors.muted }}>
              {personalDetails.email && <p>{personalDetails.email}</p>}
              {personalDetails.phone && <p>{personalDetails.phone}</p>}
              {personalDetails.address && <p>{personalDetails.address}</p>}
            </div>
          )}
        </div>
      )}

      {/* Date */}
      <p className="mb-6 text-sm" style={{ color: template.colors.body }}>
        {today}
      </p>

      {/* Letter Body */}
      <div
        className="prose prose-sm max-w-none [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-0.5"
        style={{
          color: template.colors.body,
          fontSize: template.typography.bodyFontSize || "10pt",
        }}
        dangerouslySetInnerHTML={{
          __html: letterContent.content
            ? sanitizeHtml(letterContent.content)
            : '<p style="color: #9ca3af; font-style: italic;">Start writing your cover letter content...</p>',
        }}
      />
    </div>
  );
}
