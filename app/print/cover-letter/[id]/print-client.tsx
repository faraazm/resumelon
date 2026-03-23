"use client";

import { useEffect } from "react";
import { TemplateConfig } from "@/lib/templates/types";
import { CoverLetterData } from "@/lib/cover-letter/CoverLetterRenderer";
import { useCoverLetterPagination, CoverLetterPageRenderer } from "@/lib/cover-letter/use-cover-letter-pagination";
import { LETTER_WIDTH_PX } from "@/lib/pdf-constants";

interface CoverLetterPrintClientProps {
  data: CoverLetterData;
  template: TemplateConfig;
  marginPx: number;
  backgroundColor: string;
  headingFontId: string;
  bodyFontId: string;
}

export function CoverLetterPrintClient({
  data,
  template,
  marginPx,
  backgroundColor,
  headingFontId,
  bodyFontId,
}: CoverLetterPrintClientProps) {
  const { pages, isReady, measurerElement } = useCoverLetterPagination(
    data,
    template,
    { marginPx, headingFontId, bodyFontId, backgroundColor }
  );

  useEffect(() => {
    if (isReady) {
      (window as unknown as { __RESUME_READY__: boolean }).__RESUME_READY__ = true;
    }
  }, [isReady]);

  return (
    <>
      {!isReady && measurerElement}
      <div
        id="cover-letter-content"
        style={{ width: LETTER_WIDTH_PX, overflow: "hidden" }}
      >
        {pages.map((page, i) => (
          <div
            key={i}
            style={{ pageBreakAfter: i < pages.length - 1 ? "always" : undefined }}
          >
            <CoverLetterPageRenderer
              page={page}
              data={data}
              template={template}
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
