"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { formatRelativeDate } from "./format-date";

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
  const company = coverLetter.letterContent?.companyName || "—";

  return (
    <tr className={`transition-colors hover:bg-muted/30 ${selected ? "bg-primary/5" : ""}`}>
      <td className="px-3 py-3">
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </td>
      <td className="px-3 py-3">
        <Link
          href={`/app/cover-letters/${coverLetter._id}/edit`}
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
          <Button variant="ghost" size="icon-xs" asChild title="Edit">
            <Link href={`/app/cover-letters/${coverLetter._id}/edit`}>
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
