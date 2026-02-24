"use client";

import { useMemo, useState, useCallback, ReactNode } from "react";
import { createElement } from "react";
import { ResumeData, TemplateConfig } from "@/lib/templates/types";
import { LETTER_HEIGHT_PX, PAGE_BOTTOM_SAFETY_PX } from "@/lib/pdf-constants";
import { Block, PageLayout } from "./types";
import { decomposeBlocks } from "./decompose";
import { paginateBlocks } from "./paginate";
import { BlockMeasurer } from "./BlockMeasurer";

interface UsePaginationOptions {
  marginPx: number;
  headingFontId: string;
  bodyFontId: string;
  backgroundColor?: string;
  sectionOrder?: string[];
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
 * 3. Bin-pack measured blocks into pages
 */
export function usePagination(
  data: ResumeData,
  template: TemplateConfig,
  options: UsePaginationOptions
): UsePaginationResult {
  const { marginPx, headingFontId, bodyFontId, backgroundColor, sectionOrder } = options;
  const pageContentHeight = LETTER_HEIGHT_PX - marginPx * 2 - PAGE_BOTTOM_SAFETY_PX;

  // Step 1: Decompose
  const blocks = useMemo(
    () => decomposeBlocks(data, template, sectionOrder),
    [data, template, sectionOrder]
  );

  // Step 2 & 3: Measurement → Pagination
  const [pages, setPages] = useState<PageLayout[]>([]);
  const [isReady, setIsReady] = useState(false);

  const onMeasured = useCallback(
    (measuredBlocks: Block[]) => {
      const result = paginateBlocks(measuredBlocks, pageContentHeight);
      setPages(result);
      setIsReady(true);
    },
    [pageContentHeight]
  );

  // The measurer element must be rendered in the DOM (hidden offscreen)
  const measurerElement = createElement(BlockMeasurer, {
    blocks,
    template,
    headingFontId,
    bodyFontId,
    marginPx,
    backgroundColor,
    onMeasured,
  });

  return {
    pages,
    totalPages: pages.length,
    isReady,
    measurerElement,
  };
}
