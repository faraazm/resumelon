"use client";

import { useMemo, useState, useCallback, ReactNode } from "react";
import { createElement } from "react";
import { ResumeData, TemplateConfig } from "@/lib/templates/types";
import { LETTER_HEIGHT_PX, PAGE_BOTTOM_SAFETY_PX } from "@/lib/pdf-constants";
import { Block, PageLayout } from "./types";
import { decomposeBlocks } from "./decompose";
import { paginateBlocks, validatePagination } from "./paginate";
import { BlockMeasurer } from "./BlockMeasurer";

interface UsePaginationOptions {
  marginPx: number;
  headingFontId: string;
  bodyFontId: string;
  backgroundColor?: string;
  sectionOrder?: string[];
  /** Enable debug logging to console */
  debug?: boolean;
}

interface UsePaginationResult {
  pages: PageLayout[];
  totalPages: number;
  isReady: boolean;
  measurerElement: ReactNode;
}

/**
 * Hook that orchestrates the full pagination pipeline:
 * 1. Decompose data into atomic blocks
 * 2. Render blocks offscreen to measure heights (via BlockMeasurer)
 * 3. Bin-pack measured blocks into pages with conservative settings
 *
 * The hook ensures stable measurement by:
 * - Waiting for fonts to load
 * - Using triple requestAnimationFrame for layout stability
 * - Re-measuring when relevant props change (handled by BlockMeasurer)
 */
export function usePagination(
  data: ResumeData,
  template: TemplateConfig,
  options: UsePaginationOptions
): UsePaginationResult {
  const {
    marginPx,
    headingFontId,
    bodyFontId,
    backgroundColor,
    sectionOrder,
    debug = false,
  } = options;

  // Calculate available page content height
  // This is the Letter page height minus top/bottom margins and safety buffer
  const pageContentHeight = LETTER_HEIGHT_PX - marginPx * 2 - PAGE_BOTTOM_SAFETY_PX;

  // Memoize sectionOrder to prevent unnecessary re-renders
  const sectionOrderKey = sectionOrder?.join(",") ?? "";
  const stableSectionOrder = useMemo(
    () => sectionOrder,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectionOrderKey]
  );

  // Step 1: Decompose resume data into atomic blocks
  const blocks = useMemo(() => {
    const result = decomposeBlocks(data, template, stableSectionOrder);
    if (debug) {
      console.log("[usePagination] Decomposed into", result.length, "blocks");
    }
    return result;
  }, [data, template, stableSectionOrder, debug]);

  // Create a stable key for blocks to track when re-measurement is needed
  const blocksKey = useMemo(
    () => blocks.map((b) => b.id).join(","),
    [blocks]
  );

  // Step 2 & 3: Measurement → Pagination
  const [pages, setPages] = useState<PageLayout[]>([]);
  const [measuredKey, setMeasuredKey] = useState<string>("");

  // isReady is true when we have pages and the measured key matches current blocks
  const isReady = pages.length > 0 && measuredKey === blocksKey;

  const onMeasured = useCallback(
    (measuredBlocks: Block[]) => {
      // Always log for debugging
      console.log("[usePagination] Blocks measured:", measuredBlocks.length);
      console.log("[usePagination] Page content height:", pageContentHeight);

      const totalMeasured = measuredBlocks.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
      console.log("[usePagination] Total measured height:", totalMeasured);

      measuredBlocks.forEach((b, i) => {
        console.log(`  Block ${i} (${b.type}): ${b.measuredHeight}px`);
      });

      // Run pagination
      const result = paginateBlocks(measuredBlocks, pageContentHeight, { debug: true });

      console.log("[usePagination] Pages created:", result.length);
      result.forEach((page, i) => {
        const pageHeight = page.blocks.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
        console.log(`  Page ${i}: ${page.blocks.length} blocks, ${pageHeight}px`);
      });

      // Validate the result
      const validation = validatePagination(result, pageContentHeight);
      if (!validation.valid) {
        console.warn("[usePagination] PAGINATION OVERFLOW DETECTED:");
        validation.overflows.forEach((overflow) => {
          console.warn(
            `  Page ${overflow.pageIndex}: ${overflow.height}px exceeds ${pageContentHeight}px by ${overflow.excess}px`
          );
        });
      }

      setPages(result);
      setMeasuredKey(measuredBlocks.map((b) => b.id).join(","));
    },
    [pageContentHeight, debug]
  );

  // The measurer element must be rendered in the DOM (hidden offscreen)
  // It uses the unified BlockRenderer for pixel-perfect consistency
  const measurerElement = useMemo(
    () =>
      createElement(BlockMeasurer, {
        blocks,
        template,
        headingFontId,
        bodyFontId,
        marginPx,
        backgroundColor,
        onMeasured,
        debug,
      }),
    [blocks, template, headingFontId, bodyFontId, marginPx, backgroundColor, onMeasured, debug]
  );

  return {
    pages,
    totalPages: pages.length,
    isReady,
    measurerElement,
  };
}
