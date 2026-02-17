"use client";

import { TemplateConfig, ResumeData } from "./types";

// Utility to get font class
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

  return (
    <div className="text-center mb-4">
      {fullName && (
        <h1
          className={`${typography.nameFontSize} ${typography.nameWeight} ${getFontClass(typography.headingFont)}`}
          style={{ color: colors.heading }}
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

  return (
    <div className={spacing.sectionGap}>
      <h2
        className={`${typography.sectionFontSize} ${typography.sectionWeight} uppercase tracking-wider mb-2`}
        style={{ color: colors.accent }}
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

  const alignmentClass = layout.headerAlignment === "center" ? "text-center" : "text-left";

  return (
    <header className={alignmentClass}>
      {fullName && (
        <h1
          className={`${typography.nameFontSize} ${typography.nameWeight} ${getFontClass(typography.headingFont)} tracking-tight`}
          style={{ color: colors.heading }}
        >
          {fullName}
        </h1>
      )}
      {personalDetails.jobTitle && (
        <p
          className={`${typography.bodyFontSize} mt-0.5`}
          style={{ color: colors.muted }}
        >
          {personalDetails.jobTitle}
        </p>
      )}
      {contactItems.length > 0 && (
        <p className="text-[10px] mt-1.5" style={{ color: colors.muted }}>
          {contactItems.map((item, index) => (
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
  const showLineDivider = layout.sectionDivider === "line";
  const showAccentDivider = layout.sectionDivider === "accent";

  if (showAccentDivider) {
    return (
      <div className="mb-2">
        <h2
          className={`${typography.sectionFontSize} ${typography.sectionWeight} ${getFontClass(typography.headingFont)} uppercase tracking-wider mb-1`}
          style={{ color: colors.accent }}
        >
          {title}
        </h2>
        <div
          className="h-0.5 w-full"
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    );
  }

  // For line divider or no divider, use accent color for section titles
  return (
    <h2
      className={`${typography.sectionFontSize} ${typography.sectionWeight} ${getFontClass(typography.headingFont)} uppercase tracking-wider ${
        showLineDivider ? "border-b pb-1" : ""
      } mb-2`}
      style={{
        color: colors.accent,
        borderColor: showLineDivider ? colors.divider : "transparent",
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
    <section className={template.spacing.sectionGap}>
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
  const { typography, spacing, layout, colors } = template;

  return (
    <div className={!isFirst ? spacing.itemGap : ""}>
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`font-semibold ${typography.bodyFontSize}`}
            style={{ color: colors.heading }}
          >
            {job.title}
          </p>
          <p className={typography.bodyFontSize} style={{ color: colors.muted }}>
            {job.company}
            {job.location && ` · ${job.location}`}
          </p>
        </div>
        <p className="text-[10px] shrink-0" style={{ color: colors.muted }}>
          {formatDateRange(job.startDate, job.endDate, job.current)}
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
  const { typography, spacing, colors } = template;

  return (
    <div className={!isFirst ? "mt-2" : ""}>
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`font-semibold ${typography.bodyFontSize}`}
            style={{ color: colors.heading }}
          >
            {edu.degree}
          </p>
          <p className={typography.bodyFontSize} style={{ color: colors.muted }}>
            {edu.school}
          </p>
        </div>
        <p className="text-[10px] shrink-0" style={{ color: colors.muted }}>
          {formatDateRange(edu.startDate, edu.endDate)}
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

export function BulletList({ bullets, template }: BulletListProps) {
  const { typography, layout, colors } = template;

  const listStyleClass =
    layout.bulletStyle === "dash"
      ? "list-none"
      : layout.bulletStyle === "circle"
      ? "list-[circle]"
      : "list-disc";

  return (
    <ul className={`mt-1.5 space-y-0.5 ${listStyleClass} list-outside ml-4`}>
      {bullets.map((bullet, index) => (
        <li
          key={index}
          className={typography.bodyFontSize}
          style={{ color: colors.body }}
        >
          {layout.bulletStyle === "dash" && (
            <span className="mr-2" style={{ color: colors.muted }}>
              -
            </span>
          )}
          {bullet}
        </li>
      ))}
    </ul>
  );
}

// Skills Display Component
interface SkillsDisplayProps {
  skills: string[];
  template: TemplateConfig;
}

export function SkillsDisplay({ skills, template }: SkillsDisplayProps) {
  const { typography, colors } = template;

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

  return (
    <p className={typography.bodyFontSize} style={{ color: colors.body }}>
      {summary}
    </p>
  );
}

// Empty State Component
export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
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
      <p className="text-sm font-medium text-gray-900">Your resume preview</p>
      <p className="text-xs text-gray-500 mt-1">
        Start filling in your details to see your resume come to life
      </p>
    </div>
  );
}
