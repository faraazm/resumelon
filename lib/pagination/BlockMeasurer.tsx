"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Block } from "./types";
import { TemplateConfig, getFontFamily } from "@/lib/templates/types";
import {
  Header,
  SectionHeader,
  Summary,
  ExperienceItem,
  EducationItem,
  SkillsDisplay,
  BulletList,
  SidebarHeader,
  SidebarSection,
  SidebarContact,
  SidebarSkills,
  SidebarEducation,
} from "@/lib/templates/components";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  TYPOGRAPHY,
  SIDEBAR_CONTENT_PADDING_PX,
} from "@/lib/pdf-constants";

interface BlockMeasurerProps {
  blocks: Block[];
  template: TemplateConfig;
  headingFontId: string;
  bodyFontId: string;
  marginPx: number;
  backgroundColor?: string;
  onMeasured: (blocks: Block[]) => void;
}

/**
 * Renders each block offscreen at full scale to measure its height.
 * Once all blocks are measured and fonts are ready, calls onMeasured.
 */
export function BlockMeasurer({
  blocks,
  template,
  headingFontId,
  bodyFontId,
  marginPx,
  backgroundColor,
  onMeasured,
}: BlockMeasurerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const blocksKey = blocks.map((b) => b.id).join(",");

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const children = container.children;

    const measured = blocks.map((block, i) => {
      const el = children[i] as HTMLElement;
      if (!el) return { ...block, measuredHeight: 0 };
      return { ...block, measuredHeight: el.offsetHeight };
    });

    onMeasured(measured);
    setHasMeasured(true);
  }, [blocks, onMeasured]);

  // Measure after fonts are ready
  useEffect(() => {
    setHasMeasured(false);

    // Wait for fonts then measure
    const doMeasure = () => {
      // Use requestAnimationFrame to ensure layout is complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          measure();
        });
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(doMeasure);
    } else {
      // Fallback
      setTimeout(doMeasure, 100);
    }
  }, [blocksKey, measure]);

  // Font styles
  const headingFontFamily = getFontFamily(headingFontId);
  const bodyFontFamily = getFontFamily(bodyFontId);
  const fontStyle: React.CSSProperties = {
    ["--heading-font" as string]: headingFontFamily,
    ["--body-font" as string]: bodyFontFamily,
    fontFamily: bodyFontFamily,
  };

  // Determine measurement container width
  const isSidebar = template.layout.sidebar;
  const sidebarWidthPx = isSidebar ? parseSidebarWidth(template.layout.sidebarWidth) : 0;
  const mainContentPadding = isSidebar ? SIDEBAR_CONTENT_PADDING_PX * 2 : 0;
  const contentWidth = isSidebar
    ? LETTER_WIDTH_PX - sidebarWidthPx - mainContentPadding
    : LETTER_WIDTH_PX;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        visibility: "hidden",
        width: contentWidth,
        overflow: "hidden",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        backgroundColor: backgroundColor || "#ffffff",
        fontSize: TYPOGRAPHY.body,
        lineHeight: String(TYPOGRAPHY.lineHeight),
        ...fontStyle,
      }}
    >
      {blocks.map((block) => (
        <div key={block.id} data-block-id={block.id} className={template.spacing.lineHeight}>
          <BlockContent block={block} template={template} />
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the content for a single block, using the same components
 * as the final display.
 */
function BlockContent({
  block,
  template,
}: {
  block: Block;
  template: TemplateConfig;
}) {
  const { spacing, layout } = template;
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case "header": {
      const resumeData = {
        personalDetails: data.personalDetails,
        contact: data.contact,
      } as { personalDetails: { firstName: string; lastName: string; jobTitle: string; photo?: string | null; photoUrl?: string | null; nationality?: string; driverLicense?: string; birthDate?: string }; contact: { email: string; phone: string; linkedin: string; location: string } };

      // Wrap with photo if needed (matching TemplateRenderer logic)
      if (layout.showPhoto && layout.headerAlignment === "center") {
        return (
          <div className={spacing.pagePadding} style={{ paddingBottom: 0 }}>
            <div className="flex justify-center mb-2">
              <PhotoCircle
                personalDetails={resumeData.personalDetails}
                size="h-16 w-16"
              />
            </div>
            <Header data={resumeData as any} template={template} />
          </div>
        );
      }
      if (layout.showPhoto) {
        return (
          <div className={spacing.pagePadding} style={{ paddingBottom: 0 }}>
            <div className="flex items-start justify-between gap-3">
              <Header data={resumeData as any} template={template} />
              <PhotoCircle
                personalDetails={resumeData.personalDetails}
                size="h-14 w-14"
              />
            </div>
          </div>
        );
      }
      return (
        <div className={spacing.pagePadding} style={{ paddingBottom: 0 }}>
          <Header data={resumeData as any} template={template} />
        </div>
      );
    }

    case "section-header": {
      const title = (data as { title: string }).title;
      const sectionTopGap = spacing.sectionGap === "mb-2" ? "mt-2" : spacing.sectionGap === "mb-4" ? "mt-4" : "mt-3";
      return (
        <div className={`${spacing.pagePadding} ${sectionTopGap}`} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <SectionHeader title={title} template={template} />
        </div>
      );
    }

    case "summary": {
      const summary = (data as { summary: string }).summary;
      return (
        <div className={spacing.pagePadding} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Summary summary={summary} template={template} />
        </div>
      );
    }

    case "experience-meta": {
      const job = (data as { job: any }).job;
      return (
        <div className={spacing.pagePadding} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <ExperienceMetaOnly
            job={job}
            template={template}
            isFirst={block.isFirst ?? false}
          />
        </div>
      );
    }

    case "bullet": {
      const text = (data as { text: string }).text;
      return (
        <div className={spacing.pagePadding} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <BulletList bullets={[text]} template={template} />
        </div>
      );
    }

    case "education-item": {
      const edu = (data as { edu: any }).edu;
      return (
        <div className={spacing.pagePadding} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <EducationItem edu={edu} template={template} isFirst={block.isFirst ?? false} />
        </div>
      );
    }

    case "skills": {
      const skills = (data as { skills: string[] }).skills;
      return (
        <div className={spacing.pagePadding} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <SkillsDisplay skills={skills} template={template} />
        </div>
      );
    }

    case "sidebar": {
      // Sidebar is measured for informational purposes but rendered specially
      // by PageRenderer. We still need to measure it to know its height.
      const sidebarData = data as {
        personalDetails: any;
        contact: any;
        skills: string[];
        education: any[];
      };
      const sidebarSections = template.sections.sidebarSections || ["contact", "skills", "education"];

      return (
        <div
          className={`${template.layout.sidebarWidth || "w-[180px]"} p-5 ${spacing.lineHeight}`}
          style={{
            backgroundColor: template.colors.sidebar,
            width: parseSidebarWidth(template.layout.sidebarWidth),
            minHeight: LETTER_HEIGHT_PX,
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
            data={{ personalDetails: sidebarData.personalDetails, contact: sidebarData.contact } as any}
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
          {sidebarSections.includes("education") && sidebarData.education.length > 0 && (
            <SidebarSection title="Education" template={template}>
              <SidebarEducation education={sidebarData.education} template={template} />
            </SidebarSection>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

/**
 * Renders just the meta row (title, company, date) of an experience item
 * without its bullets.
 */
function ExperienceMetaOnly({
  job,
  template,
  isFirst,
}: {
  job: { title: string; company: string; location: string; startDate: string; endDate: string; current: boolean };
  template: TemplateConfig;
  isFirst: boolean;
}) {
  const { typography, spacing, colors, layout } = template;
  const datePosition = layout.datePosition || "right";

  const formatDateRange = (start?: string, end?: string, current?: boolean): string => {
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
        <p className={`font-semibold ${typography.bodyFontSize}`} style={{ color: colors.heading, lineHeight: "1.2" }}>
          {job.title}
        </p>
        <p className={typography.bodyFontSize} style={{ color: colors.muted, lineHeight: "1.2" }}>
          {job.company}{job.location && ` · ${job.location}`}
        </p>
        {dateStr && (
          <p className="text-[9pt] mt-0.5" style={{ color: colors.muted }}>{dateStr}</p>
        )}
      </div>
    );
  }

  if (datePosition === "left") {
    return (
      <div className={`${!isFirst ? spacing.itemGap : ""} flex gap-3`}>
        <div className="w-[130px] shrink-0 text-right">
          <p className="text-[9pt]" style={{ color: colors.muted }}>{dateStr}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${typography.bodyFontSize}`} style={{ color: colors.heading, lineHeight: "1.2" }}>
            {job.title}
          </p>
          <p className={typography.bodyFontSize} style={{ color: colors.muted, lineHeight: "1.2" }}>
            {job.company}{job.location && ` · ${job.location}`}
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
          <p className={`font-semibold ${typography.bodyFontSize}`} style={{ color: colors.heading, lineHeight: "1.2" }}>
            {job.title}
          </p>
          <p className={typography.bodyFontSize} style={{ color: colors.muted, lineHeight: "1.2" }}>
            {job.company}{job.location && ` · ${job.location}`}
          </p>
        </div>
        <p className="text-[9pt] shrink-0 whitespace-nowrap" style={{ color: colors.muted }}>
          {dateStr}
        </p>
      </div>
    </div>
  );
}

function PhotoCircle({
  personalDetails,
  size,
  textSize,
}: {
  personalDetails: { firstName?: string; lastName?: string; photoUrl?: string | null };
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

function parseSidebarWidth(width?: string): number {
  if (!width) return 180;
  const match = width.match(/\d+/);
  return match ? parseInt(match[0], 10) : 180;
}
