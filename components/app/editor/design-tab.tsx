"use client";

import { useEffect } from "react";
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
  TemplateConfig,
} from "@/lib/templates";

interface DesignTabProps {
  resumeData: any;
  onUpdate: (section: string, data: any) => void;
}

// Get templates from our template system
const templateOptions = getAllTemplates();

const sansSerifFonts = [
  { id: "inter", name: "Inter", style: "font-sans" },
  { id: "roboto", name: "Roboto", style: "font-sans" },
  { id: "lato", name: "Lato", style: "font-sans" },
  { id: "opensans", name: "Open Sans", style: "font-sans" },
];

const serifFonts = [
  { id: "georgia", name: "Georgia", style: "font-serif" },
  { id: "merriweather", name: "Merriweather", style: "font-serif" },
  { id: "playfair", name: "Playfair Display", style: "font-serif" },
  { id: "lora", name: "Lora", style: "font-serif" },
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

export function DesignTab({ resumeData, onUpdate }: DesignTabProps) {
  const currentTemplate = resumeData.template || "professional";
  const template = getTemplate(currentTemplate);

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

  // When template changes, update the fonts to match template defaults (unless user has overridden)
  useEffect(() => {
    // Only update if user hasn't explicitly set fonts
    if (!currentStyle.headingFont && !currentStyle.bodyFont) {
      // Don't update - let the defaults flow through
    }
  }, [currentTemplate]);

  // Render mini preview showing actual template structure
  const renderTemplatePreview = (tmpl: TemplateConfig) => {
    const isCenter = tmpl.layout.headerAlignment === "center";
    const showDivider = tmpl.layout.sectionDivider !== "none";
    const hasSidebar = tmpl.layout.sidebar;
    const showPhoto = tmpl.layout.showPhoto;

    if (hasSidebar) {
      return (
        <div className="h-full w-full flex rounded bg-white shadow-sm overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-700 p-1.5">
            {/* Photo circle */}
            {showPhoto && (
              <div className="w-4 h-4 rounded-full bg-gray-500 mx-auto mb-1.5" />
            )}
            {/* Name */}
            <div className="h-1.5 w-full bg-gray-400 rounded mb-0.5" />
            <div className="h-1 w-2/3 bg-gray-500 rounded mx-auto mb-2" />
            {/* Contact section */}
            <div className="h-1 w-full bg-gray-500 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-gray-600 rounded mb-0.5" />
            <div className="h-0.5 w-3/4 bg-gray-600 rounded mb-1.5" />
            {/* Skills section */}
            <div className="h-1 w-full bg-gray-500 rounded mb-0.5" />
            <div className="flex flex-wrap gap-0.5">
              <div className="h-1.5 w-3 bg-gray-600 rounded" />
              <div className="h-1.5 w-4 bg-gray-600 rounded" />
              <div className="h-1.5 w-3 bg-gray-600 rounded" />
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 p-1.5">
            <div className="h-1 w-1/3 bg-gray-800 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-gray-200 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-gray-200 rounded mb-0.5" />
            <div className="h-0.5 w-2/3 bg-gray-200 rounded mb-1.5" />
            <div className="h-1 w-1/3 bg-gray-800 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-gray-200 rounded mb-0.5" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      );
    }

    return (
      <div className="h-full w-full rounded bg-white p-2 shadow-sm">
        <div className="space-y-1.5">
          {/* Header with optional photo */}
          <div className={`flex items-start gap-1.5 ${isCenter ? "justify-center" : ""}`}>
            {showPhoto && (
              <div className="w-4 h-4 rounded-full bg-gray-300 shrink-0" />
            )}
            <div className={isCenter && !showPhoto ? "text-center" : ""}>
              <div
                className={`h-2 ${isCenter && !showPhoto ? "mx-auto" : ""} rounded bg-gray-800`}
                style={{ width: showPhoto ? "60%" : isCenter ? "50%" : "50%" }}
              />
              <div
                className={`mt-0.5 h-1 ${isCenter && !showPhoto ? "mx-auto" : ""} rounded bg-gray-400`}
                style={{ width: showPhoto ? "40%" : isCenter ? "33%" : "33%" }}
              />
            </div>
          </div>

          {/* Section 1 */}
          <div className="mt-2 space-y-0.5">
            <div className="flex items-center gap-1">
              <div className="h-1 w-1/4 rounded bg-gray-800" />
              {showDivider && <div className="flex-1 h-px bg-gray-300" />}
            </div>
            <div className="h-0.5 w-full rounded bg-gray-200" />
            <div className="h-0.5 w-full rounded bg-gray-200" />
            <div className="h-0.5 w-2/3 rounded bg-gray-200" />
          </div>

          {/* Section 2 */}
          <div className="mt-1.5 space-y-0.5">
            <div className="flex items-center gap-1">
              <div className="h-1 w-1/4 rounded bg-gray-800" />
              {showDivider && <div className="flex-1 h-px bg-gray-300" />}
            </div>
            <div className="h-0.5 w-full rounded bg-gray-200" />
            <div className="h-0.5 w-3/4 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  };

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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateOptions.map((tmpl) => {
                const isSelected = currentTemplate === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    onClick={() => onUpdate("template", tmpl.id)}
                    className={`group relative overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {/* Template Preview */}
                    <div className="aspect-[8.5/11] bg-gray-50 p-2">
                      {renderTemplatePreview(tmpl)}
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

            <div className="space-y-4">
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
                    className={`flex-1 rounded-lg border-2 px-3 md:px-4 py-2 md:py-3 text-sm font-medium transition-all cursor-pointer ${
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
                    className={`relative w-10 h-10 rounded-full transition-all cursor-pointer ${
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
