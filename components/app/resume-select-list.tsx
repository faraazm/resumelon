"use client";

import Link from "next/link";
import { DocumentTextIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";

interface ResumeItem {
  _id: Id<"resumes">;
  title: string;
  personalDetails: {
    jobTitle?: string;
  };
  updatedAt: number;
}

interface ResumeSelectListProps {
  resumes: ResumeItem[] | undefined;
  selectedResumeId: Id<"resumes"> | null;
  onSelect: (id: Id<"resumes"> | null) => void;
  showCreateLink?: boolean;
}

export function ResumeSelectList({
  resumes,
  selectedResumeId,
  onSelect,
  showCreateLink = false,
}: ResumeSelectListProps) {
  // Loading state
  if (resumes === undefined) {
    return (
      <div className="rounded-lg border border-border p-3 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  // Empty state
  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">
          No resumes yet.
          {showCreateLink && (
            <>
              {" "}
              <Link
                href="/resumes/new"
                className="text-foreground underline underline-offset-4"
              >
                Create one first
              </Link>
            </>
          )}
        </p>
      </div>
    );
  }

  // Resume list
  const sortedResumes = [...resumes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="max-h-[200px] overflow-y-auto space-y-1.5">
      {sortedResumes.map((resume) => {
        const isSelected = selectedResumeId === resume._id;
        return (
          <button
            key={resume._id}
            onClick={() => onSelect(isSelected ? null : resume._id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
              isSelected
                ? "bg-primary/5 border-2 border-primary"
                : "border border-border hover:bg-muted/50 hover:border-muted-foreground/20"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {resume.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {resume.personalDetails.jobTitle || "No job title"}
              </p>
            </div>
            {isSelected && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                <CheckIcon className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
