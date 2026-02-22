"use client";

import { useRef, useEffect, useState } from "react";

interface CoverLetterPreviewProps {
  data: {
    title: string;
    personalDetails: {
      firstName: string;
      lastName: string;
      jobTitle: string;
      email: string;
      phone: string;
      address: string;
    };
    letterContent: {
      companyName: string;
      hiringManagerName: string;
      content: string;
    };
  };
}

export function CoverLetterPreview({ data }: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { personalDetails, letterContent } = data;

  // Get today's date formatted
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate scale to fit the preview in the container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32; // Account for padding
        const pageWidth = 816; // US Letter width in px at 96 DPI
        const newScale = Math.min(containerWidth / pageWidth, 1);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const fullName = `${personalDetails.firstName} ${personalDetails.lastName}`.trim();

  return (
    <div ref={containerRef} className="flex justify-center">
      <div
        className="bg-white shadow-lg rounded-sm overflow-hidden"
        style={{
          width: `${816 * scale}px`,
          height: `${1056 * scale}px`,
        }}
      >
        <div
          className="origin-top-left"
          style={{
            width: "816px",
            height: "1056px",
            transform: `scale(${scale})`,
          }}
        >
          {/* Letter Content */}
          <div className="w-full h-full p-16 font-serif text-[14px] leading-relaxed text-gray-800">
            {/* Sender Information */}
            <div className="mb-8">
              {fullName && (
                <p className="font-semibold text-lg text-gray-900">{fullName}</p>
              )}
              {personalDetails.jobTitle && (
                <p className="text-gray-600">{personalDetails.jobTitle}</p>
              )}
              <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                {personalDetails.email && <p>{personalDetails.email}</p>}
                {personalDetails.phone && <p>{personalDetails.phone}</p>}
                {personalDetails.address && <p>{personalDetails.address}</p>}
              </div>
            </div>

            {/* Date */}
            <p className="mb-6 text-gray-700">{today}</p>

            {/* Recipient Information */}
            {(letterContent.hiringManagerName || letterContent.companyName) && (
              <div className="mb-6 text-gray-700">
                {letterContent.hiringManagerName && (
                  <p>{letterContent.hiringManagerName}</p>
                )}
                {letterContent.companyName && (
                  <p>{letterContent.companyName}</p>
                )}
              </div>
            )}

            {/* Greeting */}
            <p className="mb-4 text-gray-800">
              Dear {letterContent.hiringManagerName || "Hiring Manager"},
            </p>

            {/* Letter Body */}
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1"
              dangerouslySetInnerHTML={{
                __html: letterContent.content ||
                  '<p class="text-gray-400 italic">Start writing your cover letter content...</p>'
              }}
            />

            {/* Closing */}
            {letterContent.content && (
              <div className="mt-8 text-gray-800">
                <p className="mb-4">Sincerely,</p>
                <p className="font-medium">{fullName || "[Your Name]"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
