import { Block, PageLayout } from "./types";

/**
 * Bin-pack measured blocks into pages.
 * Pure function: Block[] + pageContentHeight → PageLayout[]
 *
 * The `keepWithNext` constraint ensures section headers and job headers
 * are never orphaned at the bottom of a page.
 */
export function paginateBlocks(
  blocks: Block[],
  pageContentHeight: number
): PageLayout[] {
  if (blocks.length === 0) return [];

  const pages: PageLayout[] = [];
  let currentBlocks: Block[] = [];
  let currentHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // If adding this block would exceed the page height and we already have content
    if (
      currentHeight + block.measuredHeight > pageContentHeight &&
      currentBlocks.length > 0
    ) {
      // Pull back any trailing keepWithNext blocks to the new page
      const pulled: Block[] = [];
      while (
        currentBlocks.length > 0 &&
        currentBlocks[currentBlocks.length - 1].keepWithNext
      ) {
        const pulledBlock = currentBlocks.pop()!;
        currentHeight -= pulledBlock.measuredHeight;
        pulled.unshift(pulledBlock);
      }

      // Flush current page (only if there's something left)
      if (currentBlocks.length > 0) {
        pages.push({ pageIndex: pages.length, blocks: currentBlocks });
      }

      // Start new page with pulled blocks
      currentBlocks = [...pulled];
      currentHeight = pulled.reduce((sum, b) => sum + b.measuredHeight, 0);
    }

    currentBlocks.push(block);
    currentHeight += block.measuredHeight;
  }

  // Flush last page
  if (currentBlocks.length > 0) {
    pages.push({ pageIndex: pages.length, blocks: currentBlocks });
  }

  return pages;
}
