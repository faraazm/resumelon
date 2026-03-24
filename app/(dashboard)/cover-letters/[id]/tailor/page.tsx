"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  SparklesIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";
import { ResumeSelectList } from "@/components/app/resume-select-list";
import { Id } from "@/convex/_generated/dataModel";

export default function TailorCoverLetterPage() {
  const router = useRouter();
  const params = useParams();
  const coverLetterId = params.id as Id<"coverLetters">;
  const { isLoaded } = useUser();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const coverLetter = useQuery(
    api.coverLetters.getCoverLetter,
    isLoaded ? { id: coverLetterId } : "skip"
  );

  const resumes = useQuery(
    api.resumes.getResumesByUser,
    isLoaded ? {} : "skip"
  );

  const updateCoverLetter = useMutation(api.coverLetters.updateCoverLetter);
  const generateCoverLetterAI = useAction(api.ai.generateCoverLetter);

  const selectedResume = resumes?.find((r) => r._id === selectedResumeId);
  const hasResume = !!selectedResumeId;
  const hasJobDescription = jobDescription.trim().length > 0;
  const canGenerate = hasResume && hasJobDescription;

  const handleGenerate = async () => {
    if (!canGenerate || !selectedResume) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCoverLetterAI({
        resumeData: {
          personalDetails: {
            firstName: selectedResume.personalDetails.firstName,
            lastName: selectedResume.personalDetails.lastName,
            jobTitle: selectedResume.personalDetails.jobTitle,
          },
          contact: {
            email: selectedResume.contact.email,
            phone: selectedResume.contact.phone,
            location: selectedResume.contact.location,
          },
          summary: selectedResume.summary || "",
          experience: (selectedResume.experience || []).map((e) => ({
            title: e.title,
            company: e.company,
            bullets: e.bullets,
          })),
          skills: selectedResume.skills || [],
        },
        jobDescription: jobDescription.trim(),
        companyName: companyName.trim() || "the company",
        jobTitle: jobTitle.trim() || selectedResume.personalDetails.jobTitle || "the position",
      });

      // Convert plain text paragraphs to HTML
      const generatedContent = result.content
        .split("\n\n")
        .filter((p: string) => p.trim())
        .map((p: string) => `<p>${p.trim()}</p>`)
        .join("");

      const newTitle = companyName.trim()
        ? `Cover Letter - ${companyName.trim()}`
        : coverLetter?.title || "Cover Letter";

      // Update the cover letter with the new content
      await updateCoverLetter({
        id: coverLetterId,
        updates: {
          title: newTitle,
          personalDetails: {
            firstName: selectedResume.personalDetails.firstName,
            lastName: selectedResume.personalDetails.lastName,
            jobTitle: selectedResume.personalDetails.jobTitle,
            email: selectedResume.contact.email,
            phone: selectedResume.contact.phone,
            address: selectedResume.contact.location,
          },
          letterContent: {
            companyName: companyName.trim(),
            hiringManagerName: coverLetter?.letterContent?.hiringManagerName || "",
            content: generatedContent,
          },
        },
      });

      router.push(`/cover-letters/${coverLetterId}/edit`);
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate cover letter. Please try again."
      );
      setIsGenerating(false);
    }
  };

  if (!isLoaded || coverLetter === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (coverLetter === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Cover letter not found</p>
        <Button asChild>
          <Link href="/cover-letters">Go back</Link>
        </Button>
      </div>
    );
  }

  if (isGenerating) {
    return <DocumentLoading message="Generating your tailored cover letter..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute left-6 top-6 z-10">
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href="/cover-letters">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex min-h-screen items-start sm:items-center justify-center px-4 py-20 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Tailor your cover letter
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Select a resume and paste a job description to re-generate this cover letter.
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          <div className="mt-8 space-y-6">
            {/* Resume selection */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-medium text-foreground">
                  Select a resume
                </h2>
              </div>

              <ResumeSelectList
                resumes={resumes}
                selectedResumeId={selectedResumeId}
                onSelect={setSelectedResumeId}
                showCreateLink
              />
            </motion.div>

            {/* Job description */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-medium text-foreground">
                  Job description
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="Company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Job title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  className="max-h-[200px] resize-y"
                />
              </div>
            </motion.div>

            {/* Hint text */}
            {canGenerate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-600 text-center"
              >
                AI will generate a tailored cover letter using your resume and the job description
              </motion.p>
            )}
            {hasResume && !hasJobDescription && (
              <p className="text-xs text-muted-foreground text-center">
                Add a job description to generate a tailored cover letter
              </p>
            )}
            {!hasResume && hasJobDescription && (
              <p className="text-xs text-muted-foreground text-center">
                Select a resume to generate a tailored cover letter
              </p>
            )}
            {!hasResume && !hasJobDescription && (
              <p className="text-xs text-muted-foreground text-center">
                Select a resume and add a job description to get started
              </p>
            )}

            {/* Generate button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full"
                size="lg"
              >
                <SparklesIcon className="h-4 w-4" />
                Generate Tailored Cover Letter
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
