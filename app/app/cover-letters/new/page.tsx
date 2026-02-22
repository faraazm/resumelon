"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeftIcon,
  PlusIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { Id } from "@/convex/_generated/dataModel";

type Step = "choose-method" | "select-resume" | "loading";

export default function NewCoverLetterPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<Step>("choose-method");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const resumes = useQuery(
    api.resumes.getResumesByUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    user?.id ? { clerkId: user.id, currentMonth } : "skip"
  );

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const createCoverLetter = useMutation(api.coverLetters.createCoverLetter);
  const incrementGeneration = useMutation(api.users.incrementGenerationCount);

  const handleStartFromScratch = async () => {
    if (!user?.id || isCreating) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

    setIsCreating(true);
    try {
      // Create empty cover letter with default structure
      const id = await createCoverLetter({
        clerkId: user.id,
        title: "Untitled Cover Letter",
        personalDetails: {
          firstName: "",
          lastName: "",
          jobTitle: "",
          email: "",
          phone: "",
          address: "",
        },
        letterContent: {
          companyName: "",
          hiringManagerName: "",
          content: "",
        },
      });

      await incrementGeneration({ clerkId: user.id });
      router.push(`/app/cover-letters/${id}/edit`);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
      setIsCreating(false);
    }
  };

  const handleFromResume = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    setStep("select-resume");
  };

  const handleSelectResume = (resumeId: Id<"resumes">) => {
    setSelectedResumeId(resumeId);
  };

  const handleGenerate = async () => {
    if (!user?.id || !selectedResumeId) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

    const resume = resumes?.find((r) => r._id === selectedResumeId);
    if (!resume) return;

    setStep("loading");

    try {
      const fullName = `${resume.personalDetails.firstName} ${resume.personalDetails.lastName}`.trim();
      const title = fullName
        ? `Cover Letter - ${fullName}`
        : "Untitled Cover Letter";

      // Create cover letter pre-filled with resume data
      const id = await createCoverLetter({
        clerkId: user.id,
        resumeId: selectedResumeId,
        title,
        personalDetails: {
          firstName: resume.personalDetails.firstName,
          lastName: resume.personalDetails.lastName,
          jobTitle: resume.personalDetails.jobTitle,
          email: resume.contact.email,
          phone: resume.contact.phone,
          address: resume.contact.location,
        },
        letterContent: {
          companyName: "",
          hiringManagerName: "",
          content: jobDescription.trim()
            ? `<p>I am writing to express my interest in the position at your company.</p><p>${resume.summary || ""}</p>`
            : "",
        },
      });

      await incrementGeneration({ clerkId: user.id });
      router.push(`/app/cover-letters/${id}/edit`);
    } catch (err) {
      console.error("Error creating cover letter:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create cover letter. Please try again."
      );
      setStep("select-resume");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (step === "loading") {
    return <DocumentLoading message="Creating your cover letter..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute left-6 top-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={step === "select-resume" ? () => setStep("choose-method") : undefined}
          asChild={step === "choose-method"}
        >
          {step === "choose-method" ? (
            <Link href="/app/cover-letters">
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

      <div className="flex min-h-screen items-center justify-center">
        <AnimatePresence mode="wait">
          {step === "choose-method" && (
            <motion.div
              key="choose-method"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl px-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Create a cover letter
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Start from scratch or pre-fill from an existing resume.
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

              <div className="mx-auto mt-8 flex max-w-lg flex-col gap-2.5">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card
                    onClick={handleStartFromScratch}
                    className="!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20"
                  >
                    <CardContent className="flex items-center gap-4 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <PlusIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-[15px] font-medium text-foreground">
                          Start from scratch
                        </h3>
                        <p className="text-[13px] text-muted-foreground">
                          Write your cover letter manually
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  <Card
                    onClick={handleFromResume}
                    className="!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20"
                  >
                    <CardContent className="flex items-center gap-4 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
                        <DocumentTextIcon className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-[15px] font-medium text-foreground">
                          Pre-fill from a resume
                        </h3>
                        <p className="text-[13px] text-muted-foreground">
                          Import your details from an existing resume
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-10"
              >
                <p className="text-xs text-muted-foreground">
                  Your progress will be saved automatically
                </p>
              </motion.div>
            </motion.div>
          )}

          {step === "select-resume" && (
            <motion.div
              key="select-resume"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center"
              >
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Select a resume
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Choose which resume to import your details from
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

              {/* Resume list */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-8 space-y-2"
              >
                {resumes === undefined ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
                    ))}
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="rounded-lg border border-dashed py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No resumes found. Create a resume first.
                    </p>
                    <Button asChild className="mt-3" size="sm">
                      <Link href="/app/resumes/new">Create Resume</Link>
                    </Button>
                  </div>
                ) : (
                  resumes
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((resume) => (
                      <Card
                        key={resume._id}
                        onClick={() => handleSelectResume(resume._id)}
                        className={`!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20 ${
                          selectedResumeId === resume._id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <CardContent className="flex items-center gap-4 px-4 py-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className="text-sm font-medium text-foreground truncate">
                              {resume.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {resume.personalDetails.jobTitle || "No job title"}
                            </p>
                          </div>
                          {selectedResumeId === resume._id && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                )}
              </motion.div>

              {/* Generate button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="mt-6"
              >
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedResumeId}
                  className="w-full"
                  size="lg"
                >
                  Create Cover Letter
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-6 mb-8 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  Your personal details will be pre-filled from the selected resume
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
