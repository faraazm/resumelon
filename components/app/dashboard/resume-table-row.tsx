"use client";

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
import { generateResumePDF } from "@/lib/pdf-generator";
import { useState } from "react";

interface ResumeTableRowProps {
  resume: {
    _id: Id<"resumes">;
    title: string;
    updatedAt: number;
    template: string;
    personalDetails?: {
      firstName: string;
      lastName: string;
      jobTitle: string;
    };
    source?: string;
  };
  selected: boolean;
  onSelect: () => void;
  onDelete: (id: Id<"resumes">) => void;
}

export function ResumeTableRow({
  resume,
  selected,
  onSelect,
  onDelete,
}: ResumeTableRowProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const filename = `${resume.title || "resume"}.pdf`.replace(/[^a-z0-9.-]/gi, "_");
      await generateResumePDF(resume._id, { filename });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const name = [resume.personalDetails?.firstName, resume.personalDetails?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={`transition-colors hover:bg-muted/30 ${selected ? "bg-primary/5" : ""}`}>
      <td className="px-3 py-3">
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </td>
      <td className="px-3 py-3">
        <Link
          href={`/resumes/${resume._id}/edit`}
          className="font-medium text-foreground hover:underline"
        >
          {resume.title}
        </Link>
      </td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden sm:table-cell">
        {name || "—"}
      </td>
      <td className="px-3 py-3 text-sm text-muted-foreground hidden md:table-cell">
        {formatRelativeDate(resume.updatedAt)}
      </td>
      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download PDF"
          >
            {isDownloading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon-xs" asChild title="Edit">
            <Link href={`/resumes/${resume._id}/edit`}>
              <PencilSquareIcon className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(resume._id)}
            title="Delete"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
