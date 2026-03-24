"use client";

import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Block } from "./types";
import { TemplateConfig, getFontFamily } from "@/lib/templates/types";
import { BlockRenderer, BlockListRenderer, parseSidebarWidth } from "./BlockRenderer";
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
 * Segment type matching BlockListRenderer's grouping logic.
 * Bullets with the same jobId are grouped together for accurate measurement.
 */
type MeasureSegment =
  | { type: "single"; block: Block; index: number }
  | { type: "bullet-group"; jobId: string; bullets: Block[]; indices: number[] };

/**
 * Group blocks into segments matching how BlockListRenderer renders them.
 * This ensures measurement matches actual rendering (especially bullet grouping).
 */
function segmentBlocks(blocks: Block[]): MeasureSegment[] {
  const segments: MeasureSegment[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "bullet" && block.jobId) {
      const last = segments[segments.length - 1];
      if (last && last.type === "bullet-group" && last.jobId === block.jobId) {
        last.bullets.push(block);
        last.indices.push(i);
      } else {
        segments.push({
          type: "bullet-group",
          jobId: block.jobId,
          bullets: [block],
          indices: [i],
        });
      }
    } else {
      segments.push({ type: "single", block, index: i });
    }
  }

  return segments;
}

/**
 * Renders blocks offscreen at full scale to measure heights.
 * Groups bullets by jobId (matching BlockListRenderer) for accurate measurement.
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
  // Include a content fingerprint so re-measurement triggers on data changes,
  // not just structural changes (block IDs are structural and don't change on edits)
  const blocksKey = (() => {
    const content = JSON.stringify(blocks.map((b) => b.data));
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash + content.charCodeAt(i)) | 0;
    }
    return blocks.map((b) => b.id).join(",") + "|" + hash;
  })();

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
    const segments = segmentBlocks(currentBlocks);

    if (debug) {
      console.log(
        `[BlockMeasurer] Measuring ${currentBlocks.length} blocks in ${segments.length} segments, ` +
        `container has ${children.length} children`
      );
    }

    // Initialize all blocks with 0 height
    const measured = currentBlocks.map((block) => ({ ...block, measuredHeight: 0 }));

    // Measure each segment (which maps 1:1 to rendered children)
    segments.forEach((segment, segIdx) => {
      const el = children[segIdx] as HTMLElement;
      if (!el) {
        if (debug) console.warn(`[BlockMeasurer] No element for segment ${segIdx}`);
        return;
      }

      const height = el.offsetHeight;

      if (segment.type === "single") {
        measured[segment.index] = { ...measured[segment.index], measuredHeight: height };
        if (debug) {
          console.log(`[BlockMeasurer] Block ${segment.index} "${segment.block.type}": ${height}px`);
        }
      } else {
        // Bullet group: distribute measured height proportionally among bullets.
        // First, measure individual li heights within the group for proportional distribution.
        const listItems = el.querySelectorAll("li");
        const bulletCount = segment.bullets.length;

        if (listItems.length === bulletCount && bulletCount > 1) {
          // Get each li's height for proportional distribution
          const liHeights: number[] = [];
          let totalLiHeight = 0;
          listItems.forEach((li) => {
            const h = (li as HTMLElement).offsetHeight;
            liHeights.push(h);
            totalLiHeight += h;
          });

          // Distribute group height proportionally based on li heights
          let distributed = 0;
          segment.indices.forEach((blockIdx, bulletIdx) => {
            if (bulletIdx === bulletCount - 1) {
              // Last bullet gets remainder to avoid rounding errors
              measured[blockIdx] = { ...measured[blockIdx], measuredHeight: height - distributed };
            } else {
              const proportion = totalLiHeight > 0 ? liHeights[bulletIdx] / totalLiHeight : 1 / bulletCount;
              const bulletHeight = Math.round(height * proportion);
              measured[blockIdx] = { ...measured[blockIdx], measuredHeight: bulletHeight };
              distributed += bulletHeight;
            }
          });

          if (debug) {
            console.log(
              `[BlockMeasurer] Bullet group (job ${segment.jobId}): ${height}px total, ` +
              `${bulletCount} bullets, distributed: [${segment.indices.map((idx) => measured[idx].measuredHeight).join(", ")}]`
            );
          }
        } else {
          // Fallback: divide evenly
          const perBullet = Math.round(height / bulletCount);
          let distributed = 0;
          segment.indices.forEach((blockIdx, bulletIdx) => {
            if (bulletIdx === bulletCount - 1) {
              measured[blockIdx] = { ...measured[blockIdx], measuredHeight: height - distributed };
            } else {
              measured[blockIdx] = { ...measured[blockIdx], measuredHeight: perBullet };
              distributed += perBullet;
            }
          });

          if (debug) {
            console.log(
              `[BlockMeasurer] Bullet group (job ${segment.jobId}): ${height}px total, ` +
              `${bulletCount} bullets (even split: ${perBullet}px each)`
            );
          }
        }
      }
    });

    const totalHeight = measured.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
    if (debug) {
      console.log(`[BlockMeasurer] Total measured height: ${totalHeight}px`);
    }

    onMeasuredRef.current(measured);
  }, [debug]);

  // Measure after fonts are ready
  useEffect(() => {
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
  const contentWidth = isSidebar
    ? LETTER_WIDTH_PX - sidebarWidthPx - mainContentPadding
    : LETTER_WIDTH_PX - marginPx * 2;

  if (debug) {
    console.log(`[BlockMeasurer] Content width: ${contentWidth}px (isSidebar: ${isSidebar}, marginPx: ${marginPx})`);
  }

  // Segment blocks to render them the same way as BlockListRenderer
  const segments = segmentBlocks(blocks);

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
      {segments.map((segment, segIdx) => {
        if (segment.type === "bullet-group") {
          // Render bullet group using BlockListRenderer's approach:
          // all bullets in one BulletList, matching actual page rendering
          return (
            <div
              key={`bullet-group-${segment.jobId}-${segIdx}`}
              data-segment-type="bullet-group"
              data-job-id={segment.jobId}
              className={template.spacing.lineHeight}
              style={{ overflow: "hidden" }}
            >
              <BlockListRenderer
                blocks={segment.bullets}
                template={template}
              />
            </div>
          );
        }

        const block = segment.block;
        return (
          <div
            key={block.id}
            data-block-id={block.id}
            data-block-type={block.type}
            className={template.spacing.lineHeight}
            style={{ overflow: "hidden" }}
          >
            <BlockRenderer block={block} template={template} forMeasurement={true} />
          </div>
        );
      })}
    </div>
  );
}
