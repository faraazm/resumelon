"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getTemplate, TemplateConfig, getTemplateDefaultHeadingFont, getTemplateDefaultBodyFont } from "@/lib/templates";
import { CoverLetterData } from "@/lib/cover-letter/CoverLetterRenderer";
import { useCoverLetterPagination, CoverLetterPageRenderer } from "@/lib/cover-letter/use-cover-letter-pagination";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_ASPECT_RATIO,
  DEFAULT_MARGIN_PX,
  COMPACT_MARGIN_PX,
  SPACIOUS_MARGIN_PX,
} from "@/lib/pdf-constants";

interface CoverLetterPreviewProps {
  data: {
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
    template?: string;
    style?: {
      font?: string;
      headingFont?: string;
      bodyFont?: string;
      spacing?: string;
      accentColor?: string;
      backgroundColor?: string;
    };
  };
}

export function CoverLetterPreview({ data }: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const templateId = data.template || "ats-classic";
  const baseTemplate = getTemplate(templateId);
  const spacing = data.style?.spacing || "normal";

  const accentColor = data.style?.accentColor || baseTemplate.colors.accent;

  const adjustedTemplate: TemplateConfig = {
    ...baseTemplate,
    spacing: {
      ...baseTemplate.spacing,
      sectionGap: spacing === "compact" ? "mb-2" : spacing === "spacious" ? "mb-4" : "mb-3",
      itemGap: spacing === "compact" ? "mt-1" : spacing === "spacious" ? "mt-2.5" : "mt-2",
      pagePadding: spacing === "compact" ? "p-[0.4in]" : spacing === "spacious" ? "p-[0.6in]" : "p-[0.5in]",
      lineHeight: spacing === "compact" ? "leading-tight" : spacing === "spacious" ? "leading-snug" : "leading-snug",
    },
    colors: {
      ...baseTemplate.colors,
      accent: accentColor,
      divider: accentColor,
    },
  };

  const headingFontId = data.style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId = data.style?.bodyFont || getTemplateDefaultBodyFont(templateId);
  const backgroundColor = data.style?.backgroundColor || "#ffffff";

  const marginPx = spacing === "compact" ? COMPACT_MARGIN_PX : spacing === "spacious" ? SPACIOUS_MARGIN_PX : DEFAULT_MARGIN_PX;

  const coverLetterData: CoverLetterData = {
    personalDetails: data.personalDetails,
    letterContent: data.letterContent,
  };

  const { pages, totalPages, measurerElement } = useCoverLetterPagination(
    coverLetterData,
    adjustedTemplate,
    { marginPx, headingFontId, bodyFontId, backgroundColor }
  );

  // Calculate scale to fit container (matches ResumePreview exactly)
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

  // Clamp current page - use functional update to avoid lint warning
  const clampedPage = totalPages > 0 && currentPage >= totalPages
    ? Math.max(0, totalPages - 1)
    : currentPage;

  useLayoutEffect(() => {
    if (clampedPage !== currentPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync derived state
      setCurrentPage(clampedPage);
    }
  }, [clampedPage, currentPage]);

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

  const page = pages[currentPage] || pages[0];

  return (
    <div className="h-full min-h-[500px] w-full overflow-hidden">
      {/* Hidden measurement container */}
      {measurerElement}

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
            <CoverLetterPageRenderer
              page={page}
              data={coverLetterData}
              template={adjustedTemplate}
              marginPx={marginPx}
              backgroundColor={backgroundColor}
              headingFontId={headingFontId}
              bodyFontId={bodyFontId}
            />
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
}
