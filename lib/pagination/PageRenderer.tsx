"use client";

import { PageLayout } from "./types";
import { TemplateConfig, ResumeData, getFontFamily } from "@/lib/templates/types";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  TYPOGRAPHY,
  SIDEBAR_CONTENT_PADDING_PX,
} from "@/lib/pdf-constants";
import {
  BlockListRenderer,
  PhotoCircle,
} from "./BlockRenderer";
import {
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
 *
 * Uses the unified BlockRenderer/BlockListRenderer to ensure
 * pixel-perfect consistency with measurement.
 */
export function PageRenderer({
  page,
  template,
  data: _data,
  marginPx: _marginPx,
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
    const sidebarSections =
      template.sections.sidebarSections || ["contact", "skills", "education"];

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
          boxSizing: "border-box",
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
              data={{
                personalDetails: sidebarData.personalDetails,
                contact: sidebarData.contact,
              } as ResumeData}
              template={template}
            />
            {sidebarSections.includes("contact") && (
              <SidebarSection title="Contact" template={template}>
                <SidebarContact
                  contact={sidebarData.contact}
                  template={template}
                />
              </SidebarSection>
            )}
            {sidebarSections.includes("skills") &&
              sidebarData.skills.length > 0 && (
                <SidebarSection title="Skills" template={template}>
                  <SidebarSkills
                    skills={sidebarData.skills}
                    template={template}
                  />
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

          {/* Main content - each block has its own lineHeight wrapper */}
          <div
            className="flex-1"
            style={{ padding: SIDEBAR_CONTENT_PADDING_PX }}
          >
            <BlockListRenderer blocks={nonSidebarBlocks} template={template} />
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
        boxSizing: "border-box",
        ...fontStyle,
      }}
    >
      <div
        className={isSidebar ? "" : spacing.pagePadding}
        style={{
          height: "100%",
          boxSizing: "border-box",
          ...(isSidebar ? { padding: SIDEBAR_CONTENT_PADDING_PX } : {}),
        }}
      >
        {/* Each block in BlockListRenderer has its own lineHeight wrapper */}
        <BlockListRenderer blocks={page.blocks} template={template} />
      </div>
    </div>
  );
}
