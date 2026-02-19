// Canonical Resume JSON Schema - Single Source of Truth
export interface ResumeData {
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    photo?: string | null;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

// Template Configuration Schema
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;

  // Typography tokens
  typography: {
    headingFont: "serif" | "sans";
    bodyFont: "serif" | "sans";
    nameFontSize: string;      // e.g., "text-2xl"
    sectionFontSize: string;   // e.g., "text-sm"
    bodyFontSize: string;      // e.g., "text-xs"
    nameWeight: string;        // e.g., "font-bold"
    sectionWeight: string;     // e.g., "font-semibold"
  };

  // Spacing tokens
  spacing: {
    pagePadding: string;       // e.g., "p-8"
    sectionGap: string;        // e.g., "mb-4"
    itemGap: string;           // e.g., "mt-3"
    lineHeight: string;        // e.g., "leading-relaxed"
  };

  // Layout configuration
  layout: {
    columns: 1 | 2;
    headerAlignment: "left" | "center";
    sectionDivider: "line" | "accent" | "none";
    bulletStyle: "disc" | "dash" | "circle";
    showPhoto: boolean;
    sidebar: boolean;
    sidebarWidth?: string;     // e.g., "w-[180px]"
    sidebarPosition?: "left" | "right";
  };

  // Section ordering and visibility
  sections: {
    order: ("summary" | "experience" | "education" | "skills")[];
    visible: {
      summary: boolean;
      experience: boolean;
      education: boolean;
      skills: boolean;
    };
    sidebarSections?: string[];  // Sections to show in sidebar
    mainSections?: string[];     // Sections to show in main area
  };

  // Color scheme
  colors: {
    heading: string;           // e.g., "#000000"
    body: string;              // e.g., "#374151"
    muted: string;             // e.g., "#6b7280"
    divider: string;           // e.g., "#000000"
    sidebar: string;           // e.g., "#1e293b"
    accent: string;            // e.g., "#3b82f6"
  };
}

// Style overrides the user can customize
export interface StyleOverrides {
  font: string;                // User's font choice (legacy, for backward compatibility)
  headingFont?: string;        // Font for headings
  bodyFont?: string;           // Font for body text
  spacing: "compact" | "normal" | "spacious";
  accentColor: string;         // User's accent color choice
  showPhoto?: boolean;         // Whether to show photo
  showDividers?: boolean;      // Whether to show section dividers
}

// Combined props for rendering
export interface TemplateRenderProps {
  data: ResumeData;
  template: TemplateConfig;
  style: StyleOverrides;
  scale?: number;              // For preview scaling
}

// Page dimensions (US Letter in pixels at 96 DPI)
export const PAGE_WIDTH = 612;   // 8.5 inches * 72 DPI
export const PAGE_HEIGHT = 792;  // 11 inches * 72 DPI
export const PAGE_PADDING = 48;  // 0.5 inch margins
export const CONTENT_WIDTH = PAGE_WIDTH - (PAGE_PADDING * 2);
export const CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_PADDING * 2);

// Font family mapping - maps font IDs to CSS font-family values using CSS variables
export const FONT_FAMILIES: Record<string, string> = {
  // Sans-serif fonts
  inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  roboto: "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
  lato: "var(--font-lato), ui-sans-serif, system-ui, sans-serif",
  opensans: "var(--font-opensans), ui-sans-serif, system-ui, sans-serif",
  // Serif fonts
  merriweather: "var(--font-merriweather), ui-serif, serif",
  playfair: "var(--font-playfair), ui-serif, serif",
  lora: "var(--font-lora), ui-serif, serif",
};

// Get font family from font ID
export function getFontFamily(fontId: string): string {
  return FONT_FAMILIES[fontId] || FONT_FAMILIES.inter;
}
