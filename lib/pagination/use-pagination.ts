"use client";

import { useMemo, useState, useCallback, useRef, ReactNode } from "react";
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

  // Create a key that changes when block structure OR content changes.
  // Block IDs are structural (e.g. "header", "summary") and don't change
  // when text content changes, so we include a content fingerprint.
  const blocksKey = useMemo(
    () => {
      const contentFingerprint = JSON.stringify(data) + headingFontId + bodyFontId;
      let hash = 0;
      for (let i = 0; i < contentFingerprint.length; i++) {
        hash = ((hash << 5) - hash + contentFingerprint.charCodeAt(i)) | 0;
      }
      return blocks.map((b) => b.id).join(",") + "|" + hash;
    },
    [blocks, data, headingFontId, bodyFontId]
  );

  // Step 2 & 3: Measurement → Pagination
  const [pages, setPages] = useState<PageLayout[]>([]);
  const [measuredKey, setMeasuredKey] = useState<string>("");

  // isReady is true when we have pages and the measured key matches current blocks
  const isReady = pages.length > 0 && measuredKey === blocksKey;

  // Keep blocksKey in a ref so onMeasured can read the latest value
  const blocksKeyRef = useRef(blocksKey);
  blocksKeyRef.current = blocksKey;

  const onMeasured = useCallback(
    (measuredBlocks: Block[]) => {
      if (debug) {
        console.log("[usePagination] Blocks measured:", measuredBlocks.length);
      }

      // Run pagination
      const result = paginateBlocks(measuredBlocks, pageContentHeight, { debug });

      // Validate the result
      const validation = validatePagination(result, pageContentHeight);
      if (!validation.valid && debug) {
        console.warn("[usePagination] PAGINATION OVERFLOW DETECTED");
      }

      setPages(result);
      setMeasuredKey(blocksKeyRef.current);
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
