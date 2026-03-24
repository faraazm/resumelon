import { ResumeData, TemplateConfig } from "@/lib/templates/types";

export type BlockType =
  | "header"          // Name + title + contact + optional photo
  | "section-header"  // "Experience", "Education", etc. with divider
  | "summary"         // Summary paragraph or HTML
  | "experience-meta" // Job title + company + date row (no bullets)
  | "bullet"          // Single <li> from a job's bullet list
  | "education-item"  // Degree + school + date (legacy, kept for compatibility)
  | "education-degree" // Just the degree line
  | "education-school" // School + dates line
  | "skills"          // Entire skills display (legacy)
  | "skill-row"       // A row/chunk of skills for finer pagination
  | "sidebar";        // Full sidebar content (sidebar templates only, page 1)

export interface Block {
  id: string;              // Unique key (e.g., "exp-0", "bullet-0-2")
  type: BlockType;
  data: Record<string, unknown>; // Type-specific payload
  template: TemplateConfig;
  keepWithNext: boolean;   // If true, must be on same page as next block
  jobId?: string;          // For experience-meta and bullet blocks
  isFirst?: boolean;       // Whether this is the first item in its section (affects spacing)
  measuredHeight: number;  // Filled by BlockMeasurer (0 until measured)
}

export interface PageLayout {
  pageIndex: number;
  blocks: Block[];
}

// Data payloads for each block type
export interface HeaderBlockData {
  personalDetails: ResumeData["personalDetails"];
  contact: ResumeData["contact"];
}

export interface SectionHeaderBlockData {
  title: string;
}

export interface SummaryBlockData {
  summary: string;
}

export interface ExperienceMetaBlockData {
  job: ResumeData["experience"][0];
}

export interface BulletBlockData {
  text: string;
}

export interface EducationItemBlockData {
  edu: ResumeData["education"][0];
}

// Fine-grained education blocks
export interface EducationDegreeBlockData {
  degree: string;
  field: string;
}

export interface EducationSchoolBlockData {
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface SkillsBlockData {
  skills: string[];
}

// Fine-grained skills block
export interface SkillRowBlockData {
  skills: string[];
}

export interface SidebarBlockData {
  personalDetails: ResumeData["personalDetails"];
  contact: ResumeData["contact"];
  skills: string[];
  education: ResumeData["education"];
}
