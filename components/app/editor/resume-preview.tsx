"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TemplateRenderer, getTemplate, ResumeData, TemplateConfig } from "@/lib/templates";

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

// A4 dimensions at 72 DPI
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const ASPECT_RATIO = A4_WIDTH / A4_HEIGHT;

export function ResumePreview({ data, sectionOrder }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Get the template configuration
  const template = getTemplate(data.template || "professional");

  // Map section IDs from WriteTab to template section IDs
  const mapSectionOrder = (order: string[]): ("summary" | "experience" | "education" | "skills")[] => {
    const validSections = ["summary", "experience", "education", "skills"];
    return order.filter((s) => validSections.includes(s)) as ("summary" | "experience" | "education" | "skills")[];
  };

  // Map font IDs to font types
  const getFontType = (fontId: string): "serif" | "sans" => {
    const serifFonts = ["georgia", "merriweather", "playfair", "lora"];
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

  // Apply spacing and typography overrides from user style and custom section order
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
      sectionGap:
        data.style?.spacing === "compact"
          ? "mb-2"
          : data.style?.spacing === "spacious"
          ? "mb-6"
          : "mb-4",
      itemGap:
        data.style?.spacing === "compact"
          ? "mt-1.5"
          : data.style?.spacing === "spacious"
          ? "mt-4"
          : "mt-3",
      pagePadding:
        data.style?.spacing === "compact"
          ? "p-5"
          : data.style?.spacing === "spacious"
          ? "p-10"
          : template.spacing.pagePadding,
      lineHeight:
        data.style?.spacing === "compact"
          ? "leading-tight"
          : data.style?.spacing === "spacious"
          ? "leading-relaxed"
          : template.spacing.lineHeight,
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

    // Calculate the maximum size that fits while maintaining A4 aspect ratio
    let newWidth = containerWidth;
    let newHeight = newWidth / ASPECT_RATIO;

    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = newHeight * ASPECT_RATIO;
    }

    // Scale relative to A4 dimensions
    const newScale = newWidth / A4_WIDTH;
    setScale(newScale);
  }, []);

  // Calculate total pages based on content height
  const calculatePages = useCallback(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    const pageContentHeight = A4_HEIGHT - 96; // Account for padding (48px top + 48px bottom)
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

  const pageContentHeight = A4_HEIGHT - 96;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full min-h-[500px] w-full items-center justify-center overflow-hidden"
    >
      {/* Paper container */}
      <div
        className="relative bg-white shadow-lg overflow-hidden"
        style={{
          width: A4_WIDTH * scale,
          height: A4_HEIGHT * scale,
          transform: `scale(1)`,
          transformOrigin: "top center",
        }}
      >
        {/* Content wrapper - scaled to fit */}
        <div
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
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
            }}
          >
            <TemplateRenderer
              data={resumeData}
              template={adjustedTemplate}
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
}
