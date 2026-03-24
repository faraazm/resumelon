"use client";

import { useState, useEffect, useRef, ReactNode, createElement } from "react";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX, PAGE_BOTTOM_SAFETY_PX } from "@/lib/pdf-constants";
import { TemplateConfig } from "@/lib/templates/types";
import { CoverLetterData, CoverLetterRenderer } from "./CoverLetterRenderer";

interface PageSlice {
  startY: number;
  endY: number;
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
 * Uses block-aware pagination to avoid cutting content mid-paragraph or mid-line.
 */
export function useCoverLetterPagination(
  data: CoverLetterData,
  template: TemplateConfig,
  options: UseCoverLetterPaginationOptions
): UseCoverLetterPaginationResult {
  const { marginPx, headingFontId, bodyFontId } = options;
  const pageContentHeight = LETTER_HEIGHT_PX - marginPx * 2 - PAGE_BOTTOM_SAFETY_PX;
  const [pages, setPages] = useState<PageSlice[]>([{ startY: 0, endY: pageContentHeight, height: pageContentHeight }]);
  const [isReady, setIsReady] = useState(false);
  const measurerRef = useRef<HTMLDivElement>(null);
  const dataKey = JSON.stringify({ data, template: template.id, headingFontId, bodyFontId, marginPx });

  useEffect(() => {
    setIsReady(false);

    const measure = () => {
      const container = measurerRef.current;
      if (!container) return;

      const totalHeight = container.scrollHeight;

      if (totalHeight <= pageContentHeight) {
        // Content fits on one page
        setPages([{ startY: 0, endY: totalHeight, height: pageContentHeight }]);
        setIsReady(true);
        return;
      }

      // Find block-level breakpoints
      const breakpoints = findBreakpoints(container);

      if (breakpoints.length === 0) {
        // Fallback: no blocks found, use simple slicing with safety buffer
        const result: PageSlice[] = [];
        let y = 0;
        while (y < totalHeight) {
          const endY = Math.min(y + pageContentHeight, totalHeight);
          result.push({ startY: y, endY, height: pageContentHeight });
          y += pageContentHeight;
        }
        setPages(result);
        setIsReady(true);
        return;
      }

      // Paginate at block boundaries
      const result: PageSlice[] = [];
      let pageStart = 0;

      for (let i = 0; i < breakpoints.length; i++) {
        const blockEnd = breakpoints[i];

        // Check if this block would overflow the current page
        if (blockEnd - pageStart > pageContentHeight) {
          // Current page is full, need to create a new page

          // Find the last breakpoint that fits on the current page
          let lastFitIndex = i - 1;
          while (lastFitIndex >= 0 && breakpoints[lastFitIndex] - pageStart > pageContentHeight) {
            lastFitIndex--;
          }

          if (lastFitIndex >= 0 && breakpoints[lastFitIndex] > pageStart) {
            // We found a valid breakpoint that fits
            const pageEnd = breakpoints[lastFitIndex];
            result.push({ startY: pageStart, endY: pageEnd, height: pageContentHeight });
            pageStart = pageEnd;
          } else {
            // No valid breakpoint found - this block is too tall for a single page
            // Use the page content height as the break point
            const pageEnd = pageStart + pageContentHeight;
            result.push({ startY: pageStart, endY: pageEnd, height: pageContentHeight });
            pageStart = pageEnd;
            // Re-check this breakpoint in the next iteration
            i--;
          }
        }
      }

      // Add the final page
      if (pageStart < totalHeight) {
        const lastBreakpoint = breakpoints[breakpoints.length - 1];
        const pageEnd = Math.max(lastBreakpoint, pageStart);
        if (pageEnd > pageStart) {
          result.push({ startY: pageStart, endY: pageEnd, height: pageContentHeight });
        } else if (totalHeight > pageStart) {
          result.push({ startY: pageStart, endY: totalHeight, height: pageContentHeight });
        }
      }

      // Ensure we have at least one page
      if (result.length === 0) {
        result.push({ startY: 0, endY: totalHeight, height: pageContentHeight });
      }

      setPages(result);
      setIsReady(true);
    };

    // Wait for fonts to load and layout to settle
    const doMeasure = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(measure);
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(doMeasure);
    } else {
      setTimeout(doMeasure, 100);
    }
  }, [dataKey, pageContentHeight]);

  /* eslint-disable react-hooks/refs -- ref is passed to DOM element, not read during render */
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
  /* eslint-enable react-hooks/refs */

  return { pages, totalPages: pages.length, isReady, measurerElement };
}

/**
 * Find potential page break points at block-level element boundaries.
 * Returns an array of Y positions where breaks are safe.
 */
function findBreakpoints(container: HTMLElement): number[] {
  const breakpoints: number[] = [];
  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top;

  // Find the prose container (where the HTML content is)
  const proseContainer = container.querySelector(".prose");

  if (!proseContainer) {
    // Fallback: use direct children of the container
    walkElements(container, containerTop, breakpoints);
  } else {
    // First, add breakpoints for elements before the prose (header, date, etc.)
    for (const child of container.children) {
      if (child === proseContainer || child.contains(proseContainer)) {
        break;
      }
      const rect = child.getBoundingClientRect();
      const bottomY = rect.bottom - containerTop;
      if (bottomY > 0) {
        breakpoints.push(bottomY);
      }
    }

    // Then walk through the prose content
    walkElements(proseContainer as HTMLElement, containerTop, breakpoints);
  }

  // Sort and dedupe breakpoints
  const uniqueBreakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);

  return uniqueBreakpoints;
}

/**
 * Recursively walk elements to find block-level boundaries.
 */
function walkElements(element: Element, containerTop: number, breakpoints: number[]): void {
  const blockTags = new Set([
    "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6",
    "UL", "OL", "LI", "BLOCKQUOTE", "HR", "BR",
    "TABLE", "THEAD", "TBODY", "TR",
  ]);

  for (const child of element.children) {
    const tagName = child.tagName;

    if (blockTags.has(tagName)) {
      const rect = child.getBoundingClientRect();
      const bottomY = rect.bottom - containerTop;

      // Add the bottom of this block as a potential breakpoint
      if (bottomY > 0) {
        breakpoints.push(bottomY);
      }

      // For lists, also check list items
      if (tagName === "UL" || tagName === "OL") {
        walkElements(child, containerTop, breakpoints);
      }
    } else {
      // Recurse into non-block elements to find nested blocks
      walkElements(child, containerTop, breakpoints);
    }
  }
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
