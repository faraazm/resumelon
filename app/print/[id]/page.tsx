import { getResumeForPrint } from "@/lib/convex-server";
import {
  TemplateRenderer,
  getTemplate,
  ResumeData,
  TemplateConfig,
  getTemplateDefaultHeadingFont,
  getTemplateDefaultBodyFont,
} from "@/lib/templates";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  TYPOGRAPHY,
} from "@/lib/pdf-constants";
import { PrintPageClient } from "./print-client";

// Font family mapping for print (using actual font names, not CSS variables)
const PRINT_FONT_FAMILIES: Record<string, string> = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  roboto: "'Roboto', ui-sans-serif, system-ui, sans-serif",
  lato: "'Lato', ui-sans-serif, system-ui, sans-serif",
  opensans: "'Open Sans', ui-sans-serif, system-ui, sans-serif",
  merriweather: "'Merriweather', ui-serif, serif",
  playfair: "'Playfair Display', ui-serif, serif",
  lora: "'Lora', ui-serif, serif",
};

function getPrintFontFamily(fontId: string): string {
  return PRINT_FONT_FAMILIES[fontId] || PRINT_FONT_FAMILIES.inter;
}

interface PrintPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PrintResumePage({ params, searchParams }: PrintPageProps) {
  const { id: resumeId } = await params;
  const { token } = await searchParams;

  // Token is required
  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-red-500">Access denied: Missing token</div>
      </div>
    );
  }

  // Fetch resume data using the secure token (validates in Convex)
  const result = await getResumeForPrint(token);

  if (result.error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-red-500">Access denied: {result.error}</div>
      </div>
    );
  }

  const resume = result.resume;

  if (!resume) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-gray-500">Resume not found</div>
      </div>
    );
  }

  // Verify the token is for the correct resume (defense in depth)
  if (result.resumeId !== resumeId) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-red-500">Access denied: Token mismatch</div>
      </div>
    );
  }

  // Get template
  const templateId = resume.template || "professional";
  const template = getTemplate(templateId);

  // Map font IDs to font types
  const getFontType = (fontId: string): "serif" | "sans" => {
    const serifFonts = ["merriweather", "playfair", "lora"];
    return serifFonts.includes(fontId) ? "serif" : "sans";
  };

  // Determine if we should show photo and dividers
  const showPhoto =
    resume.style?.showPhoto !== undefined
      ? resume.style.showPhoto
      : template.layout.showPhoto;

  const showDividers =
    resume.style?.showDividers !== undefined
      ? resume.style.showDividers
      : template.layout.sectionDivider !== "none";

  const sectionDivider = showDividers
    ? template.layout.sectionDivider === "none"
      ? "line"
      : template.layout.sectionDivider
    : "none";

  const accentColor = resume.style?.accentColor || template.colors.accent;

  // Get font IDs
  const headingFontId =
    resume.style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId =
    resume.style?.bodyFont || getTemplateDefaultBodyFont(templateId);

  // Apply template overrides with print-optimized spacing
  const adjustedTemplate: TemplateConfig = {
    ...template,
    typography: {
      ...template.typography,
      headingFont: resume.style?.headingFont
        ? getFontType(resume.style.headingFont)
        : resume.style?.font
          ? getFontType(resume.style.font)
          : template.typography.headingFont,
      bodyFont: resume.style?.bodyFont
        ? getFontType(resume.style.bodyFont)
        : resume.style?.font
          ? getFontType(resume.style.font)
          : template.typography.bodyFont,
    },
    spacing: {
      ...template.spacing,
      // Tighter spacing optimized for print
      sectionGap:
        resume.style?.spacing === "compact"
          ? "mb-2"
          : resume.style?.spacing === "spacious"
            ? "mb-4"
            : "mb-3",
      itemGap:
        resume.style?.spacing === "compact"
          ? "mt-1"
          : resume.style?.spacing === "spacious"
            ? "mt-2.5"
            : "mt-2",
      pagePadding:
        resume.style?.spacing === "compact"
          ? "p-[0.4in]"
          : resume.style?.spacing === "spacious"
            ? "p-[0.6in]"
            : "p-[0.5in]",
      lineHeight:
        resume.style?.spacing === "compact"
          ? "leading-tight"
          : resume.style?.spacing === "spacious"
            ? "leading-snug"
            : "leading-snug",
    },
    layout: {
      ...template.layout,
      showPhoto,
      sectionDivider,
    },
    colors: {
      ...template.colors,
      accent: accentColor,
      divider: accentColor,
    },
  };

  // Convert to ResumeData
  const resumeData: ResumeData = {
    personalDetails: {
      firstName: resume.personalDetails?.firstName || "",
      lastName: resume.personalDetails?.lastName || "",
      jobTitle: resume.personalDetails?.jobTitle || "",
      photo: resume.personalDetails?.photo,
      photoUrl: result.photoUrl || undefined, // Resolved URL from Convex storage
      // Optional fields
      nationality: resume.personalDetails?.nationality,
      driverLicense: resume.personalDetails?.driverLicense,
      birthDate: resume.personalDetails?.birthDate,
    },
    contact: {
      email: resume.contact?.email || "",
      phone: resume.contact?.phone || "",
      linkedin: resume.contact?.linkedin || "",
      location: resume.contact?.location || "",
    },
    summary: resume.summary || "",
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
  };

  return (
    <PrintPageClient>
      <div
        id="resume-content"
        className="bg-white resume-page"
        style={{
          width: `${LETTER_WIDTH_PX}px`,
          minHeight: `${LETTER_HEIGHT_PX}px`,
          fontFamily: getPrintFontFamily(bodyFontId),
          fontSize: TYPOGRAPHY.body,
          lineHeight: TYPOGRAPHY.lineHeight,
          // CSS variables for fonts
          ["--font-inter" as string]: PRINT_FONT_FAMILIES.inter,
          ["--font-roboto" as string]: PRINT_FONT_FAMILIES.roboto,
          ["--font-lato" as string]: PRINT_FONT_FAMILIES.lato,
          ["--font-opensans" as string]: PRINT_FONT_FAMILIES.opensans,
          ["--font-merriweather" as string]: PRINT_FONT_FAMILIES.merriweather,
          ["--font-playfair" as string]: PRINT_FONT_FAMILIES.playfair,
          ["--font-lora" as string]: PRINT_FONT_FAMILIES.lora,
        }}
      >
        <TemplateRenderer
          data={resumeData}
          template={adjustedTemplate}
          headingFontId={headingFontId}
          bodyFontId={bodyFontId}
        />
      </div>
    </PrintPageClient>
  );
}
