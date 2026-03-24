"use client";

/**
 * Unified BlockRenderer - the SINGLE source of truth for rendering blocks
 *
 * This component is used by BOTH the measurement system (BlockMeasurer) and
 * the display system (PageRenderer) to ensure pixel-perfect consistency.
 *
 * DO NOT duplicate block rendering logic elsewhere. Any changes to how blocks
 * render must be made here to keep measurement and display in sync.
 */

import { Block } from "./types";
import { TemplateConfig, ResumeData } from "@/lib/templates/types";

// Type aliases extracted from ResumeData for cleaner code
type ExperienceEntry = ResumeData["experience"][number];
type EducationEntry = ResumeData["education"][number];
type PersonalDetails = ResumeData["personalDetails"];
type Contact = ResumeData["contact"];

interface SidebarDataType {
  personalDetails: PersonalDetails;
  contact: Contact;
  skills: string[];
  education: EducationEntry[];
}

interface HeaderDataType {
  personalDetails: PersonalDetails;
  contact: Contact;
}
import {
  Header,
  SectionHeader,
  Summary,
  EducationItem,
  SkillsDisplay,
  BulletList,
  SidebarHeader,
  SidebarSection,
  SidebarContact,
  SidebarSkills,
  SidebarEducation,
} from "@/lib/templates/components";
import { LETTER_HEIGHT_PX } from "@/lib/pdf-constants";

interface BlockRendererProps {
  block: Block;
  template: TemplateConfig;
  /** When true, avoids fixed heights for accurate measurement */
  forMeasurement?: boolean;
}

/**
 * Renders a single block using the template configuration.
 * This is the canonical renderer - used by both measurement and display.
 */
export function BlockRenderer({ block, template, forMeasurement = false }: BlockRendererProps) {
  const { spacing, layout } = template;
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case "header": {
      const resumeData: HeaderDataType = {
        personalDetails: data.personalDetails as PersonalDetails,
        contact: data.contact as Contact,
      };

      if (layout.showPhoto && layout.headerAlignment === "center") {
        return (
          <div>
            <div className="flex justify-center mb-2">
              <PhotoCircle
                personalDetails={resumeData.personalDetails}
                size="h-16 w-16"
              />
            </div>
            <Header data={resumeData as ResumeData} template={template} />
          </div>
        );
      }
      if (layout.showPhoto) {
        return (
          <div className="flex items-start justify-between gap-3">
            <Header data={resumeData as ResumeData} template={template} />
            <PhotoCircle
              personalDetails={resumeData.personalDetails}
              size="h-14 w-14"
            />
          </div>
        );
      }
      return <Header data={resumeData as ResumeData} template={template} />;
    }

    case "section-header": {
      const title = (data as { title: string }).title;
      // Section top gap matches the section gap setting
      const sectionTopGap =
        spacing.sectionGap === "mb-2"
          ? "mt-2"
          : spacing.sectionGap === "mb-4"
            ? "mt-4"
            : "mt-3";
      return (
        <div className={sectionTopGap}>
          <SectionHeader title={title} template={template} />
        </div>
      );
    }

    case "summary": {
      const summary = (data as { summary: string }).summary;
      return <Summary summary={summary} template={template} />;
    }

    case "experience-meta": {
      const job = (data as { job: ExperienceEntry }).job;
      return (
        <ExperienceMetaOnly
          job={job}
          template={template}
          isFirst={block.isFirst ?? false}
        />
      );
    }

    case "bullet": {
      const text = (data as { text: string }).text;
      return <BulletList bullets={[text]} template={template} />;
    }

    case "education-item": {
      // Legacy: full education entry (kept for compatibility)
      const edu = (data as { edu: EducationEntry }).edu;
      return (
        <EducationItem
          edu={edu}
          template={template}
          isFirst={block.isFirst ?? false}
        />
      );
    }

    case "education-degree": {
      // Fine-grained: just the degree line
      const { degree, field } = data as { degree: string; field: string };
      const degreeText = [degree, field].filter(Boolean).join(" in ");
      return (
        <EducationDegreeLine
          degreeText={degreeText}
          template={template}
          isFirst={block.isFirst ?? false}
        />
      );
    }

    case "education-school": {
      // Fine-grained: school + location + dates
      const schoolData = data as {
        school: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
      };
      return (
        <EducationSchoolLine
          school={schoolData.school}
          location={schoolData.location}
          startDate={schoolData.startDate}
          endDate={schoolData.endDate}
          current={schoolData.current}
          template={template}
        />
      );
    }

    case "skills": {
      const skills = (data as { skills: string[] }).skills;
      return <SkillsDisplay skills={skills} template={template} />;
    }

    case "sidebar": {
      // Sidebar is rendered specially by PageRenderer but we still need to
      // provide measurement capability
      const sidebarData = data as unknown as SidebarDataType;
      const sidebarSections =
        template.sections.sidebarSections || ["contact", "skills", "education"];

      return (
        <SidebarContent
          sidebarData={sidebarData}
          sidebarSections={sidebarSections}
          template={template}
          forMeasurement={forMeasurement}
        />
      );
    }

    default:
      return null;
  }
}

/**
 * Renders a list of blocks, grouping consecutive bullets by jobId.
 * This handles the bullet grouping logic consistently.
 */
export function BlockListRenderer({
  blocks,
  template,
}: {
  blocks: Block[];
  template: TemplateConfig;
}) {
  const segments: Array<
    | { type: "single"; block: Block }
    | { type: "bullet-group"; jobId: string; bullets: Block[] }
  > = [];

  for (const block of blocks) {
    if (block.type === "bullet" && block.jobId) {
      const last = segments[segments.length - 1];
      if (last && last.type === "bullet-group" && last.jobId === block.jobId) {
        last.bullets.push(block);
      } else {
        segments.push({
          type: "bullet-group",
          jobId: block.jobId,
          bullets: [block],
        });
      }
    } else {
      segments.push({ type: "single", block });
    }
  }

  // CRITICAL: Each block is wrapped in a div with overflow:hidden AND the
  // lineHeight class to EXACTLY match BlockMeasurer. This prevents margin
  // collapse between blocks, ensuring measured heights = rendered heights.
  const { spacing } = template;

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === "bullet-group") {
          const bulletTexts = segment.bullets.map(
            (b) => (b.data as { text: string }).text
          );
          return (
            <div
              key={`bullets-${segment.jobId}-${i}`}
              className={spacing.lineHeight}
              style={{ overflow: "hidden" }}
            >
              <BulletList
                bullets={bulletTexts}
                template={template}
              />
            </div>
          );
        }

        const block = segment.block;
        return (
          <div
            key={block.id}
            className={spacing.lineHeight}
            style={{ overflow: "hidden" }}
          >
            <BlockRenderer block={block} template={template} />
          </div>
        );
      })}
    </>
  );
}

/**
 * Experience meta row (title, company, dates) without bullets.
 * Shared by both measurement and display.
 */
function ExperienceMetaOnly({
  job,
  template,
  isFirst,
}: {
  job: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
  };
  template: TemplateConfig;
  isFirst: boolean;
}) {
  const { typography, spacing, colors, layout } = template;
  const datePosition = layout.datePosition || "right";

  const formatDateRange = (
    start?: string,
    end?: string,
    current?: boolean
  ): string => {
    if (!start && !end) return "";
    const startStr = start || "";
    const endStr = current ? "Present" : end || "";
    if (startStr && endStr) return `${startStr} - ${endStr}`;
    return startStr || endStr;
  };

  const dateStr = formatDateRange(job.startDate, job.endDate, job.current);

  if (datePosition === "below") {
    return (
      <div className={!isFirst ? spacing.itemGap : ""}>
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
          <p className="text-[9pt] mt-0.5" style={{ color: colors.muted }}>
            {dateStr}
          </p>
        )}
      </div>
    );
  }

  if (datePosition === "left") {
    return (
      <div className={`${!isFirst ? spacing.itemGap : ""} flex gap-3`}>
        <div className="w-[130px] shrink-0 text-right">
          <p className="text-[9pt]" style={{ color: colors.muted }}>
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
        </div>
      </div>
    );
  }

  // Default: right
  return (
    <div className={!isFirst ? spacing.itemGap : ""}>
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
    </div>
  );
}

/**
 * Photo circle component - shared by header and sidebar.
 */
export function PhotoCircle({
  personalDetails,
  size,
  textSize,
}: {
  personalDetails: {
    firstName?: string;
    lastName?: string;
    photoUrl?: string | null;
  };
  size: string;
  textSize?: string;
}) {
  return (
    <div
      className={`${size} shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${textSize || "text-lg"} text-gray-500 font-medium`}
    >
      {personalDetails?.photoUrl ? (
        <img
          src={personalDetails.photoUrl}
          alt={`${personalDetails?.firstName || ""} ${personalDetails?.lastName || ""}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          {personalDetails?.firstName?.charAt(0) || ""}
          {personalDetails?.lastName?.charAt(0) || ""}
        </>
      )}
    </div>
  );
}

/**
 * Sidebar content renderer - used by both measurement and display.
 */
export function SidebarContent({
  sidebarData,
  sidebarSections,
  template,
  forMeasurement = false,
}: {
  sidebarData: SidebarDataType;
  sidebarSections: string[];
  template: TemplateConfig;
  /** When true, don't set minHeight so we measure actual content */
  forMeasurement?: boolean;
}) {
  const { layout, spacing, colors } = template;

  return (
    <div
      className={`${template.layout.sidebarWidth || "w-[180px]"} p-5 ${spacing.lineHeight}`}
      style={{
        backgroundColor: colors.sidebar,
        width: parseSidebarWidth(template.layout.sidebarWidth),
        // Only set minHeight when actually rendering, not during measurement
        ...(forMeasurement ? {} : { minHeight: LETTER_HEIGHT_PX }),
      }}
    >
      {layout.showPhoto && (
        <div className="mb-4 flex justify-center">
          <PhotoCircle
            personalDetails={sidebarData.personalDetails}
            size="h-20 w-20"
            textSize="text-2xl"
          />
        </div>
      )}
      <SidebarHeader
        data={{
          personalDetails: sidebarData.personalDetails,
          contact: sidebarData.contact,
        } as ResumeData}
        template={template}
      />
      {sidebarSections.includes("contact") && (
        <SidebarSection title="Contact" template={template}>
          <SidebarContact contact={sidebarData.contact} template={template} />
        </SidebarSection>
      )}
      {sidebarSections.includes("skills") && sidebarData.skills.length > 0 && (
        <SidebarSection title="Skills" template={template}>
          <SidebarSkills skills={sidebarData.skills} template={template} />
        </SidebarSection>
      )}
      {sidebarSections.includes("education") &&
        sidebarData.education.length > 0 && (
          <SidebarSection title="Education" template={template}>
            <SidebarEducation
              education={sidebarData.education}
              template={template}
            />
          </SidebarSection>
        )}
    </div>
  );
}

/**
 * Fine-grained education degree line component.
 */
function EducationDegreeLine({
  degreeText,
  template,
  isFirst,
}: {
  degreeText: string;
  template: TemplateConfig;
  isFirst: boolean;
}) {
  const { typography, spacing, colors } = template;
  return (
    <div className={!isFirst ? spacing.itemGap : ""}>
      <p
        className={`font-semibold ${typography.bodyFontSize}`}
        style={{ color: colors.heading, lineHeight: "1.2" }}
      >
        {degreeText}
      </p>
    </div>
  );
}

/**
 * Fine-grained education school line component.
 */
function EducationSchoolLine({
  school,
  location,
  startDate,
  endDate,
  current,
  template,
}: {
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  template: TemplateConfig;
}) {
  const { typography, colors, layout } = template;
  const datePosition = layout.datePosition || "right";

  const formatDateRange = (
    start?: string,
    end?: string,
    isCurrent?: boolean
  ): string => {
    if (!start && !end) return "";
    const startStr = start || "";
    const endStr = isCurrent ? "Present" : end || "";
    if (startStr && endStr) return `${startStr} - ${endStr}`;
    return startStr || endStr;
  };

  const dateStr = formatDateRange(startDate, endDate, current);
  const schoolWithLocation = [school, location].filter(Boolean).join(", ");

  if (datePosition === "below") {
    return (
      <div>
        <p
          className={typography.bodyFontSize}
          style={{ color: colors.muted, lineHeight: "1.2" }}
        >
          {schoolWithLocation}
        </p>
        {dateStr && (
          <p className="text-[9pt] mt-0.5" style={{ color: colors.muted }}>
            {dateStr}
          </p>
        )}
      </div>
    );
  }

  // Default: right-aligned dates
  return (
    <div className="flex justify-between items-baseline gap-2">
      <p
        className={`${typography.bodyFontSize} flex-1 min-w-0`}
        style={{ color: colors.muted, lineHeight: "1.2" }}
      >
        {schoolWithLocation}
      </p>
      {dateStr && (
        <p
          className="text-[9pt] shrink-0 whitespace-nowrap"
          style={{ color: colors.muted }}
        >
          {dateStr}
        </p>
      )}
    </div>
  );
}

/**
 * Parse sidebar width from Tailwind class or pixel value.
 */
export function parseSidebarWidth(width?: string): number {
  if (!width) return 180;
  const match = width.match(/\d+/);
  return match ? parseInt(match[0], 10) : 180;
}
