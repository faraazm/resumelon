"use client";

import { ResumeData, TemplateConfig } from "./types";
import {
  Header,
  Section,
  Summary,
  ExperienceItem,
  EducationItem,
  SkillsDisplay,
  EmptyState,
  SidebarHeader,
  SidebarSection,
  SidebarContact,
  SidebarSkills,
  SidebarEducation,
} from "./components";

interface TemplateRendererProps {
  data: ResumeData;
  template: TemplateConfig;
  className?: string;
}

export function TemplateRenderer({ data, template, className = "" }: TemplateRendererProps) {
  const { spacing, sections: sectionConfig, layout, colors } = template;

  // Check if there's any content
  const fullName = [data.personalDetails?.firstName, data.personalDetails?.lastName]
    .filter(Boolean)
    .join(" ");

  const hasContent =
    fullName ||
    data.personalDetails?.jobTitle ||
    data.summary ||
    (data.experience && data.experience.length > 0) ||
    (data.education && data.education.length > 0) ||
    (data.skills && data.skills.length > 0);

  if (!hasContent) {
    return (
      <div className={`h-full ${className}`}>
        <EmptyState />
      </div>
    );
  }

  // Render sections in the order specified by template
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return data.summary ? (
          <Section
            key="summary"
            title="Summary"
            template={template}
            show={sectionConfig.visible.summary}
          >
            <Summary summary={data.summary} template={template} />
          </Section>
        ) : null;

      case "experience":
        return data.experience && data.experience.length > 0 ? (
          <Section
            key="experience"
            title="Experience"
            template={template}
            show={sectionConfig.visible.experience}
          >
            {data.experience.map((job, index) => (
              <ExperienceItem
                key={job.id || index}
                job={job}
                template={template}
                isFirst={index === 0}
              />
            ))}
          </Section>
        ) : null;

      case "education":
        return data.education && data.education.length > 0 ? (
          <Section
            key="education"
            title="Education"
            template={template}
            show={sectionConfig.visible.education}
          >
            {data.education.map((edu, index) => (
              <EducationItem
                key={edu.id || index}
                edu={edu}
                template={template}
                isFirst={index === 0}
              />
            ))}
          </Section>
        ) : null;

      case "skills":
        return data.skills && data.skills.length > 0 ? (
          <Section
            key="skills"
            title="Skills"
            template={template}
            show={sectionConfig.visible.skills}
          >
            <SkillsDisplay skills={data.skills} template={template} />
          </Section>
        ) : null;

      default:
        return null;
    }
  };

  // Sidebar layout
  if (layout.sidebar) {
    const sidebarSections = sectionConfig.sidebarSections || ["contact", "skills", "education"];
    const mainSections = sectionConfig.mainSections || ["summary", "experience"];

    return (
      <div className={`flex h-full ${className}`}>
        {/* Sidebar */}
        <div
          className={`${layout.sidebarWidth || "w-[180px]"} shrink-0 p-5 ${spacing.lineHeight}`}
          style={{ backgroundColor: colors.sidebar }}
        >
          {/* Photo placeholder */}
          {layout.showPhoto && (
            <div className="mb-4 flex justify-center">
              <div
                className="h-20 w-20 rounded-full bg-slate-600 flex items-center justify-center text-2xl text-white font-medium"
              >
                {data.personalDetails?.firstName?.charAt(0) || ""}
                {data.personalDetails?.lastName?.charAt(0) || ""}
              </div>
            </div>
          )}

          {/* Name in sidebar */}
          <SidebarHeader data={data} template={template} />

          {/* Sidebar sections */}
          {sidebarSections.includes("contact") && (
            <SidebarSection title="Contact" template={template}>
              <SidebarContact contact={data.contact} template={template} />
            </SidebarSection>
          )}

          {sidebarSections.includes("skills") && data.skills && data.skills.length > 0 && (
            <SidebarSection title="Skills" template={template}>
              <SidebarSkills skills={data.skills} template={template} />
            </SidebarSection>
          )}

          {sidebarSections.includes("education") && data.education && data.education.length > 0 && (
            <SidebarSection title="Education" template={template}>
              <SidebarEducation education={data.education} template={template} />
            </SidebarSection>
          )}
        </div>

        {/* Main content */}
        <div className={`flex-1 p-6 ${spacing.lineHeight}`}>
          {/* Main sections */}
          {mainSections.map((sectionId) => {
            if (sectionId === "summary" && data.summary) {
              return (
                <Section key="summary" title="Summary" template={template} show={true}>
                  <Summary summary={data.summary} template={template} />
                </Section>
              );
            }
            if (sectionId === "experience" && data.experience?.length > 0) {
              return (
                <Section key="experience" title="Experience" template={template} show={true}>
                  {data.experience.map((job, index) => (
                    <ExperienceItem
                      key={job.id || index}
                      job={job}
                      template={template}
                      isFirst={index === 0}
                    />
                  ))}
                </Section>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  // Standard single-column layout
  return (
    <div className={`${spacing.pagePadding} ${spacing.lineHeight} ${className}`}>
      {/* Header with optional photo */}
      <div className={`${spacing.sectionGap} ${layout.showPhoto ? "flex items-start gap-4" : ""}`}>
        {layout.showPhoto && (
          <div
            className="h-16 w-16 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-500 font-medium"
          >
            {data.personalDetails?.firstName?.charAt(0) || ""}
            {data.personalDetails?.lastName?.charAt(0) || ""}
          </div>
        )}
        <Header data={data} template={template} />
      </div>

      {/* Render sections in template-specified order */}
      {sectionConfig.order.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
