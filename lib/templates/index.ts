// Export types
export type {
  ResumeData,
  TemplateConfig,
  StyleOverrides,
  TemplateRenderProps,
} from "./types";

// Export constants
export {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_PADDING,
  CONTENT_WIDTH,
  CONTENT_HEIGHT,
} from "./types";

// Export templates
export {
  templates,
  getTemplate,
  getAllTemplates,
  getFontType,
  getTemplateDefaultHeadingFont,
  getTemplateDefaultBodyFont,
  professionalTemplate,
  modernTemplate,
  classicTemplate,
  sidebarTemplate,
  executiveTemplate,
  compactTemplate,
  creativeTemplate,
  minimalTemplate,
} from "./templates";

// Export components
export {
  Header,
  Section,
  SectionHeader,
  Summary,
  ExperienceItem,
  EducationItem,
  BulletList,
  SkillsDisplay,
  EmptyState,
  // Sidebar components
  SidebarHeader,
  SidebarSection,
  SidebarContact,
  SidebarSkills,
  SidebarEducation,
} from "./components";

// Export renderer
export { TemplateRenderer } from "./TemplateRenderer";
