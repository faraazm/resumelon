"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { formatRelativeDate } from "./format-date";

async function generateCoverLetterPDF(
  coverLetterId: string,
  options: { filename?: string } = {}
): Promise<void> {
  const { filename = "cover-letter.pdf" } = options;

  const response = await fetch("/api/cover-letter-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coverLetterId, filename }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

interface CoverLetterTableRowProps {
  coverLetter: {
    _id: Id<"coverLetters">;
    title: string;
    updatedAt: number;
    letterContent?: {
      companyName: string;
      hiringManagerName: string;
      content: string;
    };
  };
  selected: boolean;
  onSelect: () => void;
  onDelete: (id: Id<"coverLetters">) => void;
}

export function CoverLetterTableRow({
  coverLetter,
  selected,
  onSelect,
  onDelete,
}: CoverLetterTableRowProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const company = coverLetter.letterContent?.companyName || "—";

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const filename = `${coverLetter.title || "cover-letter"}.pdf`.replace(/[^a-z0-9.-]/gi, "_");
      await generateCoverLetterPDF(coverLetter._id, { filename });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <tr className={`transition-colors hover:bg-muted/30 ${selected ? "bg-primary/5" : ""}`}>
      <td className="px-3 py-3">
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </td>
      <td className="px-3 py-3">
        <Link
          href={`/cover-letters/${coverLetter._id}/edit`}
          className="font-medium text-foreground hover:underline"
        >
          {coverLetter.title}
        </Link>
      </td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">
        {company}
      </td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden md:table-cell">
        {formatRelativeDate(coverLetter.updatedAt)}
      </td>
      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download"
          >
            {isDownloading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon-xs" asChild title="Edit">
            <Link href={`/cover-letters/${coverLetter._id}/edit`}>
              <PencilSquareIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(coverLetter._id)}
            title="Delete"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
