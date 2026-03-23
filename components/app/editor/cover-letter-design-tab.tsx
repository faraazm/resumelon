"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  getAllTemplates,
  getTemplate,
  getTemplateDefaultHeadingFont,
  getTemplateDefaultBodyFont,
} from "@/lib/templates";
import { TemplateConfig } from "@/lib/templates/types";
import { CoverLetterRenderer, CoverLetterData } from "@/lib/cover-letter/CoverLetterRenderer";
import { LETTER_WIDTH_PX, LETTER_HEIGHT_PX } from "@/lib/pdf-constants";
import {
  DesignSection,
  DesignSeparator,
  FontSelect,
  SpacingSelector,
  ColorPicker,
  accentColors,
  backgroundColors,
} from "./design-shared";

interface CoverLetterDesignTabProps {
  coverLetterData: any;
  onUpdate: (section: string, data: any) => void;
}

const templateOptions = getAllTemplates();

const sampleCoverLetterData: CoverLetterData = {
  personalDetails: {
    firstName: "Sarah",
    lastName: "Johnson",
    jobTitle: "Senior Software Engineer",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    address: "San Francisco, CA",
  },
  letterContent: {
    companyName: "Tech Corp",
    hiringManagerName: "Hiring Manager",
    content:
      "<p>Dear Hiring Manager,</p><p>I am writing to express my strong interest in the Senior Software Engineer position at Tech Corp. With over 8 years of experience building scalable web applications and leading cross-functional teams, I am confident in my ability to make a significant impact on your engineering team.</p><p>In my current role, I led the development of a microservices architecture serving over 2 million daily active users, reducing latency by 40%. I also mentored a team of 5 junior developers and established code review standards across the organization.</p><p>I am particularly excited about Tech Corp's mission to democratize access to technology. I believe my experience in building high-performance, user-facing products aligns perfectly with your goals.</p><p>Sincerely,<br/>Sarah Johnson</p>",
  },
};

function buildPreviewTemplate(templateId: string): { template: TemplateConfig; headingFontId: string; bodyFontId: string } {
  const base = getTemplate(templateId);
  return {
    template: base,
    headingFontId: base.typography.headingFont,
    bodyFontId: base.typography.bodyFont,
  };
}

export function CoverLetterDesignTab({ coverLetterData, onUpdate }: CoverLetterDesignTabProps) {
  const currentTemplate = coverLetterData.template || "ats-classic";
  const templateGridRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.25);

  const currentStyle = coverLetterData.style || {
    font: "inter",
    spacing: "normal",
    accentColor: "#000000",
  };

  const defaultHeadingFont = getTemplateDefaultHeadingFont(currentTemplate);
  const defaultBodyFont = getTemplateDefaultBodyFont(currentTemplate);

  const updateStyle = (field: string, value: any) => {
    onUpdate("style", { ...currentStyle, [field]: value });
  };

  const selectTemplate = (templateId: string) => {
    const t = getTemplate(templateId);
    const newStyle = {
      font: t.typography.bodyFont,
      headingFont: t.typography.headingFont,
      bodyFont: t.typography.bodyFont,
      spacing: "normal",
      accentColor: t.colors.accent,
    };
    onUpdate("template", templateId);
    onUpdate("style", newStyle);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (templateGridRef.current) {
        const gridWidth = templateGridRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;
        const columns = isMobile ? 2 : 4;
        const gap = 12;
        const cellWidth = (gridWidth - gap * (columns - 1)) / columns;
        setPreviewScale(cellWidth / LETTER_WIDTH_PX);
      }
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-3xl p-4 md:p-6 space-y-8">
          {/* Templates — identical card layout to resume DesignTab */}
          <DesignSection title="Template" description="Choose a template for your cover letter">
            <div ref={templateGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateOptions.map((tmpl) => {
                const isSelected = currentTemplate === tmpl.id;
                const { template, headingFontId, bodyFontId } = buildPreviewTemplate(tmpl.id);

                return (
                  <motion.button
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`group relative overflow-hidden rounded-md cursor-pointer text-left transition-all duration-200 ${
                      isSelected ? "border-2 border-primary ring-2 ring-primary/20" : "border border-border hover:border-primary/30"
                    }`}
                  >
                    {/* Scaled preview — same aspect ratio + structure as resume cards */}
                    <div className="aspect-[8.5/11] bg-white overflow-hidden relative w-full">
                      <div
                        className="absolute top-0 left-0 origin-top-left"
                        style={{
                          width: LETTER_WIDTH_PX,
                          height: LETTER_HEIGHT_PX,
                          transform: `scale(${previewScale})`,
                        }}
                      >
                        <CoverLetterRenderer
                          data={sampleCoverLetterData}
                          template={template}
                          headingFontId={headingFontId}
                          bodyFontId={bodyFontId}
                        />
                      </div>

                      {/* ATS Badge */}
                      <div className="absolute right-0 bottom-0 flex items-center gap-0.5 rounded-tl-[3px] bg-emerald-600 px-1.5 py-[3px]">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[9px] font-semibold text-white leading-none">ATS</span>
                      </div>
                    </div>

                    {/* Selected Check */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-1.5 top-1.5 rounded-full bg-primary p-0.5 text-white"
                        >
                          <CheckIcon className="h-2.5 w-2.5" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Label */}
                    <div className="border-t bg-background px-2 py-1.5">
                      <p className="text-xs font-medium text-foreground">{tmpl.name}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </DesignSection>

          <DesignSeparator />

          {/* Typography */}
          <DesignSection title="Typography" description="Customize fonts (defaults based on template)">
            <div className="flex flex-wrap gap-4">
              <FontSelect
                label="Heading Font"
                value={currentStyle.headingFont || defaultHeadingFont}
                onChange={(v) => updateStyle("headingFont", v)}
              />
              <FontSelect
                label="Body Font"
                value={currentStyle.bodyFont || defaultBodyFont}
                onChange={(v) => updateStyle("bodyFont", v)}
              />
            </div>
          </DesignSection>

          <DesignSeparator />

          {/* Spacing */}
          <DesignSection title="Spacing" description="Adjust the density of your cover letter">
            <SpacingSelector
              value={currentStyle.spacing || "normal"}
              onChange={(v) => updateStyle("spacing", v)}
            />
          </DesignSection>

          <DesignSeparator />

          {/* Background Color */}
          <DesignSection title="Background Color" description="Choose a background color for your cover letter">
            <ColorPicker
              colors={backgroundColors}
              value={currentStyle.backgroundColor || "#ffffff"}
              onChange={(v) => updateStyle("backgroundColor", v)}
              useWhiteCheck
            />
          </DesignSection>

          <DesignSeparator />

          {/* Accent Color */}
          <DesignSection title="Accent Color" description="Choose a color for your name and headings">
            <ColorPicker
              colors={accentColors}
              value={currentStyle.accentColor || "#000000"}
              onChange={(v) => updateStyle("accentColor", v)}
            />
          </DesignSection>

        </div>
      </ScrollArea>
    </div>
  );
}
