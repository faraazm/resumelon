"use client";

import { Block, PageLayout } from "./types";
import { TemplateConfig, ResumeData, getFontFamily } from "@/lib/templates/types";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  TYPOGRAPHY,
  SIDEBAR_CONTENT_PADDING_PX,
} from "@/lib/pdf-constants";
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

interface PageRendererProps {
  page: PageLayout;
  template: TemplateConfig;
  data: ResumeData;
  marginPx: number;
  backgroundColor: string;
  headingFontId: string;
  bodyFontId: string;
}

/**
 * Renders a single page as a fixed-size div with exact Letter dimensions.
 * Each page is self-contained — no overflow, no clipping.
 */
export function PageRenderer({
  page,
  template,
  data,
  marginPx,
  backgroundColor,
  headingFontId,
  bodyFontId,
}: PageRendererProps) {
  const { spacing, layout, colors } = template;
  const isSidebar = layout.sidebar;
  const hasSidebarBlock = page.blocks.some((b) => b.type === "sidebar");
  const nonSidebarBlocks = page.blocks.filter((b) => b.type !== "sidebar");

  const headingFontFamily = getFontFamily(headingFontId);
  const bodyFontFamily = getFontFamily(bodyFontId);
  const fontStyle: React.CSSProperties = {
    ["--heading-font" as string]: headingFontFamily,
    ["--body-font" as string]: bodyFontFamily,
    fontFamily: bodyFontFamily,
  };

  // Sidebar layout: page 0 has the sidebar block, subsequent pages don't
  if (isSidebar && hasSidebarBlock) {
    const sidebarBlock = page.blocks.find((b) => b.type === "sidebar")!;
    const sidebarData = sidebarBlock.data as {
      personalDetails: ResumeData["personalDetails"];
      contact: ResumeData["contact"];
      skills: string[];
      education: ResumeData["education"];
    };
    const sidebarSections = template.sections.sidebarSections || ["contact", "skills", "education"];

    return (
      <div
        style={{
          width: LETTER_WIDTH_PX,
          height: LETTER_HEIGHT_PX,
          backgroundColor,
          position: "relative",
          overflow: "hidden",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          fontSize: TYPOGRAPHY.body,
          lineHeight: String(TYPOGRAPHY.lineHeight),
          ...fontStyle,
        }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={`${layout.sidebarWidth || "w-[180px]"} shrink-0 p-5 ${spacing.lineHeight}`}
            style={{ backgroundColor: colors.sidebar }}
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

          {/* Main content */}
          <div
            className={`flex-1 ${spacing.lineHeight}`}
            style={{ padding: SIDEBAR_CONTENT_PADDING_PX }}
          >
            {renderBlockList(nonSidebarBlocks, template)}
          </div>
        </div>
      </div>
    );
  }

  // Standard layout (or sidebar pages 2+)
  return (
    <div
      style={{
        width: LETTER_WIDTH_PX,
        height: LETTER_HEIGHT_PX,
        backgroundColor,
        position: "relative",
        overflow: "hidden",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        fontSize: TYPOGRAPHY.body,
        lineHeight: String(TYPOGRAPHY.lineHeight),
        ...fontStyle,
      }}
    >
      <div
        className={isSidebar ? "" : spacing.pagePadding}
        style={{
          height: "100%",
          ...(isSidebar ? { padding: SIDEBAR_CONTENT_PADDING_PX } : {}),
        }}
      >
        <div className={spacing.lineHeight}>
          {renderBlockList(page.blocks, template)}
        </div>
      </div>
    </div>
  );
}

/**
 * Render a list of blocks, grouping consecutive bullets by jobId into <ul> elements.
 */
function renderBlockList(blocks: Block[], template: TemplateConfig) {
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
        segments.push({ type: "bullet-group", jobId: block.jobId, bullets: [block] });
      }
    } else {
      segments.push({ type: "single", block });
    }
  }

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === "bullet-group") {
          const bulletTexts = segment.bullets.map(
            (b) => (b.data as { text: string }).text
          );
          return (
            <BulletList
              key={`bullets-${segment.jobId}-${i}`}
              bullets={bulletTexts}
              template={template}
            />
          );
        }

        const block = segment.block;
        return <SingleBlockRenderer key={block.id} block={block} template={template} />;
      })}
    </>
  );
}

function SingleBlockRenderer({
  block,
  template,
}: {
  block: Block;
  template: TemplateConfig;
}) {
  const { spacing, layout, colors } = template;
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case "header": {
      const resumeData = {
        personalDetails: data.personalDetails,
        contact: data.contact,
      } as any;

      if (layout.showPhoto && layout.headerAlignment === "center") {
        return (
          <div>
            <div className="flex justify-center mb-2">
              <PhotoCircle
                personalDetails={resumeData.personalDetails}
                size="h-16 w-16"
              />
            </div>
            <Header data={resumeData} template={template} />
          </div>
        );
      }
      if (layout.showPhoto) {
        return (
          <div className="flex items-start justify-between gap-3">
            <Header data={resumeData} template={template} />
            <PhotoCircle
              personalDetails={resumeData.personalDetails}
              size="h-14 w-14"
            />
          </div>
        );
      }
      return <Header data={resumeData} template={template} />;
    }

    case "section-header": {
      const title = (data as { title: string }).title;
      const sectionTopGap = spacing.sectionGap === "mb-2" ? "mt-2" : spacing.sectionGap === "mb-4" ? "mt-4" : "mt-3";
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
      const job = (data as { job: any }).job;
      return (
        <ExperienceMetaOnly
          job={job}
          template={template}
          isFirst={block.isFirst ?? false}
        />
      );
    }

    case "education-item": {
      const edu = (data as { edu: any }).edu;
      return <EducationItem edu={edu} template={template} isFirst={block.isFirst ?? false} />;
    }

    case "skills": {
      const skills = (data as { skills: string[] }).skills;
      return <SkillsDisplay skills={skills} template={template} />;
    }

    default:
      return null;
  }
}

/**
 * Experience meta row without bullets (same rendering as ExperienceItem but no <BulletList>)
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
