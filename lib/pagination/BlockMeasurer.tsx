"use client";

import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Block } from "./types";
import { TemplateConfig, getFontFamily } from "@/lib/templates/types";
import { BlockRenderer, parseSidebarWidth } from "./BlockRenderer";
import {
  LETTER_WIDTH_PX,
  TYPOGRAPHY,
  SIDEBAR_CONTENT_PADDING_PX,
} from "@/lib/pdf-constants";

interface BlockMeasurerProps {
  blocks: Block[];
  template: TemplateConfig;
  headingFontId: string;
  bodyFontId: string;
  marginPx: number;
  backgroundColor?: string;
  onMeasured: (blocks: Block[]) => void;
  debug?: boolean;
}

/**
 * Renders each block offscreen at full scale to measure its height.
 * Uses the SAME BlockRenderer as PageRenderer to ensure consistency.
 * Once all blocks are measured and fonts are ready, calls onMeasured.
 */
export function BlockMeasurer({
  blocks,
  template,
  headingFontId,
  bodyFontId,
  marginPx,
  backgroundColor,
  onMeasured,
  debug = false,
}: BlockMeasurerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksKey = blocks.map((b) => b.id).join(",");

  // Store blocks in a ref to avoid dependency issues
  const blocksRef = useRef(blocks);
  // Store onMeasured in a ref to keep callback stable
  const onMeasuredRef = useRef(onMeasured);

  // Update refs in useLayoutEffect to avoid updating during render
  useLayoutEffect(() => {
    blocksRef.current = blocks;
    onMeasuredRef.current = onMeasured;
  });

  const measure = useCallback(() => {
    if (!containerRef.current) {
      console.warn("[BlockMeasurer] No container ref!");
      return;
    }
    const container = containerRef.current;
    const children = container.children;
    const currentBlocks = blocksRef.current;

    console.log(`[BlockMeasurer] Measuring ${currentBlocks.length} blocks, container has ${children.length} children`);

    const measured = currentBlocks.map((block, i) => {
      const el = children[i] as HTMLElement;
      if (!el) {
        console.warn(`[BlockMeasurer] No element for block ${i} (${block.type})`);
        return { ...block, measuredHeight: 0 };
      }

      // With overflow:hidden on the wrapper, child margins are contained
      // and offsetHeight accurately reflects the total space needed
      const height = el.offsetHeight;
      console.log(`[BlockMeasurer] Block ${i} "${block.type}": ${height}px`);
      return { ...block, measuredHeight: height };
    });

    const totalHeight = measured.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
    console.log(`[BlockMeasurer] Total measured height: ${totalHeight}px`);

    onMeasuredRef.current(measured);
  }, []);

  // Measure after fonts are ready
  useEffect(() => {
    // Wait for fonts then measure
    const doMeasure = () => {
      // Use triple requestAnimationFrame to ensure:
      // 1. DOM is updated
      // 2. Layout is calculated
      // 3. Fonts are rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            measure();
          });
        });
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(doMeasure);
    } else {
      // Fallback with longer timeout
      setTimeout(doMeasure, 150);
    }
  }, [blocksKey, measure, template.id, headingFontId, bodyFontId, marginPx]);

  // Font styles - MUST match PageRenderer exactly
  const headingFontFamily = getFontFamily(headingFontId);
  const bodyFontFamily = getFontFamily(bodyFontId);
  const fontStyle: React.CSSProperties = {
    ["--heading-font" as string]: headingFontFamily,
    ["--body-font" as string]: bodyFontFamily,
    fontFamily: bodyFontFamily,
  };

  // Determine measurement container width
  // CRITICAL: Must match the actual content width used in PageRenderer
  const isSidebar = template.layout.sidebar;
  const sidebarWidthPx = isSidebar
    ? parseSidebarWidth(template.layout.sidebarWidth)
    : 0;
  const mainContentPadding = isSidebar ? SIDEBAR_CONTENT_PADDING_PX * 2 : 0;
  // For standard layouts, subtract margins from page width to match actual content area
  // For sidebar layouts, subtract sidebar width and its padding
  const contentWidth = isSidebar
    ? LETTER_WIDTH_PX - sidebarWidthPx - mainContentPadding
    : LETTER_WIDTH_PX - marginPx * 2;

  if (debug) {
    console.log(`[BlockMeasurer] Content width: ${contentWidth}px (isSidebar: ${isSidebar}, marginPx: ${marginPx})`);
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        visibility: "hidden",
        width: contentWidth,
        overflow: "hidden",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        backgroundColor: backgroundColor || "#ffffff",
        fontSize: TYPOGRAPHY.body,
        lineHeight: String(TYPOGRAPHY.lineHeight),
        ...fontStyle,
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          data-block-id={block.id}
          data-block-type={block.type}
          className={template.spacing.lineHeight}
          style={{
            // overflow:hidden creates a new block formatting context,
            // preventing margin collapse so we measure accurate heights
            overflow: "hidden",
          }}
        >
          {/* Use the unified BlockRenderer - same as PageRenderer */}
          <BlockRenderer block={block} template={template} forMeasurement={true} />
        </div>
      ))}
    </div>
  );
}
