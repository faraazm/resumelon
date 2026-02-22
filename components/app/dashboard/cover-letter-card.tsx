"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";

interface CoverLetterCardData {
  _id: Id<"coverLetters">;
  title: string;
  updatedAt: number;
  personalDetails?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
  };
  letterContent?: {
    companyName: string;
    hiringManagerName: string;
    content: string;
  };
}

function formatRelativeDate(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days} days ago`;

  const date = new Date(timestamp);
  return `Updated ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

// Strip HTML tags for preview
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function CoverLetterCard({
  coverLetter,
  onDelete,
}: {
  coverLetter: CoverLetterCardData;
  onDelete: (id: Id<"coverLetters">) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  const personalDetails = coverLetter.personalDetails || {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
  };

  const letterContent = coverLetter.letterContent || {
    companyName: "",
    hiringManagerName: "",
    content: "",
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = containerWidth / 816;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Get today's date formatted
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden !py-0 !gap-0">
      <CardContent className="!p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Thumbnail Preview */}
          <Link
            href={`/app/cover-letters/${coverLetter._id}/edit`}
            className="block shrink-0 p-4 sm:p-5"
          >
            <div
              ref={containerRef}
              className="relative mx-auto w-[180px] sm:w-[200px] overflow-hidden rounded-md border border-border/60 bg-white shadow-sm cursor-pointer transition-shadow hover:shadow-md"
              style={{ aspectRatio: "8.5 / 11" }}
            >
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={{
                  width: "816px",
                  height: "1056px",
                  transform: `scale(${scale})`,
                }}
              >
                {/* Letter Preview Content */}
                <div className="w-full h-full bg-white p-16 font-serif text-[14px] leading-relaxed text-gray-800">
                  {/* Header */}
                  <div className="mb-8">
                    <p className="font-semibold text-lg">
                      {personalDetails.firstName} {personalDetails.lastName}
                    </p>
                    {personalDetails.jobTitle && (
                      <p className="text-gray-600">{personalDetails.jobTitle}</p>
                    )}
                    {personalDetails.email && (
                      <p className="text-gray-600 text-sm">{personalDetails.email}</p>
                    )}
                    {personalDetails.phone && (
                      <p className="text-gray-600 text-sm">{personalDetails.phone}</p>
                    )}
                    {personalDetails.address && (
                      <p className="text-gray-600 text-sm">{personalDetails.address}</p>
                    )}
                  </div>

                  {/* Date */}
                  <p className="mb-6">{today}</p>

                  {/* Recipient */}
                  {(letterContent.hiringManagerName || letterContent.companyName) && (
                    <div className="mb-6">
                      {letterContent.hiringManagerName && (
                        <p>{letterContent.hiringManagerName}</p>
                      )}
                      {letterContent.companyName && (
                        <p>{letterContent.companyName}</p>
                      )}
                    </div>
                  )}

                  {/* Greeting */}
                  <p className="mb-4">
                    Dear {letterContent.hiringManagerName || "Hiring Manager"},
                  </p>

                  {/* Content Preview */}
                  <div className="text-gray-700 line-clamp-6">
                    {stripHtml(letterContent.content) || "Your cover letter content will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Info + Actions */}
          <div className="flex flex-1 flex-col justify-center px-4 pb-4 sm:pl-2 sm:pr-5 sm:py-5">
            <Link
              href={`/app/cover-letters/${coverLetter._id}/edit`}
              className="block"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {coverLetter.title}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatRelativeDate(coverLetter.updatedAt)}
            </p>

            {/* Company Info */}
            {letterContent.companyName && (
              <p className="mt-2 text-sm text-muted-foreground">
                For: {letterContent.companyName}
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-none"
                asChild
              >
                <Link href={`/app/cover-letters/${coverLetter._id}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-none"
                onClick={() => onDelete(coverLetter._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
