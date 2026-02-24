"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/sarahjohnson",
    location: "San Francisco, CA",
  },
  summary:
    "Results-driven software engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expert in React, Node.js, and cloud architecture with a proven track record of delivering high-impact products.",
  experience: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "",
      current: true,
      bullets: [
        "Led development of microservices architecture serving 2M+ daily active users, reducing latency by 40%",
        "Mentored team of 5 junior developers and established code review standards across the engineering org",
        "Designed and implemented real-time data pipeline processing 500K events per second using Kafka and Redis",
      ],
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      current: false,
      bullets: [
        "Built React frontend serving 100K+ users with 99.9% uptime and sub-200ms page load times",
        "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
        "Developed RESTful APIs handling 10K requests per minute with comprehensive test coverage",
      ],
    },
    {
      id: "3",
      title: "Frontend Developer",
      company: "Digital Agency Co.",
      location: "Austin, TX",
      startDate: "Mar 2016",
      endDate: "May 2018",
      current: false,
      bullets: [
        "Developed and maintained responsive web applications using React and TypeScript for 20+ clients",
        "Collaborated with design team to implement pixel-perfect UI components and design systems",
        "Optimized application performance achieving 95+ Lighthouse scores across all client projects",
      ],
    },
    {
      id: "4",
      title: "Software Development Intern",
      company: "InnovateTech",
      location: "Seattle, WA",
      startDate: "Jun 2015",
      endDate: "Feb 2016",
      current: false,
      bullets: [
        "Built internal dashboard tools using Python and Flask, automating manual reporting workflows",
        "Wrote unit and integration tests improving code coverage from 45% to 82%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "B.S. Computer Science",
      school: "Stanford University",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "AWS",
    "Python",
    "PostgreSQL",
    "Docker",
    "GraphQL",
    "Kubernetes",
    "Redis",
  ],
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

const backgroundColors = [
  { id: "#ffffff", name: "White" },
  { id: "#fafafa", name: "Snow" },
  { id: "#f5f5f4", name: "Warm Gray" },
  { id: "#faf5ff", name: "Lavender" },
  { id: "#f0f9ff", name: "Ice Blue" },
  { id: "#f0fdf4", name: "Mint" },
  { id: "#fffbeb", name: "Cream" },
  { id: "#fff1f2", name: "Blush" },
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
                          headingFontId={tmpl.typography.headingFont}
                          bodyFontId={tmpl.typography.bodyFont}
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
                      <p className="text-xs font-medium text-foreground">
                        {tmpl.name}
                      </p>
                    </div>
                  </motion.button>
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-photo"
                  checked={currentStyle.showPhoto ?? template.layout.showPhoto}
                  onCheckedChange={(checked) => updateStyle("showPhoto", checked)}
                />
                <Label htmlFor="show-photo">Show Photo</Label>
              </div>

              {/* Show Dividers Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-dividers"
                  checked={currentStyle.showDividers ?? (template.layout.sectionDivider !== "none")}
                  onCheckedChange={(checked) => updateStyle("showDividers", checked)}
                />
                <Label htmlFor="show-dividers">Show Section Dividers</Label>
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
                  <motion.button
                    key={option.id}
                    onClick={() => updateStyle("spacing", option.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={`flex-1 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm font-medium cursor-pointer transition-colors duration-200 ${
                      isSelected
                        ? "border-2 border-primary bg-primary/5 text-primary"
                        : "border border-border bg-background text-muted-foreground hover:border-foreground/20"
                    }`}
                  >
                    {option.name}
                  </motion.button>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Background Color */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Background Color
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose a background color for your resume
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {backgroundColors.map((color) => {
                const isSelected = (currentStyle.backgroundColor || "#ffffff") === color.id;
                return (
                  <motion.button
                    key={color.id}
                    onClick={() => updateStyle("backgroundColor", color.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: isSelected
                        ? `0 0 0 2px hsl(var(--background)), 0 0 0 3.5px ${color.id === "#ffffff" || color.id === "#fafafa" || color.id === "#f5f5f4" ? "hsl(var(--primary))" : color.id}`
                        : "0 0 0 0px transparent, 0 0 0 0px transparent",
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative w-10 h-10 rounded-full cursor-pointer border border-border"
                    style={{ backgroundColor: color.id }}
                    title={color.name}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <CheckIcon className="h-5 w-5 text-gray-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
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
                  <motion.button
                    key={color.id}
                    onClick={() => updateStyle("accentColor", color.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: isSelected
                        ? `0 0 0 2px hsl(var(--background)), 0 0 0 3.5px ${color.id}`
                        : "0 0 0 0px transparent, 0 0 0 0px transparent",
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative w-10 h-10 rounded-full cursor-pointer"
                    style={{ backgroundColor: color.id }}
                    title={color.name}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <CheckIcon className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
}
