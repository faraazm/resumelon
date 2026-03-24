import { getCoverLetterForPrint } from "@/lib/convex-server";
import { getTemplate, TemplateConfig, getTemplateDefaultHeadingFont, getTemplateDefaultBodyFont } from "@/lib/templates";
import { DEFAULT_MARGIN_PX, COMPACT_MARGIN_PX, SPACIOUS_MARGIN_PX } from "@/lib/pdf-constants";
import { CoverLetterPrintClient } from "./print-client";

const PRINT_FONT_FAMILIES: Record<string, string> = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  roboto: "'Roboto', ui-sans-serif, system-ui, sans-serif",
  lato: "'Lato', ui-sans-serif, system-ui, sans-serif",
  opensans: "'Open Sans', ui-sans-serif, system-ui, sans-serif",
  montserrat: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
  raleway: "'Raleway', ui-sans-serif, system-ui, sans-serif",
  sourcesans: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
  poppins: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  nunito: "'Nunito', ui-sans-serif, system-ui, sans-serif",
  merriweather: "'Merriweather', ui-serif, serif",
  playfair: "'Playfair Display', ui-serif, serif",
  lora: "'Lora', ui-serif, serif",
  crimson: "'Crimson Text', ui-serif, serif",
  librebaskerville: "'Libre Baskerville', ui-serif, serif",
  garamond: "'EB Garamond', ui-serif, serif",
};

function getPrintFontFamily(fontId: string): string {
  return PRINT_FONT_FAMILIES[fontId] || PRINT_FONT_FAMILIES.inter;
}

interface PrintPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PrintCoverLetterPage({ params, searchParams }: PrintPageProps) {
  const { id: coverLetterId } = await params;
  const { token } = await searchParams;

  if (!token) {
    return <div className="flex h-screen items-center justify-center bg-white"><div className="text-red-500">Access denied: Missing token</div></div>;
  }

  const result = await getCoverLetterForPrint(token);

  if (result.error) {
    return <div className="flex h-screen items-center justify-center bg-white"><div className="text-red-500">Access denied: {result.error}</div></div>;
  }

  const cl = result.coverLetter;
  if (!cl) {
    return <div className="flex h-screen items-center justify-center bg-white"><div className="text-gray-500">Cover letter not found</div></div>;
  }

  if (result.coverLetterId !== coverLetterId) {
    return <div className="flex h-screen items-center justify-center bg-white"><div className="text-red-500">Access denied: Token mismatch</div></div>;
  }

  const templateId = cl.template || "ats-classic";
  const template = getTemplate(templateId);
  const spacing = cl.style?.spacing || "normal";
  const accentColor = cl.style?.accentColor || template.colors.accent;

  const adjustedTemplate: TemplateConfig = {
    ...template,
    spacing: {
      ...template.spacing,
      sectionGap: spacing === "compact" ? "mb-2" : spacing === "spacious" ? "mb-4" : "mb-3",
      itemGap: spacing === "compact" ? "mt-1" : spacing === "spacious" ? "mt-2.5" : "mt-2",
      pagePadding: spacing === "compact" ? "p-[0.4in]" : spacing === "spacious" ? "p-[0.6in]" : "p-[0.5in]",
      lineHeight: spacing === "compact" ? "leading-tight" : spacing === "spacious" ? "leading-snug" : "leading-snug",
    },
    colors: { ...template.colors, accent: accentColor, divider: accentColor },
  };

  const headingFontId = cl.style?.headingFont || getTemplateDefaultHeadingFont(templateId);
  const bodyFontId = cl.style?.bodyFont || getTemplateDefaultBodyFont(templateId);
  const backgroundColor = cl.style?.backgroundColor || "#ffffff";
  const marginPx = spacing === "compact" ? COMPACT_MARGIN_PX : spacing === "spacious" ? SPACIOUS_MARGIN_PX : DEFAULT_MARGIN_PX;

  const coverLetterData = {
    personalDetails: cl.personalDetails || { firstName: "", lastName: "", jobTitle: "", email: "", phone: "", address: "" },
    letterContent: cl.letterContent || { companyName: "", hiringManagerName: "", content: "" },
  };

  return (
    <div
      style={{
        fontFamily: getPrintFontFamily(bodyFontId),
        ...Object.fromEntries(
          Object.entries(PRINT_FONT_FAMILIES).map(([key, value]) => [`--font-${key}`, value])
        ),
      }}
    >
      <CoverLetterPrintClient
        data={coverLetterData}
        template={adjustedTemplate}
        marginPx={marginPx}
        backgroundColor={backgroundColor}
        headingFontId={headingFontId}
        bodyFontId={bodyFontId}
      />
    </div>
  );
}
