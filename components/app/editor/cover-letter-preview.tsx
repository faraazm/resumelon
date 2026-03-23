"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getTemplate, TemplateConfig, getTemplateDefaultHeadingFont, getTemplateDefaultBodyFont } from "@/lib/templates";
import { CoverLetterData, CoverLetterRenderer } from "@/lib/cover-letter/CoverLetterRenderer";
import { useCoverLetterPagination, CoverLetterPageRenderer } from "@/lib/cover-letter/use-cover-letter-pagination";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
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
      font: string;
      headingFont?: string;
      bodyFont?: string;
      spacing: string;
      accentColor: string;
      backgroundColor?: string;
    };
  };
}

export function CoverLetterPreview({ data }: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
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

  // Scale to fit container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(Math.min(containerWidth / LETTER_WIDTH_PX, 1));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Clamp current page
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const page = pages[currentPage] || pages[0];

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4">
      {measurerElement}

      {/* Page */}
      <div
        className="bg-white shadow-lg rounded-sm overflow-hidden"
        style={{
          width: `${LETTER_WIDTH_PX * scale}px`,
          height: `${LETTER_HEIGHT_PX * scale}px`,
        }}
      >
        <div
          className="origin-top-left"
          style={{
            width: `${LETTER_WIDTH_PX}px`,
            height: `${LETTER_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
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
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
