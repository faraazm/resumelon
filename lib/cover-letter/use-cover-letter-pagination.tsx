"use client";

import { useState, useEffect, useRef, useCallback, ReactNode, createElement } from "react";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX, PAGE_BOTTOM_SAFETY_PX } from "@/lib/pdf-constants";
import { TemplateConfig, getFontFamily } from "@/lib/templates/types";
import { CoverLetterData, CoverLetterRenderer } from "./CoverLetterRenderer";

interface PageSlice {
  startY: number;
  height: number;
}

interface UseCoverLetterPaginationOptions {
  marginPx: number;
  headingFontId: string;
  bodyFontId: string;
  backgroundColor?: string;
}

interface UseCoverLetterPaginationResult {
  pages: PageSlice[];
  totalPages: number;
  isReady: boolean;
  measurerElement: ReactNode;
}

/**
 * Measures the rendered cover letter and slices it into pages.
 * Uses a simple height-based approach since cover letters are continuous content.
 */
export function useCoverLetterPagination(
  data: CoverLetterData,
  template: TemplateConfig,
  options: UseCoverLetterPaginationOptions
): UseCoverLetterPaginationResult {
  const { marginPx, headingFontId, bodyFontId } = options;
  const pageContentHeight = LETTER_HEIGHT_PX - marginPx * 2 - PAGE_BOTTOM_SAFETY_PX;
  const [pages, setPages] = useState<PageSlice[]>([{ startY: 0, height: pageContentHeight }]);
  const [isReady, setIsReady] = useState(false);
  const measurerRef = useRef<HTMLDivElement>(null);
  const dataKey = JSON.stringify({ data, template: template.id, headingFontId, bodyFontId, marginPx });

  useEffect(() => {
    setIsReady(false);

    const measure = () => {
      const el = measurerRef.current;
      if (!el) return;

      const totalHeight = el.scrollHeight;

      if (totalHeight <= pageContentHeight) {
        setPages([{ startY: 0, height: pageContentHeight }]);
      } else {
        const result: PageSlice[] = [];
        let y = 0;
        while (y < totalHeight) {
          result.push({ startY: y, height: pageContentHeight });
          y += pageContentHeight;
        }
        setPages(result);
      }
      setIsReady(true);
    };

    // Allow fonts to load and layout to settle
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
  }, [dataKey, pageContentHeight]);

  const measurerElement = createElement(
    "div",
    {
      style: {
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: `${LETTER_WIDTH_PX}px`,
        visibility: "hidden" as const,
        pointerEvents: "none" as const,
      },
    },
    createElement(
      "div",
      { ref: measurerRef },
      createElement(CoverLetterRenderer, {
        data,
        template,
        headingFontId,
        bodyFontId,
      })
    )
  );

  return { pages, totalPages: pages.length, isReady, measurerElement };
}

/**
 * Renders a single page of a cover letter by clipping the full render.
 */
export function CoverLetterPageRenderer({
  page,
  data,
  template,
  marginPx,
  backgroundColor,
  headingFontId,
  bodyFontId,
}: {
  page: PageSlice;
  data: CoverLetterData;
  template: TemplateConfig;
  marginPx: number;
  backgroundColor: string;
  headingFontId: string;
  bodyFontId: string;
}) {
  return (
    <div
      style={{
        width: `${LETTER_WIDTH_PX}px`,
        height: `${LETTER_HEIGHT_PX}px`,
        backgroundColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${marginPx - page.startY}px`,
          left: 0,
          right: 0,
          width: `${LETTER_WIDTH_PX}px`,
        }}
      >
        <CoverLetterRenderer
          data={data}
          template={template}
          headingFontId={headingFontId}
          bodyFontId={bodyFontId}
        />
      </div>
    </div>
  );
}
