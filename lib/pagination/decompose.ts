import { ResumeData, TemplateConfig } from "@/lib/templates/types";
import {
  Block,
  HeaderBlockData,
  SectionHeaderBlockData,
  SummaryBlockData,
  ExperienceMetaBlockData,
  BulletBlockData,
  EducationItemBlockData,
  EducationDegreeBlockData,
  EducationSchoolBlockData,
  SkillsBlockData,
  SkillRowBlockData,
  SidebarBlockData,
} from "./types";

/**
 * Decompose resume data into an ordered array of atomic blocks.
 * Pure function: data + template → Block[]
 */
export function decomposeBlocks(
  data: ResumeData,
  template: TemplateConfig,
  sectionOrder?: string[]
): Block[] {
  const blocks: Block[] = [];
  const isSidebar = template.layout.sidebar;

  // For sidebar layouts, emit a sidebar block first
  if (isSidebar) {
    const sidebarSections = template.sections.sidebarSections || ["contact", "skills", "education"];
    blocks.push({
      id: "sidebar",
      type: "sidebar",
      data: {
        personalDetails: data.personalDetails,
        contact: data.contact,
        skills: sidebarSections.includes("skills") ? data.skills : [],
        education: sidebarSections.includes("education") ? data.education : [],
      } satisfies SidebarBlockData as unknown as Record<string, unknown>,
      template,
      keepWithNext: false,
      measuredHeight: 0,
    });

    // For sidebar layouts, only decompose main sections
    const mainSections = template.sections.mainSections || ["summary", "experience"];
    for (const sectionId of mainSections) {
      decomposeSection(blocks, sectionId, data, template);
    }
  } else {
    // Standard layout: header + all sections
    blocks.push({
      id: "header",
      type: "header",
      data: {
        personalDetails: data.personalDetails,
        contact: data.contact,
      } satisfies HeaderBlockData as unknown as Record<string, unknown>,
      template,
      keepWithNext: false,
      measuredHeight: 0,
    });

    const order = sectionOrder
      ? sectionOrder.filter((s) =>
          ["summary", "experience", "education", "skills"].includes(s)
        )
      : template.sections.order;

    for (const sectionId of order) {
      // Check visibility
      const visible = template.sections.visible[sectionId as keyof typeof template.sections.visible];
      if (visible === false) continue;
      decomposeSection(blocks, sectionId, data, template);
    }
  }

  return blocks;
}

function decomposeSection(
  blocks: Block[],
  sectionId: string,
  data: ResumeData,
  template: TemplateConfig
) {
  switch (sectionId) {
    case "summary":
      if (!data.summary) return;
      blocks.push({
        id: "section-header-summary",
        type: "section-header",
        data: { title: "Summary" } satisfies SectionHeaderBlockData as unknown as Record<string, unknown>,
        template,
        keepWithNext: true,
        measuredHeight: 0,
      });
      blocks.push({
        id: "summary",
        type: "summary",
        data: { summary: data.summary } satisfies SummaryBlockData as unknown as Record<string, unknown>,
        template,
        keepWithNext: false,
        measuredHeight: 0,
      });
      break;

    case "experience":
      if (!data.experience || data.experience.length === 0) return;
      blocks.push({
        id: "section-header-experience",
        type: "section-header",
        data: { title: "Experience" } satisfies SectionHeaderBlockData as unknown as Record<string, unknown>,
        template,
        keepWithNext: true,
        measuredHeight: 0,
      });
      data.experience.forEach((job, jobIndex) => {
        const jobId = job.id || `job-${jobIndex}`;
        blocks.push({
          id: `exp-meta-${jobIndex}`,
          type: "experience-meta",
          data: { job } satisfies ExperienceMetaBlockData as unknown as Record<string, unknown>,
          template,
          keepWithNext: true,
          jobId,
          isFirst: jobIndex === 0,
          measuredHeight: 0,
        });
        if (job.bullets && job.bullets.length > 0) {
          job.bullets.forEach((bullet, bulletIndex) => {
            // Skip empty bullets
            const text = bullet.replace(/<[^>]+>/g, "").trim();
            if (!text) return;
            blocks.push({
              id: `bullet-${jobIndex}-${bulletIndex}`,
              type: "bullet",
              data: { text: bullet } satisfies BulletBlockData as unknown as Record<string, unknown>,
              template,
              keepWithNext: false,
              jobId,
              measuredHeight: 0,
            });
          });
        }
      });
      break;

    case "education":
      if (!data.education || data.education.length === 0) return;
      blocks.push({
        id: "section-header-education",
        type: "section-header",
        data: { title: "Education" } satisfies SectionHeaderBlockData as unknown as Record<string, unknown>,
        template,
        keepWithNext: true,
        measuredHeight: 0,
      });
      data.education.forEach((edu, index) => {
        // Fine-grained: degree line (keeps with school line)
        blocks.push({
          id: `edu-degree-${index}`,
          type: "education-degree",
          data: {
            degree: edu.degree || "",
            field: "", // Field not in current schema
          } satisfies EducationDegreeBlockData as unknown as Record<string, unknown>,
          template,
          keepWithNext: true, // Degree must stay with school
          isFirst: index === 0,
          measuredHeight: 0,
        });
        // Fine-grained: school + dates line
        blocks.push({
          id: `edu-school-${index}`,
          type: "education-school",
          data: {
            school: edu.school || "",
            location: "", // Location not in current schema
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            current: false, // Current not in current schema
          } satisfies EducationSchoolBlockData as unknown as Record<string, unknown>,
          template,
          keepWithNext: false,
          measuredHeight: 0,
        });
      });
      break;

    case "skills":
      if (!data.skills || data.skills.length === 0) return;
      blocks.push({
        id: "section-header-skills",
        type: "section-header",
        data: { title: "Skills" } satisfies SectionHeaderBlockData as unknown as Record<string, unknown>,
        template,
        keepWithNext: true,
        measuredHeight: 0,
      });
      blocks.push({
        id: "skills",
        type: "skills",
        data: { skills: data.skills } satisfies SkillsBlockData as unknown as Record<string, unknown>,
        template,
        keepWithNext: false,
        measuredHeight: 0,
      });
      break;
  }
}
