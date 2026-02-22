"use client";

import { TemplateConfig, ResumeData } from "./types";
import { LETTER_HEIGHT_PX } from "@/lib/pdf-constants";

// The heading font style - uses CSS variable if set, otherwise falls back to class
function getHeadingStyle(): React.CSSProperties {
  return { fontFamily: "var(--heading-font, inherit)" };
}

// Utility to get font class (fallback when CSS variable not set)
function getFontClass(fontType: "serif" | "sans"): string {
  return fontType === "serif" ? "font-serif" : "font-sans";
}

// Utility to format date range
function formatDateRange(start?: string, end?: string, current?: boolean): string {
  if (!start && !end) return "";
  const startStr = start || "";
  const endStr = current ? "Present" : end || "";
  if (startStr && endStr) return `${startStr} - ${endStr}`;
  return startStr || endStr;
}

// ===================
// SIDEBAR COMPONENTS
// ===================

// Helper to get text transform style
function getTextTransform(transform?: "uppercase" | "capitalize" | "none"): string {
  switch (transform) {
    case "uppercase": return "uppercase";
    case "capitalize": return "capitalize";
    case "none":
    default: return "normal-case";
  }
}

// Sidebar Header Component
interface SidebarHeaderProps {
  data: ResumeData;
  template: TemplateConfig;
}

export function SidebarHeader({ data, template }: SidebarHeaderProps) {
  const { personalDetails } = data;
  const { typography, colors } = template;

  const fullName = [personalDetails.firstName, personalDetails.lastName]
    .filter(Boolean)
    .join(" ");

  // Build optional personal details items for sidebar
  const optionalItems: string[] = [];
  if (personalDetails.nationality) {
    optionalItems.push(personalDetails.nationality);
  }
  if (personalDetails.driverLicense) {
    optionalItems.push(`License: ${personalDetails.driverLicense}`);
  }
  if (personalDetails.birthDate) {
    optionalItems.push(`DOB: ${personalDetails.birthDate}`);
  }

  // Get text transform class for name
  const nameTransformClass = getTextTransform(typography.nameTransform);

  return (
    <div className="text-center mb-4">
      {fullName && (
        <h1
          className={`${typography.nameFontSize} ${typography.nameWeight} ${typography.nameLetterSpacing || ""} ${nameTransformClass}`}
          style={{ color: colors.heading, fontFamily: "var(--heading-font, inherit)" }}
        >
          {fullName}
        </h1>
      )}
      {personalDetails.jobTitle && (
        <p
          className={`${typography.bodyFontSize} mt-1`}
          style={{ color: colors.muted }}
        >
          {personalDetails.jobTitle}
        </p>
      )}
      {optionalItems.length > 0 && (
        <p
          className="text-[9px] mt-1"
          style={{ color: colors.muted, opacity: 0.8 }}
        >
          {optionalItems.join(" • ")}
        </p>
      )}
    </div>
  );
}

// Sidebar Section Component
interface SidebarSectionProps {
  title: string;
  template: TemplateConfig;
  children: React.ReactNode;
}

export function SidebarSection({ title, template, children }: SidebarSectionProps) {
  const { typography, colors, spacing } = template;
  const sectionTransformClass = getTextTransform(typography.sectionTransform);

  return (
    <div className={spacing.sectionGap}>
      <h2
        className={`${typography.sectionFontSize} ${typography.sectionWeight} ${sectionTransformClass} ${typography.sectionLetterSpacing || "tracking-wider"} mb-2`}
        style={{ color: colors.accent, fontFamily: "var(--heading-font, inherit)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// Sidebar Contact Component
interface SidebarContactProps {
  contact: ResumeData["contact"];
  template: TemplateConfig;
}

export function SidebarContact({ contact, template }: SidebarContactProps) {
  const { typography, colors } = template;
  const items = [
    { label: "Email", value: contact?.email },
    { label: "Phone", value: contact?.phone },
    { label: "Location", value: contact?.location },
    { label: "LinkedIn", value: contact?.linkedin },
  ].filter(item => item.value);

  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <p
          key={index}
          className={`${typography.bodyFontSize} break-words`}
          style={{ color: colors.muted }}
        >
          {item.value}
        </p>
      ))}
    </div>
  );
}

// Sidebar Skills Component
interface SidebarSkillsProps {
  skills: string[];
  template: TemplateConfig;
}

export function SidebarSkills({ skills, template }: SidebarSkillsProps) {
  const { typography, colors } = template;

  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill, index) => (
        <span
          key={index}
          className={`${typography.bodyFontSize} px-2 py-0.5 rounded`}
          style={{
            backgroundColor: `${colors.accent}20`,
            color: colors.muted,
          }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

// Sidebar Education Component
interface SidebarEducationProps {
  education: ResumeData["education"];
  template: TemplateConfig;
}

export function SidebarEducation({ education, template }: SidebarEducationProps) {
  const { typography, colors } = template;

  return (
    <div className="space-y-3">
      {education.map((edu, index) => (
        <div key={edu.id || index}>
          <p
            className={`${typography.bodyFontSize} font-medium`}
            style={{ color: colors.muted }}
          >
            {edu.degree}
          </p>
          <p
            className={`${typography.bodyFontSize}`}
            style={{ color: colors.muted, opacity: 0.8 }}
          >
            {edu.school}
          </p>
          <p
            className="text-[9px]"
            style={{ color: colors.muted, opacity: 0.6 }}
          >
            {formatDateRange(edu.startDate, edu.endDate)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ===================
// STANDARD COMPONENTS
// ===================

// Header Component
interface HeaderProps {
  data: ResumeData;
  template: TemplateConfig;
}

export function Header({ data, template }: HeaderProps) {
  const { personalDetails, contact } = data;
  const { typography, layout, colors } = template;

  const fullName = [personalDetails.firstName, personalDetails.lastName]
    .filter(Boolean)
    .join(" ");

  const contactItems = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
  ].filter(Boolean);

  // Build optional personal details items
  const optionalItems: string[] = [];
  if (personalDetails.nationality) {
    optionalItems.push(personalDetails.nationality);
  }
  if (personalDetails.driverLicense) {
    optionalItems.push(`Driver License: ${personalDetails.driverLicense}`);
  }
  if (personalDetails.birthDate) {
    optionalItems.push(`DOB: ${personalDetails.birthDate}`);
  }

  const alignmentClass = layout.headerAlignment === "center" ? "text-center" : "text-left";
  const nameTransformClass = getTextTransform(typography.nameTransform);
  const contactLayout = layout.contactLayout || "inline";

  // Render contact based on layout type
  const renderContact = () => {
    if (contactItems.length === 0) return null;

    if (contactLayout === "stacked") {
      return (
        <div className="mt-1 space-y-0.5">
          {contactItems.map((item, index) => (
            <p key={index} className="text-[9pt]" style={{ color: colors.muted }}>
              {item}
            </p>
          ))}
        </div>
      );
    }

    if (contactLayout === "two-column") {
      const half = Math.ceil(contactItems.length / 2);
      const leftItems = contactItems.slice(0, half);
      const rightItems = contactItems.slice(half);
      return (
        <div className="mt-1 flex justify-between text-[9pt]" style={{ color: colors.muted }}>
          <div className="space-y-0.5">
            {leftItems.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
          <div className="space-y-0.5 text-right">
            {rightItems.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      );
    }

    // Default: inline
    return (
      <p className="text-[9pt] mt-1" style={{ color: colors.muted }}>
        {contactItems.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-1.5">|</span>}
            {item}
          </span>
        ))}
      </p>
    );
  };

  return (
    <header className={`${alignmentClass} mb-3`}>
      {fullName && (
        <h1
          className={`${typography.nameFontSize} ${typography.nameWeight} ${typography.nameLetterSpacing || "tracking-tight"} ${nameTransformClass}`}
          style={{
            color: colors.heading,
            fontFamily: "var(--heading-font, inherit)",
            lineHeight: "1.1",
            marginBottom: "2px",
            ...(colors.nameBg && {
              backgroundColor: colors.nameBg,
              padding: "4px 8px",
              display: "inline-block"
            }),
          }}
        >
          {fullName}
        </h1>
      )}
      {personalDetails.jobTitle && (
        <p
          className={`${typography.bodyFontSize}`}
          style={{ color: colors.muted, lineHeight: "1.2" }}
        >
          {personalDetails.jobTitle}
        </p>
      )}
      {renderContact()}
      {optionalItems.length > 0 && (
        <p className="text-[9pt] mt-0.5" style={{ color: colors.muted }}>
          {optionalItems.map((item, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-1.5">|</span>}
              {item}
            </span>
          ))}
        </p>
      )}
    </header>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  template: TemplateConfig;
}

export function SectionHeader({ title, template }: SectionHeaderProps) {
  const { typography, layout, colors } = template;
  const sectionTransformClass = getTextTransform(typography.sectionTransform);
  const letterSpacingClass = typography.sectionLetterSpacing || "tracking-wider";

  const showLineDivider = layout.sectionDivider === "line";
  const showAccentDivider = layout.sectionDivider === "accent";
  const showBackgroundDivider = layout.sectionDivider === "background";

  // Background divider style (gray background behind section header)
  if (showBackgroundDivider) {
    return (
      <div
        className="section-header mb-1.5 px-2 py-1"
        style={{
          backgroundColor: colors.sectionHeaderBg || "#f3f4f6",
          breakAfter: "avoid",
          pageBreakAfter: "avoid",
        }}
      >
        <h2
          className={`${typography.sectionFontSize} ${typography.sectionWeight} ${sectionTransformClass} ${letterSpacingClass}`}
          style={{
            color: colors.accent,
            fontFamily: "var(--heading-font, inherit)",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h2>
      </div>
    );
  }

  if (showAccentDivider) {
    return (
      <div
        className="section-header mb-1.5"
        style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}
      >
        <h2
          className={`${typography.sectionFontSize} ${typography.sectionWeight} ${sectionTransformClass} ${letterSpacingClass} mb-0.5`}
          style={{
            color: colors.accent,
            fontFamily: "var(--heading-font, inherit)",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h2>
        <div
          className="h-[1.5px] w-full"
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    );
  }

  // For line divider or no divider, use accent color for section titles
  return (
    <h2
      className={`section-header ${typography.sectionFontSize} ${typography.sectionWeight} ${sectionTransformClass} ${letterSpacingClass} ${
        showLineDivider ? "border-b pb-0.5" : ""
      } mb-1.5`}
      style={{
        color: colors.accent,
        borderColor: showLineDivider ? colors.divider : "transparent",
        fontFamily: "var(--heading-font, inherit)",
        lineHeight: "1.2",
        breakAfter: "avoid",
        pageBreakAfter: "avoid",
      }}
    >
      {title}
    </h2>
  );
}

// Section Wrapper Component
interface SectionProps {
  title: string;
  template: TemplateConfig;
  children: React.ReactNode;
  show?: boolean;
}

export function Section({ title, template, children, show = true }: SectionProps) {
  if (!show) return null;

  return (
    <section
      className={template.spacing.sectionGap}
      style={{ breakInside: "avoid-page" }}
    >
      <SectionHeader title={title} template={template} />
      {children}
    </section>
  );
}

// Experience Item Component
interface ExperienceItemProps {
  job: ResumeData["experience"][0];
  template: TemplateConfig;
  isFirst: boolean;
}

export function ExperienceItem({ job, template, isFirst }: ExperienceItemProps) {
  const { typography, spacing, colors, layout } = template;
  const datePosition = layout.datePosition || "right";
  const dateStr = formatDateRange(job.startDate, job.endDate, job.current);

  // Date below the title/company
  if (datePosition === "below") {
    return (
      <div
        className={`job-block ${!isFirst ? spacing.itemGap : ""}`}
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        <p
          className={`font-semibold ${typography.bodyFontSize}`}
          style={{ color: colors.heading, lineHeight: "1.2" }}
        >
          {job.title}
        </p>
        <p
          className={typography.bodyFontSize}
          style={{ color: colors.muted, lineHeight: "1.2" }}
        >
          {job.company}
          {job.location && ` · ${job.location}`}
        </p>
        {dateStr && (
          <p
            className="text-[9pt] mt-0.5"
            style={{ color: colors.muted }}
          >
            {dateStr}
          </p>
        )}
        {job.bullets && job.bullets.length > 0 && (
          <BulletList bullets={job.bullets} template={template} />
        )}
      </div>
    );
  }

  // Date on the left (timeline style)
  if (datePosition === "left") {
    return (
      <div
        className={`job-block ${!isFirst ? spacing.itemGap : ""} flex gap-4`}
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        <div className="w-[80px] shrink-0 text-right">
          <p
            className="text-[9pt] whitespace-nowrap"
            style={{ color: colors.muted }}
          >
            {dateStr}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${typography.bodyFontSize}`}
            style={{ color: colors.heading, lineHeight: "1.2" }}
          >
            {job.title}
          </p>
          <p
            className={typography.bodyFontSize}
            style={{ color: colors.muted, lineHeight: "1.2" }}
          >
            {job.company}
            {job.location && ` · ${job.location}`}
          </p>
          {job.bullets && job.bullets.length > 0 && (
            <BulletList bullets={job.bullets} template={template} />
          )}
        </div>
      </div>
    );
  }

  // Default: date on the right
  return (
    <div
      className={`job-block ${!isFirst ? spacing.itemGap : ""}`}
      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
    >
      <div className="flex justify-between items-baseline gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${typography.bodyFontSize}`}
            style={{ color: colors.heading, lineHeight: "1.2" }}
          >
            {job.title}
          </p>
          <p
            className={typography.bodyFontSize}
            style={{ color: colors.muted, lineHeight: "1.2" }}
          >
            {job.company}
            {job.location && ` · ${job.location}`}
          </p>
        </div>
        <p
          className="text-[9pt] shrink-0 whitespace-nowrap"
          style={{ color: colors.muted }}
        >
          {dateStr}
        </p>
      </div>
      {job.bullets && job.bullets.length > 0 && (
        <BulletList bullets={job.bullets} template={template} />
      )}
    </div>
  );
}

// Education Item Component
interface EducationItemProps {
  edu: ResumeData["education"][0];
  template: TemplateConfig;
  isFirst: boolean;
}

export function EducationItem({ edu, template, isFirst }: EducationItemProps) {
  const { typography, colors, layout } = template;
  const datePosition = layout.datePosition || "right";
  const dateStr = formatDateRange(edu.startDate, edu.endDate);

  // Date below the degree/school
  if (datePosition === "below") {
    return (
      <div
        className={`education-block ${!isFirst ? "mt-1.5" : ""}`}
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        <p
          className={`font-semibold ${typography.bodyFontSize}`}
          style={{ color: colors.heading, lineHeight: "1.2" }}
        >
          {edu.degree}
        </p>
        <p
          className={typography.bodyFontSize}
          style={{ color: colors.muted, lineHeight: "1.2" }}
        >
          {edu.school}
        </p>
        {dateStr && (
          <p
            className="text-[9pt] mt-0.5"
            style={{ color: colors.muted }}
          >
            {dateStr}
          </p>
        )}
      </div>
    );
  }

  // Date on the left (timeline style)
  if (datePosition === "left") {
    return (
      <div
        className={`education-block ${!isFirst ? "mt-1.5" : ""} flex gap-4`}
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        <div className="w-[80px] shrink-0 text-right">
          <p
            className="text-[9pt] whitespace-nowrap"
            style={{ color: colors.muted }}
          >
            {dateStr}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${typography.bodyFontSize}`}
            style={{ color: colors.heading, lineHeight: "1.2" }}
          >
            {edu.degree}
          </p>
          <p
            className={typography.bodyFontSize}
            style={{ color: colors.muted, lineHeight: "1.2" }}
          >
            {edu.school}
          </p>
        </div>
      </div>
    );
  }

  // Default: date on the right
  return (
    <div
      className={`education-block ${!isFirst ? "mt-1.5" : ""}`}
      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
    >
      <div className="flex justify-between items-baseline gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${typography.bodyFontSize}`}
            style={{ color: colors.heading, lineHeight: "1.2" }}
          >
            {edu.degree}
          </p>
          <p
            className={typography.bodyFontSize}
            style={{ color: colors.muted, lineHeight: "1.2" }}
          >
            {edu.school}
          </p>
        </div>
        <p
          className="text-[9pt] shrink-0 whitespace-nowrap"
          style={{ color: colors.muted }}
        >
          {dateStr}
        </p>
      </div>
    </div>
  );
}

// Bullet List Component
interface BulletListProps {
  bullets: string[];
  template: TemplateConfig;
}

/**
 * Clean bullet text by removing leading bullet characters
 * This handles cases where the data already contains bullets like "• text" or "- text"
 */
function cleanBulletText(text: string): string {
  // Remove leading bullet points, dashes, or asterisks (with optional whitespace)
  return text.replace(/^[\s]*[•\-\*\–\—][\s]+/, "").trim();
}

/**
 * Strip HTML tags and get plain text for bullet detection
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Check if content contains HTML tags
 */
function containsHtml(text: string): boolean {
  return /<[^>]+>/.test(text);
}

export function BulletList({ bullets, template }: BulletListProps) {
  const { typography, layout, colors } = template;

  // Filter out empty bullets and clean text
  const cleanedBullets = bullets
    .map((b) => {
      // For HTML content, strip tags to clean bullet prefix, but keep original HTML
      if (containsHtml(b)) {
        const plainText = stripHtml(b);
        const cleanedPlain = cleanBulletText(plainText);
        // If the plain text was modified (had bullet prefix), we need to handle it
        // But generally, HTML content from TipTap won't have bullet prefixes
        return cleanedPlain.length > 0 ? b : "";
      }
      return cleanBulletText(b);
    })
    .filter((b) => {
      const text = containsHtml(b) ? stripHtml(b) : b;
      return text.length > 0;
    });

  if (cleanedBullets.length === 0) return null;

  const listStyleClass =
    layout.bulletStyle === "dash"
      ? "list-none"
      : layout.bulletStyle === "circle"
        ? "list-[circle]"
        : "list-disc";

  return (
    <ul
      className={`mt-1 ${listStyleClass} list-outside`}
      style={{
        marginLeft: "1rem",
        paddingLeft: "0.25rem",
      }}
    >
      {cleanedBullets.map((bullet, index) => {
        const hasHtml = containsHtml(bullet);

        return (
          <li
            key={index}
            className={typography.bodyFontSize}
            style={{
              color: colors.body,
              marginBottom: "1px",
              paddingLeft: "2px",
              lineHeight: "1.3",
            }}
          >
            {layout.bulletStyle === "dash" && (
              <span className="mr-1.5" style={{ color: colors.muted }}>
                -
              </span>
            )}
            {hasHtml ? (
              <span dangerouslySetInnerHTML={{ __html: bullet }} />
            ) : (
              bullet
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Skills Display Component
interface SkillsDisplayProps {
  skills: string[];
  template: TemplateConfig;
}

export function SkillsDisplay({ skills, template }: SkillsDisplayProps) {
  const { typography, colors, layout } = template;
  const skillsLayout = layout.skillsLayout || "inline";

  // Tags layout - pill-shaped badges
  if (skillsLayout === "tags") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className={`${typography.bodyFontSize} px-2 py-0.5 rounded`}
            style={{
              backgroundColor: `${colors.accent}15`,
              color: colors.body,
              border: `1px solid ${colors.accent}30`,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  // Grid layout - 2-3 columns
  if (skillsLayout === "grid") {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {skills.map((skill, index) => (
          <p
            key={index}
            className={typography.bodyFontSize}
            style={{ color: colors.body }}
          >
            • {skill}
          </p>
        ))}
      </div>
    );
  }

  // Bars layout - progress bar style (visual flair)
  if (skillsLayout === "bars") {
    return (
      <div className="space-y-1.5">
        {skills.map((skill, index) => (
          <div key={index}>
            <p className={`${typography.bodyFontSize} mb-0.5`} style={{ color: colors.body }}>
              {skill}
            </p>
            <div className="h-1 w-full rounded bg-gray-200">
              <div
                className="h-1 rounded"
                style={{
                  backgroundColor: colors.accent,
                  width: `${85 + (index % 3) * 5}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: inline with bullet separators
  return (
    <p className={typography.bodyFontSize} style={{ color: colors.body }}>
      {skills.join(" · ")}
    </p>
  );
}

// Summary Component
interface SummaryProps {
  summary: string;
  template: TemplateConfig;
}

export function Summary({ summary, template }: SummaryProps) {
  const { typography, colors } = template;

  // Check if summary contains HTML tags
  const containsHtml = /<[^>]+>/.test(summary);

  if (containsHtml) {
    return (
      <div
        className={`${typography.bodyFontSize} prose prose-sm max-w-none`}
        style={{
          color: colors.body,
          lineHeight: "1.35",
          // Reset prose styles to match resume styling
          "--tw-prose-body": colors.body,
          "--tw-prose-headings": colors.heading,
        } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    );
  }

  return (
    <p
      className={typography.bodyFontSize}
      style={{ color: colors.body, lineHeight: "1.35" }}
    >
      {summary}
    </p>
  );
}

// Empty State Component
// Uses fixed height matching Letter paper size for proper centering
export function EmptyState() {
  return (
    <div
      className="w-full flex flex-col items-center justify-center text-center px-6"
      style={{ height: LETTER_HEIGHT_PX }}
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        Your Resume Preview
      </h3>
      <p className="text-base text-gray-500 max-w-sm">
        Start filling in your details to see your resume come to life
      </p>
    </div>
  );
}
