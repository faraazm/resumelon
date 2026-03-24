import { Block, PageLayout } from "./types";

/**
 * Pagination buffer - extra safety margin beyond the page content height.
 * Set to 0 for maximum space usage - measurements should be accurate.
 */
const PAGINATION_BUFFER_PX = 0;

/**
 * Minimum height required for a block to be placed at the bottom of a page.
 * Set to 0 to allow any block to be placed at the bottom.
 */
const MIN_BOTTOM_SPACE_PX = 0;

/**
 * Calculate the total height of a keepWithNext chain starting at index.
 * Follows the chain until a block without keepWithNext is found.
 */
function calculateChainHeight(blocks: Block[], startIndex: number): number {
  let height = 0;
  let i = startIndex;

  while (i < blocks.length) {
    height += blocks[i].measuredHeight || 0;
    // If this block doesn't have keepWithNext, we're done
    if (!blocks[i].keepWithNext) {
      break;
    }
    i++;
  }

  return height;
}

interface PaginationOptions {
  debug?: boolean;
}

/**
 * Bin-pack measured blocks into pages with conservative pagination.
 * Pure function: Block[] + pageContentHeight → PageLayout[]
 *
 * Features:
 * - `keepWithNext` constraint prevents orphaned section headers
 * - Conservative bottom buffer to prevent sub-pixel overflow
 * - Early page breaks preferred over risking clipping
 * - Sidebar blocks are placed on page 0 but don't contribute to height
 * - Debug logging for verification
 */
export function paginateBlocks(
  blocks: Block[],
  pageContentHeight: number,
  options: PaginationOptions = {}
): PageLayout[] {
  const { debug = false } = options;

  if (blocks.length === 0) {
    if (debug) console.log("[Paginate] No blocks to paginate");
    return [];
  }

  // Apply conservative buffer to available height
  const effectiveHeight = pageContentHeight - PAGINATION_BUFFER_PX;

  // Separate sidebar blocks (they're fixed elements, not paginated content)
  const sidebarBlocks = blocks.filter((b) => b.type === "sidebar");
  const contentBlocks = blocks.filter((b) => b.type !== "sidebar");

  if (debug) {
    console.log(`[Paginate] Page content height: ${pageContentHeight}px`);
    console.log(`[Paginate] Effective height (with buffer): ${effectiveHeight}px`);
    console.log(`[Paginate] Total blocks: ${blocks.length} (${sidebarBlocks.length} sidebar, ${contentBlocks.length} content)`);
  }

  const pages: PageLayout[] = [];
  let currentBlocks: Block[] = [...sidebarBlocks]; // Sidebar always starts on page 0
  let currentHeight = 0; // Sidebar doesn't count toward height

  for (let i = 0; i < contentBlocks.length; i++) {
    const block = contentBlocks[i];
    const blockHeight = block.measuredHeight || 0;
    const remainingSpace = effectiveHeight - currentHeight;

    // Look ahead: if this block has keepWithNext, calculate the ENTIRE chain height
    // This handles chains like: section-header → degree → school (all must fit together)
    let effectiveBlockHeight = blockHeight;
    if (block.keepWithNext) {
      effectiveBlockHeight = calculateChainHeight(contentBlocks, i);
      if (debug) {
        console.log(
          `[Paginate] Block ${i} (${block.type}) has keepWithNext chain, ` +
          `total chain height: ${effectiveBlockHeight}px`
        );
      }
    }

    if (debug) {
      console.log(
        `[Paginate] Block ${i} (${block.type}): ${blockHeight}px, ` +
        `current page height: ${currentHeight}px, remaining: ${remainingSpace}px`
      );
    }

    // Check if we should start a new page
    // Use effectiveBlockHeight to account for keepWithNext chains (e.g., header→degree→school)
    const shouldStartNewPage =
      // Block (or entire keepWithNext chain) doesn't fit
      (currentHeight + effectiveBlockHeight > effectiveHeight && currentBlocks.length > 0) ||
      // Or remaining space is too small to be useful (avoid tiny orphans)
      (remainingSpace < MIN_BOTTOM_SPACE_PX && currentBlocks.length > 0 && effectiveBlockHeight > remainingSpace);

    if (shouldStartNewPage) {
      if (debug) {
        const heightUsed = block.keepWithNext ? effectiveBlockHeight : blockHeight;
        console.log(
          `[Paginate] Starting new page. Reason: ` +
          (currentHeight + heightUsed > effectiveHeight
            ? `block doesn't fit (${currentHeight}px + ${heightUsed}px > ${effectiveHeight}px)${block.keepWithNext ? ' (includes keepWithNext)' : ''}`
            : `remaining space too small (${remainingSpace}px < ${MIN_BOTTOM_SPACE_PX}px)`)
        );
      }

      // Pull back any trailing keepWithNext blocks to the new page
      const pulled: Block[] = [];
      while (
        currentBlocks.length > 0 &&
        currentBlocks[currentBlocks.length - 1].keepWithNext
      ) {
        const pulledBlock = currentBlocks.pop()!;
        currentHeight -= pulledBlock.measuredHeight || 0;
        pulled.unshift(pulledBlock);
        if (debug) {
          console.log(`[Paginate] Pulling back keepWithNext block: ${pulledBlock.type}`);
        }
      }

      // Flush current page (only if there's something left)
      if (currentBlocks.length > 0) {
        const pageHeight = currentBlocks.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
        pages.push({ pageIndex: pages.length, blocks: currentBlocks });
        if (debug) {
          console.log(
            `[Paginate] Page ${pages.length - 1} created with ${currentBlocks.length} blocks, ` +
            `total height: ${pageHeight}px`
          );
        }
      }

      // Start new page with pulled blocks
      currentBlocks = [...pulled];
      currentHeight = pulled.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
    }

    // Add block to current page
    currentBlocks.push(block);
    currentHeight += blockHeight;
  }

  // Flush last page
  if (currentBlocks.length > 0) {
    const pageHeight = currentBlocks.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
    pages.push({ pageIndex: pages.length, blocks: currentBlocks });
    if (debug) {
      console.log(
        `[Paginate] Final page ${pages.length - 1} created with ${currentBlocks.length} blocks, ` +
        `total height: ${pageHeight}px`
      );
    }
  }

  if (debug) {
    console.log(`[Paginate] Total pages: ${pages.length}`);
    pages.forEach((page, idx) => {
      const height = page.blocks.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
      const blockTypes = page.blocks.map((b) => b.type).join(", ");
      console.log(`[Paginate] Page ${idx}: ${height}px, blocks: [${blockTypes}]`);
    });
  }

  return pages;
}

/**
 * Validates that all pages fit within the page height.
 * Returns any pages that exceed the limit for debugging.
 */
export function validatePagination(
  pages: PageLayout[],
  pageContentHeight: number
): { valid: boolean; overflows: Array<{ pageIndex: number; height: number; excess: number }> } {
  const overflows: Array<{ pageIndex: number; height: number; excess: number }> = [];

  for (const page of pages) {
    const height = page.blocks.reduce((sum, b) => sum + (b.measuredHeight || 0), 0);
    if (height > pageContentHeight) {
      overflows.push({
        pageIndex: page.pageIndex,
        height,
        excess: height - pageContentHeight,
      });
    }
  }

  return { valid: overflows.length === 0, overflows };
}
