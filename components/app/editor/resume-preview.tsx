"use client";

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TemplateRenderer, getTemplate, ResumeData, TemplateConfig, getTemplateDefaultHeadingFont, getTemplateDefaultBodyFont } from "@/lib/templates";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_ASPECT_RATIO,
  DEFAULT_VERTICAL_PADDING_PX,
  TYPOGRAPHY,
} from "@/lib/pdf-constants";

interface ResumePreviewProps {
  data: {
    personalDetails: {
      firstName: string;
      lastName: string;
      jobTitle: string;
      photo: string | null;
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
    style: {
      font: string;
      headingFont?: string;
      bodyFont?: string;
      spacing: string;
      accentColor: string;
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

// Use shared constants for consistency with PDF generation

export const ResumePreview = forwardRef<ResumePreviewHandle, ResumePreviewProps>(
  function ResumePreview({ data, sectionOrder }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Expose methods to parent for PDF generation
  useImperativeHandle(ref, () => ({
    getContentElement: () => contentRef.current,
    getTotalPages: () => totalPages,
    getPageHeight: () => LETTER_HEIGHT_PX,
  }));

  // Get the template configuration
  const template = getTemplate(data.template || "professional");

  // Map section IDs from WriteTab to template section IDs
  const mapSectionOrder = (order: string[]): ("summary" | "experience" | "education" | "skills")[] => {
    const validSections = ["summary", "experience", "education", "skills"];
    return order.filter((s) => validSections.includes(s)) as ("summary" | "experience" | "education" | "skills")[];
  };

  // Map font IDs to font types
  const getFontType = (fontId: string): "serif" | "sans" => {
    const serifFonts = ["merriweather", "playfair", "lora"];
    return serifFonts.includes(fontId) ? "serif" : "sans";
  };

  // Determine if we should show photo and dividers based on user override or template default
  const showPhoto = data.style?.showPhoto !== undefined
    ? data.style.showPhoto
    : template.layout.showPhoto;

  const showDividers = data.style?.showDividers !== undefined
    ? data.style.showDividers
    : template.layout.sectionDivider !== "none";

  // Determine section divider style based on override
  const sectionDivider = showDividers
    ? (template.layout.sectionDivider === "none" ? "line" : template.layout.sectionDivider)
    : "none";

  // Get accent color from user style or fallback to template
  const accentColor = data.style?.accentColor || template.colors.accent;

  // Get actual font IDs for rendering (not just serif/sans type)
  const templateId = data.template || "professional";
  const headingFontId = data.style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId = data.style?.bodyFont || getTemplateDefaultBodyFont(templateId);

  // Apply spacing and typography overrides from user style and custom section order
  // IMPORTANT: These values MUST match the print page (app/print/[id]/page.tsx) exactly
  const adjustedTemplate: TemplateConfig = {
    ...template,
    typography: {
      ...template.typography,
      // Apply user font choices if set
      headingFont: data.style?.headingFont
        ? getFontType(data.style.headingFont)
        : data.style?.font
          ? getFontType(data.style.font)
          : template.typography.headingFont,
      bodyFont: data.style?.bodyFont
        ? getFontType(data.style.bodyFont)
        : data.style?.font
          ? getFontType(data.style.font)
          : template.typography.bodyFont,
    },
    spacing: {
      ...template.spacing,
      // Tighter spacing optimized for print - matches print page exactly
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
      // Keep heading black for main name, accent color is used by section headers
    },
    // Apply custom section order if provided
    sections: sectionOrder
      ? {
          ...template.sections,
          order: mapSectionOrder(sectionOrder),
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

  // Calculate scale to fit container while maintaining aspect ratio
  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Calculate the maximum size that fits while maintaining Letter aspect ratio
    let newWidth = containerWidth;
    let newHeight = newWidth / LETTER_ASPECT_RATIO;

    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = newHeight * LETTER_ASPECT_RATIO;
    }

    // Scale relative to Letter dimensions
    const newScale = newWidth / LETTER_WIDTH_PX;
    setScale(newScale);
  }, []);

  // Calculate total pages based on content height
  const calculatePages = useCallback(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    // The actual content area is the page height minus the vertical padding (margins)
    const pageContentHeight = LETTER_HEIGHT_PX - DEFAULT_VERTICAL_PADDING_PX;
    const pages = Math.max(1, Math.ceil(contentHeight / pageContentHeight));

    setTotalPages(pages);
    if (currentPage >= pages) {
      setCurrentPage(Math.max(0, pages - 1));
    }
  }, [currentPage]);

  // Recalculate on resize
  useEffect(() => {
    calculateScale();
    const handleResize = () => calculateScale();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateScale]);

  // Recalculate pages when data changes
  useEffect(() => {
    // Delay to allow content to render
    const timer = setTimeout(calculatePages, 100);
    return () => clearTimeout(timer);
  }, [data, calculatePages]);

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

  const pageContentHeight = LETTER_HEIGHT_PX - DEFAULT_VERTICAL_PADDING_PX;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full min-h-[500px] w-full items-center justify-center overflow-hidden"
    >
      {/* Paper container */}
      <div
        className="relative bg-white shadow-lg overflow-hidden"
        style={{
          width: LETTER_WIDTH_PX * scale,
          height: LETTER_HEIGHT_PX * scale,
          transform: `scale(1)`,
          transformOrigin: "top center",
        }}
      >
        {/* Content wrapper - scaled to fit */}
        <div
          style={{
            width: LETTER_WIDTH_PX,
            height: LETTER_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          {/* Scrollable content for pagination */}
          <div
            ref={contentRef}
            className="bg-white"
            style={{
              transform: `translateY(-${currentPage * pageContentHeight}px)`,
              fontSize: TYPOGRAPHY.body,
              lineHeight: TYPOGRAPHY.lineHeight,
            }}
          >
            <TemplateRenderer
              data={resumeData}
              template={adjustedTemplate}
              headingFontId={headingFontId}
              bodyFontId={bodyFontId}
            />
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center gap-4 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="h-8 w-8 p-0"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-[80px] text-center">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});
