/**
 * PDF Generation Constants
 *
 * These constants define the page dimensions and settings used for
 * resume rendering and PDF generation. All preview and print components
 * should use these values to ensure consistency.
 *
 * US Letter size is used as the default (most common in the US).
 * A4 would be: 794 x 1123 at 96 DPI (210mm x 297mm)
 */

// Letter dimensions at 96 DPI (standard web/CSS DPI)
// US Letter = 8.5" x 11"
export const LETTER_WIDTH_PX = 816;  // 8.5 * 96
export const LETTER_HEIGHT_PX = 1056; // 11 * 96

// Aspect ratio for scaling calculations
export const LETTER_ASPECT_RATIO = LETTER_WIDTH_PX / LETTER_HEIGHT_PX;

// Default margins in inches (safe for most printers)
export const DEFAULT_MARGIN_IN = 0.5;
export const COMPACT_MARGIN_IN = 0.4;
export const SPACIOUS_MARGIN_IN = 0.6;

// Margins in pixels at 96 DPI
export const DEFAULT_MARGIN_PX = DEFAULT_MARGIN_IN * 96; // 48px
export const COMPACT_MARGIN_PX = COMPACT_MARGIN_IN * 96; // ~38px
export const SPACIOUS_MARGIN_PX = SPACIOUS_MARGIN_IN * 96; // ~58px

// Total vertical padding (top + bottom margins)
export const DEFAULT_VERTICAL_PADDING_PX = DEFAULT_MARGIN_PX * 2; // 96px

// Content area dimensions (page size minus margins)
export const LETTER_CONTENT_WIDTH_PX = LETTER_WIDTH_PX - (DEFAULT_MARGIN_PX * 2);
export const LETTER_CONTENT_HEIGHT_PX = LETTER_HEIGHT_PX - (DEFAULT_MARGIN_PX * 2);

// Typography defaults (in points, as per print standards)
export const TYPOGRAPHY = {
  body: "10pt",
  sectionHeading: "11pt",
  nameMin: "22pt",
  nameMax: "28pt",
  contact: "9pt",
  lineHeight: 1.25,
} as const;

// Sidebar template content padding (used for main content area)
export const SIDEBAR_CONTENT_PADDING_PX = 24;

// Safety buffer subtracted from page content height to prevent sub-pixel overflow
// Increased to 20px to handle font rendering variations, line-height differences,
// and ensure content never bleeds past page boundaries
export const PAGE_BOTTOM_SAFETY_PX = 20;

// Page format for Playwright PDF generation
export const PDF_FORMAT = "Letter" as const;
