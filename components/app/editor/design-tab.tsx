"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  getAllTemplates,
  getTemplate,
  getTemplateDefaultHeadingFont,
  getTemplateDefaultBodyFont,
  TemplateRenderer,
  TemplateConfig,
  ResumeData,
} from "@/lib/templates";

interface DesignTabProps {
  resumeData: any;
  onUpdate: (section: string, data: any) => void;
}

// Get templates from our template system
const templateOptions = getAllTemplates();

// Sample resume data for template previews
const sampleResumeData: ResumeData = {
  personalDetails: {
    firstName: "Sarah",
    lastName: "Johnson",
    jobTitle: "Senior Software Engineer",
    photo: null,
  },
  contact: {
    email: "sarah@example.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/sarah",
    location: "San Francisco, CA",
  },
  summary: "Experienced software engineer with 8+ years building scalable web applications. Expert in React, Node.js, and cloud architecture.",
  experience: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2020",
      endDate: "",
      current: true,
      bullets: [
        "Led development of microservices architecture",
        "Mentored team of 5 junior developers",
      ],
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      startDate: "2017",
      endDate: "2020",
      current: false,
      bullets: [
        "Built React frontend serving 100k users",
        "Implemented CI/CD pipeline",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "B.S. Computer Science",
      school: "Stanford University",
      startDate: "2013",
      endDate: "2017",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "AWS", "Python", "PostgreSQL"],
};

const sansSerifFonts = [
  { id: "inter", name: "Inter", style: "font-sans" },
  { id: "roboto", name: "Roboto", style: "font-sans" },
  { id: "lato", name: "Lato", style: "font-sans" },
  { id: "opensans", name: "Open Sans", style: "font-sans" },
  { id: "montserrat", name: "Montserrat", style: "font-sans" },
  { id: "raleway", name: "Raleway", style: "font-sans" },
  { id: "sourcesans", name: "Source Sans", style: "font-sans" },
  { id: "poppins", name: "Poppins", style: "font-sans" },
  { id: "nunito", name: "Nunito", style: "font-sans" },
];

const serifFonts = [
  { id: "merriweather", name: "Merriweather", style: "font-serif" },
  { id: "playfair", name: "Playfair Display", style: "font-serif" },
  { id: "lora", name: "Lora", style: "font-serif" },
  { id: "crimson", name: "Crimson Text", style: "font-serif" },
  { id: "librebaskerville", name: "Libre Baskerville", style: "font-serif" },
  { id: "garamond", name: "EB Garamond", style: "font-serif" },
];

const spacingOptions = [
  { id: "compact", name: "Compact" },
  { id: "normal", name: "Normal" },
  { id: "spacious", name: "Spacious" },
];

const accentColors = [
  { id: "#000000", name: "Black" },
  { id: "#1e3a5f", name: "Navy" },
  { id: "#2563eb", name: "Blue" },
  { id: "#0d9488", name: "Teal" },
  { id: "#059669", name: "Green" },
  { id: "#7c3aed", name: "Purple" },
  { id: "#dc2626", name: "Red" },
  { id: "#ea580c", name: "Orange" },
];

import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
} from "@/lib/pdf-constants";

export function DesignTab({ resumeData, onUpdate }: DesignTabProps) {
  const currentTemplate = resumeData.template || "professional";
  const template = getTemplate(currentTemplate);
  const templateGridRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.25);

  const currentStyle = resumeData.style || {
    font: "inter",
    spacing: "normal",
    accentColor: "#000000",
  };

  // Get default fonts based on template
  const defaultHeadingFont = getTemplateDefaultHeadingFont(currentTemplate);
  const defaultBodyFont = getTemplateDefaultBodyFont(currentTemplate);

  const updateStyle = (field: string, value: any) => {
    onUpdate("style", { ...currentStyle, [field]: value });
  };

  // When selecting a new template, reset all style overrides to use template defaults
  const selectTemplate = (templateId: string) => {
    const newTemplate = getTemplate(templateId);
    // Reset all style customizations to template defaults
    const newStyle = {
      font: newTemplate.typography.bodyFont,
      headingFont: newTemplate.typography.headingFont,
      bodyFont: newTemplate.typography.bodyFont,
      spacing: "normal", // Reset to normal, template controls actual spacing
      accentColor: newTemplate.colors.accent,
      showPhoto: newTemplate.layout.showPhoto,
      showDividers: newTemplate.layout.sectionDivider !== "none",
    };
    // Update both template and reset style in one go
    onUpdate("template", templateId);
    onUpdate("style", newStyle);
  };

  // Calculate preview scale based on container width
  useEffect(() => {
    const calculateScale = () => {
      if (templateGridRef.current) {
        const gridWidth = templateGridRef.current.clientWidth;
        // For 4-column grid, each cell is roughly gridWidth/4 - gaps
        // For 2-column grid (mobile), each cell is roughly gridWidth/2 - gaps
        const isMobile = window.innerWidth < 768;
        const columns = isMobile ? 2 : 4;
        const gap = 12; // gap-3 = 12px
        const cellWidth = (gridWidth - gap * (columns - 1)) / columns;
        // Scale to fit the cell width
        const scale = cellWidth / LETTER_WIDTH_PX;
        setPreviewScale(scale);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  // When template changes, update the fonts to match template defaults (unless user has overridden)
  useEffect(() => {
    // Only update if user hasn't explicitly set fonts
    if (!currentStyle.headingFont && !currentStyle.bodyFont) {
      // Don't update - let the defaults flow through
    }
  }, [currentTemplate]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-3xl p-4 md:p-6 space-y-8">
          {/* Templates */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Template
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose an ATS-optimized template
              </p>
            </div>

            <div ref={templateGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateOptions.map((tmpl) => {
                const isSelected = currentTemplate === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl.id)}
                    className={`group relative overflow-hidden rounded-lg border-2 cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {/* Actual Template Preview - Scaled to fit container */}
                    <div className="aspect-[8.5/11] bg-white overflow-hidden relative w-full">
                      <div
                        className="absolute top-0 left-0 origin-top-left"
                        style={{
                          width: LETTER_WIDTH_PX,
                          height: LETTER_HEIGHT_PX,
                          transform: `scale(${previewScale})`,
                        }}
                      >
                        <TemplateRenderer
                          data={sampleResumeData}
                          template={tmpl}
                        />
                      </div>
                    </div>

                    {/* Selected Check */}
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-0.5 text-white">
                        <CheckIcon className="h-2.5 w-2.5" />
                      </div>
                    )}

                    {/* Label */}
                    <div className="border-t bg-background px-2 py-1.5">
                      <p className="text-xs font-medium text-foreground">
                        {tmpl.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Layout Options */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Layout Options
              </h2>
              <p className="text-sm text-muted-foreground">
                Customize layout elements
              </p>
            </div>

            <div className="space-y-4">
              {/* Show Photo Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-photo">Show Photo</Label>
                  <p className="text-xs text-muted-foreground">
                    Display a photo placeholder in your resume
                  </p>
                </div>
                <Switch
                  id="show-photo"
                  checked={currentStyle.showPhoto ?? template.layout.showPhoto}
                  onCheckedChange={(checked) => updateStyle("showPhoto", checked)}
                />
              </div>

              {/* Show Dividers Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-dividers">Show Section Dividers</Label>
                  <p className="text-xs text-muted-foreground">
                    Display horizontal lines between sections
                  </p>
                </div>
                <Switch
                  id="show-dividers"
                  checked={currentStyle.showDividers ?? (template.layout.sectionDivider !== "none")}
                  onCheckedChange={(checked) => updateStyle("showDividers", checked)}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Typography */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Typography
              </h2>
              <p className="text-sm text-muted-foreground">
                Customize fonts (defaults based on template)
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label>Heading Font</Label>
                <Select
                  value={currentStyle.headingFont || defaultHeadingFont}
                  onValueChange={(value) => updateStyle("headingFont", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Sans Serif</div>
                    {sansSerifFonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span className={font.style}>{font.name}</span>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-1">Serif</div>
                    {serifFonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span className={font.style}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select
                  value={currentStyle.bodyFont || defaultBodyFont}
                  onValueChange={(value) => updateStyle("bodyFont", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Sans Serif</div>
                    {sansSerifFonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span className={font.style}>{font.name}</span>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-1">Serif</div>
                    {serifFonts.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span className={font.style}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Spacing */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Spacing</h2>
              <p className="text-sm text-muted-foreground">
                Adjust the density of your resume
              </p>
            </div>

            <div className="flex gap-2">
              {spacingOptions.map((option) => {
                const isSelected = currentStyle.spacing === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => updateStyle("spacing", option.id)}
                    className={`flex-1 rounded-lg border-2 px-3 md:px-4 py-2 md:py-3 text-sm font-medium cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {option.name}
                  </button>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Accent Color */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Accent Color
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose a color for section headings and dividers
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {accentColors.map((color) => {
                const isSelected = currentStyle.accentColor === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => updateStyle("accentColor", color.id)}
                    className={`relative w-10 h-10 rounded-full cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.id }}
                    title={color.name}
                  >
                    {isSelected && (
                      <CheckIcon
                        className="absolute inset-0 m-auto h-5 w-5"
                        style={{ color: color.id === "#000000" ? "#ffffff" : "#ffffff" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ATS Notice */}
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
            <p className="text-xs text-emerald-800">
              <span className="font-medium">ATS-Optimized:</span> All templates are designed to pass Applicant Tracking Systems with clean, parseable formatting.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
