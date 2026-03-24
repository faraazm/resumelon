"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getTemplate, ResumeData, TemplateConfig, getTemplateDefaultHeadingFont, getTemplateDefaultBodyFont } from "@/lib/templates";
import { EmptyState } from "@/lib/templates/components";
import { usePagination, PageRenderer } from "@/lib/pagination";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_ASPECT_RATIO,
  DEFAULT_MARGIN_PX,
  COMPACT_MARGIN_PX,
  SPACIOUS_MARGIN_PX,
  SIDEBAR_CONTENT_PADDING_PX,
} from "@/lib/pdf-constants";

interface ResumePreviewProps {
  data: {
    personalDetails: {
      firstName: string;
      lastName: string;
      jobTitle: string;
      photo: string | null;
      nationality?: string;
      driverLicense?: string;
      birthDate?: string;
    };
    contact: {
      email: string;
      phone: string;
      linkedin: string;
      location: string;
    };
    summary: string;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      bullets: string[];
    }>;
    education: Array<{
      id: string;
      degree: string;
      school: string;
      startDate: string;
      endDate: string;
    }>;
    skills: string[];
    template: string;
    style?: {
      font?: string;
      headingFont?: string;
      bodyFont?: string;
      spacing?: string;
      accentColor?: string;
      backgroundColor?: string;
      showPhoto?: boolean;
      showDividers?: boolean;
    };
  };
  sectionOrder?: string[];
}

export interface ResumePreviewHandle {
  getContentElement: () => HTMLDivElement | null;
  getTotalPages: () => number;
  getPageHeight: () => number;
}

export const ResumePreview = forwardRef<ResumePreviewHandle, ResumePreviewProps>(
  function ResumePreview({ data, sectionOrder }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);


  // Fetch photo URL from Convex storage if photo exists
  const photoUrl = useQuery(
    api.storage.getUrl,
    data.personalDetails?.photo
      ? { storageId: data.personalDetails.photo as Id<"_storage"> }
      : "skip"
  );

  // Get the template configuration
  const template = getTemplate(data.template || "professional");

  // Map section IDs from WriteTab to template section IDs
  const mapSectionOrder = (order: string[]): ("summary" | "experience" | "education" | "skills")[] => {
    const validSections = ["summary", "experience", "education", "skills"];
    return order.filter((s) => validSections.includes(s)) as ("summary" | "experience" | "education" | "skills")[];
  };

  // Determine if we should show photo and dividers
  const showPhoto = data.style?.showPhoto !== undefined
    ? data.style.showPhoto
    : template.layout.showPhoto;

  const showDividers = data.style?.showDividers !== undefined
    ? data.style.showDividers
    : template.layout.sectionDivider !== "none";

  const sectionDivider = showDividers
    ? (template.layout.sectionDivider === "none" ? "line" : template.layout.sectionDivider)
    : "none";

  const accentColor = data.style?.accentColor || template.colors.accent;
  const backgroundColor = data.style?.backgroundColor || "#ffffff";

  const templateId = data.template || "professional";
  const headingFontId = data.style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId = data.style?.bodyFont || getTemplateDefaultBodyFont(templateId);

  // Apply spacing and typography overrides
  const adjustedTemplate: TemplateConfig = {
    ...template,
    typography: {
      ...template.typography,
    },
    spacing: {
      ...template.spacing,
      sectionGap:
        data.style?.spacing === "compact"
          ? "mb-2"
          : data.style?.spacing === "spacious"
            ? "mb-4"
            : "mb-3",
      itemGap:
        data.style?.spacing === "compact"
          ? "mt-1"
          : data.style?.spacing === "spacious"
            ? "mt-2.5"
            : "mt-2",
      pagePadding:
        data.style?.spacing === "compact"
          ? "p-[0.4in]"
          : data.style?.spacing === "spacious"
            ? "p-[0.6in]"
            : "p-[0.5in]",
      lineHeight:
        data.style?.spacing === "compact"
          ? "leading-tight"
          : data.style?.spacing === "spacious"
            ? "leading-snug"
            : "leading-snug",
    },
    layout: {
      ...template.layout,
      showPhoto,
      sectionDivider,
    },
    colors: {
      ...template.colors,
      accent: accentColor,
      divider: accentColor,
    },
    sections: sectionOrder
      ? {
          ...template.sections,
          order: mapSectionOrder(sectionOrder),
          visible: {
            summary: sectionOrder.includes("summary"),
            experience: sectionOrder.includes("experience"),
            education: sectionOrder.includes("education"),
            skills: sectionOrder.includes("skills"),
          },
        }
      : template.sections,
  };

  // Convert data to ResumeData type
  const resumeData: ResumeData = {
    personalDetails: {
      firstName: data.personalDetails?.firstName || "",
      lastName: data.personalDetails?.lastName || "",
      jobTitle: data.personalDetails?.jobTitle || "",
      photo: data.personalDetails?.photo,
      photoUrl: photoUrl || undefined,
      nationality: data.personalDetails?.nationality,
      driverLicense: data.personalDetails?.driverLicense,
      birthDate: data.personalDetails?.birthDate,
    },
    contact: {
      email: data.contact?.email || "",
      phone: data.contact?.phone || "",
      linkedin: data.contact?.linkedin || "",
      location: data.contact?.location || "",
    },
    summary: data.summary || "",
    experience: data.experience || [],
    education: data.education || [],
    skills: data.skills || [],
  };

  // Check if there's any content
  const fullName = [resumeData.personalDetails?.firstName, resumeData.personalDetails?.lastName]
    .filter(Boolean)
    .join(" ");
  const hasContent =
    fullName ||
    resumeData.personalDetails?.jobTitle ||
    resumeData.summary ||
    (resumeData.experience && resumeData.experience.length > 0) ||
    (resumeData.education && resumeData.education.length > 0) ||
    (resumeData.skills && resumeData.skills.length > 0);

  // Sidebar templates use their own internal padding (p-6 / inline padding: 24px)
  const isSidebarTemplate = adjustedTemplate.layout.sidebar;
  const marginPx = isSidebarTemplate
    ? SIDEBAR_CONTENT_PADDING_PX
    : data.style?.spacing === "compact"
      ? COMPACT_MARGIN_PX
      : data.style?.spacing === "spacious"
        ? SPACIOUS_MARGIN_PX
        : DEFAULT_MARGIN_PX;

  // Use the pagination engine
  const { pages, totalPages, isReady, measurerElement } = usePagination(
    resumeData,
    adjustedTemplate,
    {
      marginPx,
      headingFontId,
      bodyFontId,
      backgroundColor,
      sectionOrder: sectionOrder
        ? mapSectionOrder(sectionOrder)
        : undefined,
    }
  );

  // Expose methods to parent for PDF generation
  useImperativeHandle(ref, () => ({
    getContentElement: () => containerRef.current,
    getTotalPages: () => totalPages,
    getPageHeight: () => LETTER_HEIGHT_PX,
  }));

  // Keep currentPage in bounds when totalPages changes
  const clampedPage = totalPages > 0 && currentPage >= totalPages
    ? Math.max(0, totalPages - 1)
    : currentPage;

  useLayoutEffect(() => {
    if (clampedPage !== currentPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync derived state
      setCurrentPage(clampedPage);
    }
  }, [clampedPage, currentPage]);

  // Calculate scale to fit container
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    let newWidth = containerWidth;
    let newHeight = newWidth / LETTER_ASPECT_RATIO;

    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = newHeight * LETTER_ASPECT_RATIO;
    }

    const newScale = Math.max(0.1, newWidth / LETTER_WIDTH_PX);
    setScale(newScale);
  }, []);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement requires effect
    calculateScale();
  }, [calculateScale]);

  useEffect(() => {
    const handleResize = () => calculateScale();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => calculateScale());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [calculateScale]);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-full min-h-[500px] w-full overflow-hidden">
      {/* Hidden measurement container */}
      {hasContent && measurerElement}

      {/* Paper area */}
      <div
        ref={containerRef}
        className="relative h-full flex items-center justify-center w-full"
      >
        <div
          className="relative bg-white shadow-lg"
          style={{
            width: LETTER_WIDTH_PX * scale,
            height: LETTER_HEIGHT_PX * scale,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: LETTER_WIDTH_PX,
              height: LETTER_HEIGHT_PX,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {!hasContent ? (
              <EmptyState />
            ) : isReady && pages[currentPage] ? (
              <PageRenderer
                page={pages[currentPage]}
                template={adjustedTemplate}
                data={resumeData}
                marginPx={marginPx}
                backgroundColor={backgroundColor}
                headingFontId={headingFontId}
                bodyFontId={bodyFontId}
              />
            ) : (
              // Show blank page while measuring
              <div
                style={{
                  width: LETTER_WIDTH_PX,
                  height: LETTER_HEIGHT_PX,
                  backgroundColor,
                }}
              />
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 py-2 flex items-center justify-center gap-3 bg-gradient-to-t from-white/90 to-transparent">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[70px] text-center bg-white/80 backdrop-blur-sm rounded px-2 py-0.5">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm"
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
