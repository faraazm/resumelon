import { TemplateConfig } from "./types";

// =============================================================================
// TEMPLATE 1: ATS CLASSIC
// Traditional ATS format - serif name, clean black line dividers
// Based on resume-1 reference
// =============================================================================
export const atsClassicTemplate: TemplateConfig = {
  id: "ats-classic",
  name: "ATS Classic",
  description: "Traditional ATS-friendly format with clean lines",

  typography: {
    headingFont: "garamond",
    bodyFont: "sourcesans",
    nameFontSize: "text-[26pt]",
    sectionFontSize: "text-[11pt]",
    bodyFontSize: "text-[10pt]",
    nameWeight: "font-bold",
    sectionWeight: "font-bold",
    nameLetterSpacing: "tracking-normal",
    sectionLetterSpacing: "tracking-normal",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.5in]",
    sectionGap: "mb-4",
    itemGap: "mt-2.5",
    lineHeight: "leading-snug",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "line",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "inline",
    skillsLayout: "inline",
    datePosition: "right",
  },

  sections: {
    order: ["experience", "education", "skills"],
    visible: {
      summary: false,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#000000",
    body: "#1a1a1a",
    muted: "#4b5563",
    divider: "#000000",
    sidebar: "#ffffff",
    accent: "#000000",
  },
};

// =============================================================================
// TEMPLATE 2: BOLD MODERN
// Large centered name, bold black sans-serif, gray dividers
// Based on resume-2 reference
// =============================================================================
export const boldModernTemplate: TemplateConfig = {
  id: "bold-modern",
  name: "Bold Modern",
  description: "Large centered name with professional presence",

  typography: {
    headingFont: "montserrat",
    bodyFont: "opensans",
    nameFontSize: "text-[36pt]",
    sectionFontSize: "text-[13pt]",
    bodyFontSize: "text-[10pt]",
    nameWeight: "font-black",
    sectionWeight: "font-bold",
    nameLetterSpacing: "tracking-tight",
    sectionLetterSpacing: "tracking-normal",
    sectionTransform: "uppercase",
    nameTransform: "uppercase",
  },

  spacing: {
    pagePadding: "p-[0.6in]",
    sectionGap: "mb-5",
    itemGap: "mt-3",
    lineHeight: "leading-relaxed",
  },

  layout: {
    columns: 1,
    headerAlignment: "center",
    sectionDivider: "line",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "inline",
    skillsLayout: "inline",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "education", "skills"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#000000",
    body: "#1f2937",
    muted: "#6b7280",
    divider: "#d1d5db",
    sidebar: "#ffffff",
    accent: "#000000",
  },
};

// =============================================================================
// TEMPLATE 3: CORAL TWO-COLUMN
// Two-column header with coral accent, contact info on right
// Based on resume-4 reference - Emily Williams style
// =============================================================================
export const coralTwoColumnTemplate: TemplateConfig = {
  id: "coral-two-column",
  name: "Coral Accent",
  description: "Modern two-column with coral highlights",

  typography: {
    headingFont: "raleway",
    bodyFont: "nunito",
    nameFontSize: "text-[22pt]",
    sectionFontSize: "text-[9pt]",
    bodyFontSize: "text-[9pt]",
    nameWeight: "font-light",
    sectionWeight: "font-semibold",
    nameLetterSpacing: "tracking-wide",
    sectionLetterSpacing: "tracking-[0.2em]",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.4in]",
    sectionGap: "mb-4",
    itemGap: "mt-2",
    lineHeight: "leading-snug",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "accent",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "two-column",
    skillsLayout: "grid",
    datePosition: "left",
  },

  sections: {
    order: ["experience", "education", "skills"],
    visible: {
      summary: false,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#000000",
    body: "#374151",
    muted: "#6b7280",
    divider: "#f87171",
    sidebar: "#ffffff",
    accent: "#f87171",
  },
};

// =============================================================================
// TEMPLATE 4: TIMELINE BLUE
// Clean timeline with dates on left, blue accent for titles
// Based on resume-5 reference - Ryan Peterson style
// =============================================================================
export const timelineBlueTemplate: TemplateConfig = {
  id: "timeline-blue",
  name: "Timeline",
  description: "Clean timeline with dates on the left",

  typography: {
    headingFont: "inter",
    bodyFont: "inter",
    nameFontSize: "text-[20pt]",
    sectionFontSize: "text-[9pt]",
    bodyFontSize: "text-[9pt]",
    nameWeight: "font-semibold",
    sectionWeight: "font-semibold",
    nameLetterSpacing: "tracking-normal",
    sectionLetterSpacing: "tracking-[0.15em]",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.4in]",
    sectionGap: "mb-4",
    itemGap: "mt-2",
    lineHeight: "leading-snug",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "line",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "two-column",
    skillsLayout: "grid",
    datePosition: "left",
  },

  sections: {
    order: ["experience", "education", "skills"],
    visible: {
      summary: false,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#000000",
    body: "#374151",
    muted: "#6b7280",
    divider: "#e5e7eb",
    sidebar: "#ffffff",
    accent: "#2563eb",
  },
};

// =============================================================================
// TEMPLATE 5: ELEGANT SERIF
// Sophisticated serif typography, centered layout, warm aesthetic
// Based on resume-7 reference - Olivera Hewitt style
// =============================================================================
export const elegantSerifTemplate: TemplateConfig = {
  id: "elegant-serif",
  name: "Elegant",
  description: "Sophisticated serif typography",

  typography: {
    headingFont: "librebaskerville",
    bodyFont: "crimson",
    nameFontSize: "text-[24pt]",
    sectionFontSize: "text-[11pt]",
    bodyFontSize: "text-[10pt]",
    nameWeight: "font-normal",
    sectionWeight: "font-normal",
    nameLetterSpacing: "tracking-[0.15em]",
    sectionLetterSpacing: "tracking-normal",
    sectionTransform: "capitalize",
    nameTransform: "uppercase",
  },

  spacing: {
    pagePadding: "p-[0.6in]",
    sectionGap: "mb-5",
    itemGap: "mt-3",
    lineHeight: "leading-relaxed",
  },

  layout: {
    columns: 1,
    headerAlignment: "center",
    sectionDivider: "none",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "inline",
    skillsLayout: "tags",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "education", "skills"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#292524",
    body: "#44403c",
    muted: "#78716c",
    divider: "#d6d3d1",
    sidebar: "#ffffff",
    accent: "#78716c",
  },
};

// =============================================================================
// TEMPLATE 6: EXECUTIVE NAVY
// Premium executive design with navy accents
// =============================================================================
export const executiveNavyTemplate: TemplateConfig = {
  id: "executive-navy",
  name: "Executive",
  description: "Premium design for senior professionals",

  typography: {
    headingFont: "playfair",
    bodyFont: "lato",
    nameFontSize: "text-[28pt]",
    sectionFontSize: "text-[11pt]",
    bodyFontSize: "text-[10pt]",
    nameWeight: "font-bold",
    sectionWeight: "font-semibold",
    nameLetterSpacing: "tracking-normal",
    sectionLetterSpacing: "tracking-wide",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.55in]",
    sectionGap: "mb-5",
    itemGap: "mt-3",
    lineHeight: "leading-relaxed",
  },

  layout: {
    columns: 1,
    headerAlignment: "center",
    sectionDivider: "accent",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "inline",
    skillsLayout: "inline",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "education", "skills"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#1e3a5f",
    body: "#1f2937",
    muted: "#4b5563",
    divider: "#1e3a5f",
    sidebar: "#ffffff",
    accent: "#1e3a5f",
  },
};

// =============================================================================
// TEMPLATE 7: SIDEBAR DARK
// Two-column with dark navy sidebar, photo support
// =============================================================================
export const sidebarDarkTemplate: TemplateConfig = {
  id: "sidebar-dark",
  name: "Sidebar",
  description: "Two-column with dark sidebar",

  typography: {
    headingFont: "poppins",
    bodyFont: "poppins",
    nameFontSize: "text-[16pt]",
    sectionFontSize: "text-[8pt]",
    bodyFontSize: "text-[8pt]",
    nameWeight: "font-semibold",
    sectionWeight: "font-semibold",
    nameLetterSpacing: "tracking-normal",
    sectionLetterSpacing: "tracking-wider",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-0",
    sectionGap: "mb-3",
    itemGap: "mt-1.5",
    lineHeight: "leading-tight",
  },

  layout: {
    columns: 2,
    headerAlignment: "left",
    sectionDivider: "none",
    bulletStyle: "disc",
    showPhoto: true,
    sidebar: true,
    sidebarWidth: "w-[170px]",
    sidebarPosition: "left",
    contactLayout: "stacked",
    skillsLayout: "tags",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "education", "skills"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
    sidebarSections: ["contact", "skills", "education"],
    mainSections: ["summary", "experience"],
  },

  colors: {
    heading: "#ffffff",
    body: "#1a1a1a",
    muted: "#d1d5db",
    divider: "#374151",
    sidebar: "#1e3a5f",
    accent: "#60a5fa",
  },
};

// =============================================================================
// TEMPLATE 8: MINIMAL CLEAN
// Ultra-minimal with maximum whitespace, subtle gray accents
// =============================================================================
export const minimalCleanTemplate: TemplateConfig = {
  id: "minimal-clean",
  name: "Minimal",
  description: "Ultra-clean with no distractions",

  typography: {
    headingFont: "inter",
    bodyFont: "inter",
    nameFontSize: "text-[20pt]",
    sectionFontSize: "text-[9pt]",
    bodyFontSize: "text-[9pt]",
    nameWeight: "font-medium",
    sectionWeight: "font-medium",
    nameLetterSpacing: "tracking-normal",
    sectionLetterSpacing: "tracking-[0.1em]",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.5in]",
    sectionGap: "mb-4",
    itemGap: "mt-2",
    lineHeight: "leading-snug",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "line",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "inline",
    skillsLayout: "inline",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "education", "skills"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#111827",
    body: "#374151",
    muted: "#6b7280",
    divider: "#e5e7eb",
    sidebar: "#ffffff",
    accent: "#374151",
  },
};

// =============================================================================
// TEMPLATE 9: COMPACT PROFESSIONAL
// Dense layout with background section headers
// =============================================================================
export const compactProfessionalTemplate: TemplateConfig = {
  id: "compact-pro",
  name: "Compact",
  description: "Dense layout for maximum content",

  typography: {
    headingFont: "roboto",
    bodyFont: "roboto",
    nameFontSize: "text-[18pt]",
    sectionFontSize: "text-[9pt]",
    bodyFontSize: "text-[8.5pt]",
    nameWeight: "font-bold",
    sectionWeight: "font-medium",
    nameLetterSpacing: "tracking-normal",
    sectionLetterSpacing: "tracking-wider",
    sectionTransform: "uppercase",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.4in]",
    sectionGap: "mb-3",
    itemGap: "mt-1.5",
    lineHeight: "leading-tight",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "background",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
    contactLayout: "inline",
    skillsLayout: "inline",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "education", "skills"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#000000",
    body: "#1f2937",
    muted: "#4b5563",
    divider: "#000000",
    sidebar: "#ffffff",
    accent: "#000000",
    sectionHeaderBg: "#f3f4f6",
  },
};

// =============================================================================
// TEMPLATE 10: CREATIVE BOLD
// Bold, creative design with strong visual hierarchy
// =============================================================================
export const creativeBoldTemplate: TemplateConfig = {
  id: "creative-bold",
  name: "Creative",
  description: "Bold design for creative professionals",

  typography: {
    headingFont: "poppins",
    bodyFont: "nunito",
    nameFontSize: "text-[30pt]",
    sectionFontSize: "text-[12pt]",
    bodyFontSize: "text-[10pt]",
    nameWeight: "font-bold",
    sectionWeight: "font-bold",
    nameLetterSpacing: "tracking-tight",
    sectionLetterSpacing: "tracking-normal",
    sectionTransform: "none",
    nameTransform: "none",
  },

  spacing: {
    pagePadding: "p-[0.5in]",
    sectionGap: "mb-4",
    itemGap: "mt-2",
    lineHeight: "leading-normal",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "accent",
    bulletStyle: "square",
    showPhoto: false,
    sidebar: false,
    contactLayout: "stacked",
    skillsLayout: "tags",
    datePosition: "right",
  },

  sections: {
    order: ["summary", "experience", "skills", "education"],
    visible: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
  },

  colors: {
    heading: "#0f172a",
    body: "#334155",
    muted: "#64748b",
    divider: "#6366f1",
    sidebar: "#ffffff",
    accent: "#6366f1",
  },
};

// Keep backward compatibility aliases
export const professionalTemplate = atsClassicTemplate;
export const modernTemplate = boldModernTemplate;
export const classicTemplate = elegantSerifTemplate;
export const sidebarTemplate = sidebarDarkTemplate;
export const compactTemplate = compactProfessionalTemplate;
export const creativeTemplate = creativeBoldTemplate;
export const minimalTemplate = minimalCleanTemplate;
export const executiveTemplate = executiveNavyTemplate;
export const coralAccentTemplate = coralTwoColumnTemplate;

// Template registry
export const templates: Record<string, TemplateConfig> = {
  "ats-classic": atsClassicTemplate,
  "bold-modern": boldModernTemplate,
  "coral-two-column": coralTwoColumnTemplate,
  "timeline-blue": timelineBlueTemplate,
  "elegant-serif": elegantSerifTemplate,
  "executive-navy": executiveNavyTemplate,
  "sidebar-dark": sidebarDarkTemplate,
  "minimal-clean": minimalCleanTemplate,
  "compact-pro": compactProfessionalTemplate,
  "creative-bold": creativeBoldTemplate,
  // Backward compatibility
  professional: atsClassicTemplate,
  modern: boldModernTemplate,
  classic: elegantSerifTemplate,
  sidebar: sidebarDarkTemplate,
  compact: compactProfessionalTemplate,
  creative: creativeBoldTemplate,
  minimal: minimalCleanTemplate,
  executive: executiveNavyTemplate,
};

// Get template by ID with fallback
export function getTemplate(id: string): TemplateConfig {
  return templates[id] || atsClassicTemplate;
}

// Get all unique templates as array for selection UI
export function getAllTemplates(): TemplateConfig[] {
  return [
    atsClassicTemplate,
    boldModernTemplate,
    coralTwoColumnTemplate,
    timelineBlueTemplate,
    elegantSerifTemplate,
    executiveNavyTemplate,
    sidebarDarkTemplate,
    minimalCleanTemplate,
    compactProfessionalTemplate,
    creativeBoldTemplate,
  ];
}

// Font type detection
export function getFontType(fontId: string): "serif" | "sans" {
  const serifFonts = ["merriweather", "playfair", "lora", "crimson", "librebaskerville", "garamond"];
  return serifFonts.includes(fontId) ? "serif" : "sans";
}

// Get template's heading font ID
export function getTemplateDefaultHeadingFont(templateId: string): string {
  const template = getTemplate(templateId);
  return template.typography.headingFont;
}

// Get template's body font ID
export function getTemplateDefaultBodyFont(templateId: string): string {
  const template = getTemplate(templateId);
  return template.typography.bodyFont;
}
