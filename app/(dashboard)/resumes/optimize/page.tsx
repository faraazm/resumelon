"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";
import { JobDescriptionStep } from "@/components/app/optimize/job-description-step";
import { AnalysisView } from "@/components/app/optimize/analysis-view";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { Id } from "@/convex/_generated/dataModel";
import type { ResumeData } from "@/lib/templates/types";

type Step = "job-description" | "analysis" | "loading";

// Type aliases for cleaner code
type ExperienceEntry = ResumeData["experience"][number];
type EducationEntry = ResumeData["education"][number];

interface AnalysisData {
  jobTitle: string;
  companyName: string;
  matchScore: number;
  missingSkills: string[];
  presentSkills: string[];
  suggestedSummary: string;
  suggestedBullets: Array<{
    experienceId: string;
    originalBullet: string;
    improvedBullet: string;
  }>;
}

export default function OptimizePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <OptimizePageContent />
    </Suspense>
  );
}

function OptimizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded } = useUser();
  const [step, setStep] = useState<Step>("job-description");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const resumeId = searchParams.get("resumeId") as Id<"resumes"> | null;

  const resume = useQuery(
    api.resumes.getResume,
    isLoaded && resumeId ? { id: resumeId } : "skip"
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    isLoaded ? { currentMonth } : "skip"
  );

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const analyzeJobMatch = useAction(api.ai.analyzeJobMatch);
  const generateOptimizedResume = useAction(api.ai.generateOptimizedResume);
  const createResume = useMutation(api.resumes.createResume);

  const checkUsageLimits = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return false;
    }
    return true;
  };

  const handleAnalyzeFirst = async () => {
    if (!resume || isAnalyzing) return;
    if (!checkUsageLimits()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeJobMatch({
        resumeData: {
          personalDetails: {
            firstName: resume.personalDetails.firstName,
            lastName: resume.personalDetails.lastName,
            jobTitle: resume.personalDetails.jobTitle,
          },
          summary: resume.summary,
          experience: resume.experience.map((exp) => ({
            id: exp.id,
            title: exp.title,
            company: exp.company,
            bullets: exp.bullets,
          })),
          skills: resume.skills,
        },
        jobDescription: jobDescription.trim(),
      });

      setAnalysisData(result);
      setStep("analysis");
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze job match. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateInstantly = async () => {
    if (!resume) return;
    if (!checkUsageLimits()) return;

    await generateAndCreate();
  };

  const handleGenerateFromAnalysis = async (_selectedSkills: string[]) => {
    if (!resume) return;
    await generateAndCreate();
  };

  const handleGenerateAll = async () => {
    if (!resume) return;
    await generateAndCreate();
  };

  const generateAndCreate = async () => {
    if (!resume || isGenerating) return;
    if (!checkUsageLimits()) return;

    setIsGenerating(true);
    setStep("loading");

    try {
      const result = await generateOptimizedResume({
        resumeData: {
          personalDetails: resume.personalDetails,
          contact: resume.contact,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
        },
        jobDescription: jobDescription.trim(),
      });

      const title = result.companyName
        ? `${result.jobTitle} - ${result.companyName}`
        : result.jobTitle || "Tailored Resume";

      const newResumeId = await createResume({
        title,
        source: "optimized",
        jobDescription: jobDescription.trim(),
        initialData: {
          personalDetails: result.personalDetails,
          contact: result.contact,
          summary: result.summary,
          experience: result.experience.map((exp: ExperienceEntry) => ({
            ...exp,
            id: exp.id || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          })),
          education: result.education.map((edu: EducationEntry) => ({
            ...edu,
            id: edu.id || `edu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          })),
          skills: result.skills,
        },
      });

      router.push(`/resumes/${newResumeId}/edit`);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate tailored resume. Please try again.");
      setStep(analysisData ? "analysis" : "job-description");
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === "analysis") {
      setStep("job-description");
      setAnalysisData(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If no resumeId provided, redirect back
  if (!resumeId) {
    router.push("/resumes");
    return null;
  }

  // Loading during query
  if (resume === undefined || generationLimit === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Resume not found or access denied
  if (resume === null) {
    router.push("/resumes");
    return null;
  }

  if (step === "loading") {
    return <DocumentLoading message="Generating your tailored resume..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="absolute left-6 top-6 z-10">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={step !== "job-description" ? handleBack : undefined}
          asChild={step === "job-description"}
        >
          {step === "job-description" ? (
            <Link href="/resumes">
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Link>
          ) : (
            <>
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </>
          )}
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center py-16">
        <AnimatePresence mode="wait">
          {step === "job-description" && (
            <JobDescriptionStep
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              onGenerateInstantly={handleGenerateInstantly}
              onAnalyzeFirst={handleAnalyzeFirst}
              isLoading={isAnalyzing}
            />
          )}

          {step === "analysis" && analysisData && (
            <AnalysisView
              analysis={analysisData}
              onGenerate={handleGenerateFromAnalysis}
              onGenerateAll={handleGenerateAll}
              isLoading={isGenerating}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-destructive px-4 py-3 text-sm text-destructive-foreground shadow-lg">
          {error}
        </div>
      )}

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
