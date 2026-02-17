import { TemplateConfig } from "./types";

// Neutral colors used by all templates (accent color is applied from user style)
const neutralColors = {
  heading: "#000000",
  body: "#1a1a1a",
  muted: "#4b5563",
  divider: "#000000",
  sidebar: "#1f2937",
  accent: "#000000",
};

// Professional template - Clean, centered header with bold dividers
export const professionalTemplate: TemplateConfig = {
  id: "professional",
  name: "Professional",
  description: "Centered layout with bold section dividers",

  typography: {
    headingFont: "serif",
    bodyFont: "sans",
    nameFontSize: "text-2xl",
    sectionFontSize: "text-xs",
    bodyFontSize: "text-[11px]",
    nameWeight: "font-bold",
    sectionWeight: "font-bold",
  },

  spacing: {
    pagePadding: "p-8",
    sectionGap: "mb-4",
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

  colors: { ...neutralColors },
};

// Modern template - Left-aligned with accent bar dividers
export const modernTemplate: TemplateConfig = {
  id: "modern",
  name: "Modern",
  description: "Left-aligned with accent bar dividers",

  typography: {
    headingFont: "sans",
    bodyFont: "sans",
    nameFontSize: "text-2xl",
    sectionFontSize: "text-xs",
    bodyFontSize: "text-[11px]",
    nameWeight: "font-semibold",
    sectionWeight: "font-semibold",
  },

  spacing: {
    pagePadding: "p-8",
    sectionGap: "mb-4",
    itemGap: "mt-3",
    lineHeight: "leading-normal",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "accent",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
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

  colors: { ...neutralColors },
};

// Classic template - Traditional serif typography, elegant spacing
export const classicTemplate: TemplateConfig = {
  id: "classic",
  name: "Classic",
  description: "Elegant serif typography for traditional industries",

  typography: {
    headingFont: "serif",
    bodyFont: "serif",
    nameFontSize: "text-xl",
    sectionFontSize: "text-xs",
    bodyFontSize: "text-[11px]",
    nameWeight: "font-bold",
    sectionWeight: "font-bold",
  },

  spacing: {
    pagePadding: "p-10",
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

  colors: { ...neutralColors },
};

// Sidebar template - Two-column with dark sidebar
export const sidebarTemplate: TemplateConfig = {
  id: "sidebar",
  name: "Sidebar",
  description: "Two-column layout with sidebar for contact info",

  typography: {
    headingFont: "sans",
    bodyFont: "sans",
    nameFontSize: "text-xl",
    sectionFontSize: "text-[10px]",
    bodyFontSize: "text-[10px]",
    nameWeight: "font-bold",
    sectionWeight: "font-semibold",
  },

  spacing: {
    pagePadding: "p-0",
    sectionGap: "mb-4",
    itemGap: "mt-2",
    lineHeight: "leading-snug",
  },

  layout: {
    columns: 2,
    headerAlignment: "left",
    sectionDivider: "none",
    bulletStyle: "disc",
    showPhoto: true,
    sidebar: true,
    sidebarWidth: "w-[180px]",
    sidebarPosition: "left",
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
    sidebar: "#1f2937",
    accent: "#9ca3af",
  },
};

// Executive template - Premium design with generous spacing
export const executiveTemplate: TemplateConfig = {
  id: "executive",
  name: "Executive",
  description: "Premium design for senior professionals",

  typography: {
    headingFont: "serif",
    bodyFont: "sans",
    nameFontSize: "text-2xl",
    sectionFontSize: "text-xs",
    bodyFontSize: "text-[11px]",
    nameWeight: "font-bold",
    sectionWeight: "font-semibold",
  },

  spacing: {
    pagePadding: "p-10",
    sectionGap: "mb-5",
    itemGap: "mt-4",
    lineHeight: "leading-relaxed",
  },

  layout: {
    columns: 1,
    headerAlignment: "center",
    sectionDivider: "accent",
    bulletStyle: "disc",
    showPhoto: false,
    sidebar: false,
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

  colors: { ...neutralColors },
};

// Compact template - Dense layout for maximum content
export const compactTemplate: TemplateConfig = {
  id: "compact",
  name: "Compact",
  description: "Dense layout to fit more content",

  typography: {
    headingFont: "sans",
    bodyFont: "sans",
    nameFontSize: "text-lg",
    sectionFontSize: "text-[10px]",
    bodyFontSize: "text-[10px]",
    nameWeight: "font-semibold",
    sectionWeight: "font-semibold",
  },

  spacing: {
    pagePadding: "p-5",
    sectionGap: "mb-2",
    itemGap: "mt-1.5",
    lineHeight: "leading-tight",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "line",
    bulletStyle: "dash",
    showPhoto: false,
    sidebar: false,
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

  colors: { ...neutralColors },
};

// Creative template - Bold design with photo
export const creativeTemplate: TemplateConfig = {
  id: "creative",
  name: "Creative",
  description: "Bold design with photo for creatives",

  typography: {
    headingFont: "sans",
    bodyFont: "sans",
    nameFontSize: "text-3xl",
    sectionFontSize: "text-xs",
    bodyFontSize: "text-[11px]",
    nameWeight: "font-black",
    sectionWeight: "font-bold",
  },

  spacing: {
    pagePadding: "p-8",
    sectionGap: "mb-4",
    itemGap: "mt-3",
    lineHeight: "leading-normal",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "accent",
    bulletStyle: "circle",
    showPhoto: true,
    sidebar: false,
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

  colors: { ...neutralColors },
};

// Minimal template - Ultra-clean with no dividers
export const minimalTemplate: TemplateConfig = {
  id: "minimal",
  name: "Minimal",
  description: "Ultra-clean design with no dividers",

  typography: {
    headingFont: "sans",
    bodyFont: "sans",
    nameFontSize: "text-xl",
    sectionFontSize: "text-[10px]",
    bodyFontSize: "text-[11px]",
    nameWeight: "font-medium",
    sectionWeight: "font-medium",
  },

  spacing: {
    pagePadding: "p-8",
    sectionGap: "mb-5",
    itemGap: "mt-3",
    lineHeight: "leading-relaxed",
  },

  layout: {
    columns: 1,
    headerAlignment: "left",
    sectionDivider: "none",
    bulletStyle: "circle",
    showPhoto: false,
    sidebar: false,
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

  colors: { ...neutralColors },
};

// Template registry
export const templates: Record<string, TemplateConfig> = {
  professional: professionalTemplate,
  modern: modernTemplate,
  classic: classicTemplate,
  sidebar: sidebarTemplate,
  executive: executiveTemplate,
  compact: compactTemplate,
  creative: creativeTemplate,
  minimal: minimalTemplate,
};

// Get template by ID with fallback
export function getTemplate(id: string): TemplateConfig {
  return templates[id] || professionalTemplate;
}

// Get all templates as array for selection UI
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templates);
}

// Default font mapping from font ID to serif/sans type
export function getFontType(fontId: string): "serif" | "sans" {
  const serifFonts = ["georgia", "merriweather", "playfair", "lora"];
  return serifFonts.includes(fontId) ? "serif" : "sans";
}

// Get default heading font for a template as a font ID
export function getTemplateDefaultHeadingFont(templateId: string): string {
  const template = getTemplate(templateId);
  return template.typography.headingFont === "serif" ? "georgia" : "inter";
}

// Get default body font for a template as a font ID
export function getTemplateDefaultBodyFont(templateId: string): string {
  const template = getTemplate(templateId);
  return template.typography.bodyFont === "serif" ? "georgia" : "inter";
}
