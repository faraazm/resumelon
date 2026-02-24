"use client";

import { useEffect } from "react";
import { ResumeData, TemplateConfig } from "@/lib/templates/types";
import { usePagination, PageRenderer } from "@/lib/pagination";
import { LETTER_WIDTH_PX } from "@/lib/pdf-constants";

interface PrintResumeClientProps {
  resumeData: ResumeData;
  template: TemplateConfig;
  marginPx: number;
  backgroundColor: string;
  headingFontId: string;
  bodyFontId: string;
  sectionOrder?: string[];
}

export function PrintResumeClient({
  resumeData,
  template,
  marginPx,
  backgroundColor,
  headingFontId,
  bodyFontId,
  sectionOrder,
}: PrintResumeClientProps) {
  const { pages, isReady, measurerElement } = usePagination(
    resumeData,
    template,
    {
      marginPx,
      headingFontId,
      bodyFontId,
      backgroundColor,
      sectionOrder,
    }
  );

  // Signal to Playwright that the page is ready
  useEffect(() => {
    if (isReady) {
      (window as unknown as { __RESUME_READY__: boolean }).__RESUME_READY__ = true;
      console.log("Resume ready signal set");
    }
  }, [isReady]);

  return (
    <>
      {/* Hide measurer after measurement — prevents it from contributing to document flow */}
      {!isReady && measurerElement}
      <div
        id="resume-content"
        style={{
          width: LETTER_WIDTH_PX,
          overflow: "hidden",
        }}
      >
        {pages.map((page, i) => (
          <div
            key={i}
            style={{
              pageBreakAfter: i < pages.length - 1 ? "always" : undefined,
            }}
          >
            <PageRenderer
              page={page}
              template={template}
              data={resumeData}
              marginPx={marginPx}
              backgroundColor={backgroundColor}
              headingFontId={headingFontId}
              bodyFontId={bodyFontId}
            />
          </div>
        ))}
      </div>
    </>
  );
}
