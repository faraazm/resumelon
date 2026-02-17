"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

interface ImproveTabProps {
  resumeData: any;
  onNavigate: (section: string) => void;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: number; // percentage improvement
  section: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export function ImproveTab({ resumeData, onNavigate }: ImproveTabProps) {
  // Calculate suggestions based on resume data
  const suggestions: Suggestion[] = [
    {
      id: "summary",
      title: "Add a professional summary",
      description:
        "A compelling summary helps recruiters quickly understand your value proposition.",
      impact: 15,
      section: "summary",
      completed: Boolean(resumeData.summary && resumeData.summary.length > 50),
      priority: "high",
    },
    {
      id: "experience-bullets",
      title: "Add more work experience details",
      description:
        "Include at least 3-5 bullet points for each position highlighting your achievements.",
      impact: 20,
      section: "experience",
      completed: resumeData.experience?.some(
        (exp: any) => exp.bullets?.length >= 3
      ),
      priority: "high",
    },
    {
      id: "quantify",
      title: "Add measurable results",
      description:
        'Use numbers and percentages to quantify your impact (e.g., "Increased sales by 25%").',
      impact: 18,
      section: "experience",
      completed: false,
      priority: "high",
    },
    {
      id: "skills",
      title: "Add relevant skills",
      description:
        "Include 6-10 skills that match the job description you're targeting.",
      impact: 12,
      section: "skills",
      completed: resumeData.skills?.length >= 6,
      priority: "medium",
    },
    {
      id: "contact",
      title: "Complete contact information",
      description:
        "Add email, phone, and location so employers can easily reach you.",
      impact: 10,
      section: "contact",
      completed: Boolean(
        resumeData.contact?.email &&
          resumeData.contact?.phone &&
          resumeData.contact?.location
      ),
      priority: "medium",
    },
    {
      id: "education",
      title: "Add education details",
      description:
        "Include your degree, school name, and graduation date.",
      impact: 8,
      section: "education",
      completed: resumeData.education?.length > 0,
      priority: "low",
    },
    {
      id: "linkedin",
      title: "Add LinkedIn profile",
      description:
        "Including your LinkedIn URL makes it easy for recruiters to learn more about you.",
      impact: 5,
      section: "contact",
      completed: Boolean(resumeData.contact?.linkedin),
      priority: "low",
    },
  ];

  const completedCount = suggestions.filter((s) => s.completed).length;
  const totalCount = suggestions.length;
  const score = Math.round((completedCount / totalCount) * 100);

  const incompleteSuggestions = suggestions.filter((s) => !s.completed);
  const completedSuggestions = suggestions.filter((s) => s.completed);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Make your resume stronger
            </h2>
            <p className="text-sm text-muted-foreground">
              Follow these suggestions to improve your chances of landing
              interviews
            </p>
          </div>

          {/* Score Card */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm border border-border">
                    <span className="text-2xl font-bold text-foreground">
                      {score}%
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Resume Score</p>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} of {totalCount} improvements completed
                    </p>
                  </div>
                </div>
                <ChartBarIcon className="h-8 w-8 text-muted-foreground/40" />
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-background border border-border">
                <div
                  className="h-full rounded-full bg-foreground transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Incomplete Suggestions */}
          {incompleteSuggestions.length > 0 && (
            <section>
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Recommended Improvements
              </h3>
              <div className="space-y-3">
                {incompleteSuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed Suggestions */}
          {completedSuggestions.length > 0 && (
            <section>
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Completed
              </h3>
              <div className="space-y-3">
                {completedSuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          )}

          {/* AI Enhancement Card */}
          <Card className="border-dashed">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <SparklesIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  AI Content Enhancement
                </p>
                <p className="text-sm text-muted-foreground">
                  Let AI rewrite and enhance your resume content for maximum
                  impact
                </p>
              </div>
              <Button variant="outline" className="cursor-pointer">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  onNavigate,
}: {
  suggestion: Suggestion;
  onNavigate: (section: string) => void;
}) {
  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <Card
      className={`transition-all ${
        suggestion.completed
          ? "bg-muted/30 opacity-60"
          : "hover:border-foreground/20 cursor-pointer"
      }`}
      onClick={() => !suggestion.completed && onNavigate(suggestion.section)}
    >
      <CardContent className="flex items-start gap-4 p-4">
        {/* Status Icon */}
        <div className="mt-0.5">
          {suggestion.completed ? (
            <CheckCircleSolidIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`font-medium ${
                suggestion.completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {suggestion.title}
            </p>
            {!suggestion.completed && (
              <Badge
                variant="secondary"
                className={`text-[10px] ${priorityColors[suggestion.priority]}`}
              >
                +{suggestion.impact}%
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {suggestion.description}
          </p>
        </div>

        {/* Action */}
        {!suggestion.completed && (
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </CardContent>
    </Card>
  );
}
