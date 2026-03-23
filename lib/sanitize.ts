import DOMPurify from "isomorphic-dompurify";

// Configure DOMPurify to only allow safe HTML tags from rich text editors
const ALLOWED_TAGS = ["p", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br", "span"];
const ALLOWED_ATTR = ["href", "target", "rel", "class"];

/**
 * Sanitize HTML content from rich text editors.
 * Only allows safe formatting tags — strips scripts, event handlers, etc.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text input — strips all HTML tags and limits length.
 */
export function sanitizeText(value: string, maxLength: number = 500): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}

/**
 * Sanitize email input.
 */
export function sanitizeEmail(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9@._+\-]/g, "")
    .slice(0, 254);
}

/**
 * Sanitize phone number input.
 */
export function sanitizePhone(value: string): string {
  return value
    .replace(/[^0-9+\-() .]/g, "")
    .slice(0, 30);
}

/**
 * Sanitize URL input — blocks javascript: and data: URIs.
 */
export function sanitizeUrl(value: string): string {
  const cleaned = value.replace(/[<>"'`;()]/g, "").slice(0, 500);
  const lower = cleaned.toLowerCase().trim();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return "";
  }
  return cleaned;
}
