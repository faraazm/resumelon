"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { SectionScore } from "@/lib/resume-scoring";

const statusConfig = {
  complete: {
    icon: CheckCircleIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    label: "Complete",
  },
  "needs-work": {
    icon: ExclamationTriangleIcon,
    color: "text-amber-500",
    bg: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700",
    label: "Needs Work",
  },
  missing: {
    icon: XCircleIcon,
    color: "text-red-500",
    bg: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700",
    label: "Missing",
  },
} as const;

// Map scoring keys to editor section keys
const sectionToEditorKey: Record<string, string> = {
  personal: "personalDetails",
  contact: "contact",
  summary: "summary",
  experience: "experience",
  education: "education",
  skills: "skills",
};

export function SectionCard({
  section,
  resumeId,
}: {
  section: SectionScore;
  resumeId: string;
}) {
  const config = statusConfig[section.status];
  const Icon = config.icon;
  const editorSection = sectionToEditorKey[section.key] || section.key;
  const editHref = `/app/resumes/${resumeId}/edit?section=${editorSection}`;

  return (
    <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value={section.key} className="border-b-0">
          <AccordionTrigger className="!py-3 px-4 hover:no-underline">
              <div className="flex flex-1 items-center gap-3">
                <Icon className={`h-5 w-5 shrink-0 ${config.color}`} />
                <span className="font-medium text-sm">{section.name}</span>

                {/* Mini progress bar */}
                <div className="hidden sm:block h-1.5 w-20 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${config.bg} transition-all duration-500`}
                    style={{ width: `${section.score}%` }}
                  />
                </div>

                <span
                  className={`ml-auto mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClass}`}
                >
                  {config.label}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 !pb-3">
              {/* Field feedback */}
              <div className="space-y-2">
                {section.feedback.map((fb, i) => {
                  const fbConfig = statusConfig[fb.status];
                  const FbIcon = fbConfig.icon;
                  return (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <FbIcon className={`mt-0.5 h-4 w-4 shrink-0 ${fbConfig.color}`} />
                      <div>
                        <span className="font-medium">{fb.field}</span>
                        <span className="text-muted-foreground"> — {fb.message}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {section.suggestions.length > 0 && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Suggestions</p>
                  <ul className="space-y-1">
                    {section.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Edit button */}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1.5 rounded-full shadow-none"
                asChild
              >
                <Link href={editHref}>
                  <PencilSquareIcon className="h-3.5 w-3.5" />
                  Edit {section.name}
                </Link>
              </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
