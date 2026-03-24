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
import { Input } from "@/components/ui/input";
import {
  ArrowLeftIcon,
  PlusIcon,
  DocumentTextIcon,
  SparklesIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { ResumeSelectList } from "@/components/app/resume-select-list";
import { Id } from "@/convex/_generated/dataModel";

type Step = "choose-method" | "generate" | "loading";

export default function NewCoverLetterPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<Step>("choose-method");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
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
  const generateCoverLetterAI = useAction(api.ai.generateCoverLetter);

  const handleStartFromScratch = async () => {
    if (!user?.id || isCreating) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

    setIsCreating(true);
    try {
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

      // No increment here - "start from scratch" doesn't use AI
      router.push(`/cover-letters/${id}/edit`);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
      setIsCreating(false);
    }
  };

  const handleGenerateOption = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    setStep("generate");
  };

  const selectedResume = resumes?.find((r) => r._id === selectedResumeId);
  const hasResume = !!selectedResumeId;
  const hasJobDescription = jobDescription.trim().length > 0;
  const canCreate = hasResume || hasJobDescription;

  const handleGenerate = async () => {
    if (!user?.id || !canCreate) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

    setStep("loading");
    setError(null);

    try {
      const personalDetails = selectedResume
        ? {
            firstName: selectedResume.personalDetails.firstName,
            lastName: selectedResume.personalDetails.lastName,
            jobTitle: selectedResume.personalDetails.jobTitle,
            email: selectedResume.contact.email,
            phone: selectedResume.contact.phone,
            address: selectedResume.contact.location,
          }
        : {
            firstName: "",
            lastName: "",
            jobTitle: "",
            email: "",
            phone: "",
            address: "",
          };

      let generatedContent = "";

      // If we have both resume and job description, use AI to generate
      if (hasResume && hasJobDescription && selectedResume) {
        const result = await generateCoverLetterAI({
          clerkId: user.id,
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
        generatedContent = result.content
          .split("\n\n")
          .filter((p: string) => p.trim())
          .map((p: string) => `<p>${p.trim()}</p>`)
          .join("");
      }

      const fullName = `${personalDetails.firstName} ${personalDetails.lastName}`.trim();
      const title = companyName.trim()
        ? `Cover Letter - ${companyName.trim()}`
        : fullName
          ? `Cover Letter - ${fullName}`
          : "Untitled Cover Letter";

      const id = await createCoverLetter({
        clerkId: user.id,
        resumeId: selectedResumeId ?? undefined,
        title,
        personalDetails,
        letterContent: {
          companyName: companyName.trim(),
          hiringManagerName: "",
          content: generatedContent,
        },
        jobDescription: jobDescription.trim() || undefined,
      });

      // No increment here - generateCoverLetterAI already increments count server-side
      router.push(`/cover-letters/${id}/edit`);
    } catch (err) {
      console.error("Error creating cover letter:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create cover letter. Please try again."
      );
      setStep("generate");
    }
  };

  const backAction = () => {
    if (step === "generate") {
      setStep("choose-method");
      setSelectedResumeId(null);
      setJobDescription("");
      setCompanyName("");
      setJobTitle("");
      setError(null);
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
    return (
      <DocumentLoading
        message={
          hasResume && hasJobDescription
            ? "Generating your cover letter..."
            : "Creating your cover letter..."
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute left-6 top-6 z-10">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={step === "generate" ? backAction : undefined}
          asChild={step === "choose-method"}
        >
          {step === "choose-method" ? (
            <Link href="/cover-letters">
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

      <div className="flex min-h-screen items-start sm:items-center justify-center px-4 py-20 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === "choose-method" && (
            <motion.div
              key="choose-method"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg text-center"
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
                  Write from scratch or let AI generate one for you.
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

              <div className="mt-8 flex flex-col gap-2.5">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card
                    onClick={handleStartFromScratch}
                    className={`!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20 ${isCreating ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <CardContent className="flex items-center gap-4 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <PlusIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-[15px] font-medium text-foreground">
                          {isCreating ? "Creating..." : "Start from scratch"}
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
                    onClick={handleGenerateOption}
                    className="!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20"
                  >
                    <CardContent className="flex items-center gap-4 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
                        <SparklesIcon className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-[15px] font-medium text-foreground">
                          Generate with AI
                        </h3>
                        <p className="text-[13px] text-muted-foreground">
                          Combine your resume and a job description
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

          {step === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                  Generate a cover letter
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Select a resume and/or paste a job description. Provide both for the best results.
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
                    <span className="text-xs text-muted-foreground">(optional)</span>
                  </div>

                  <ResumeSelectList
                    resumes={resumes}
                    selectedResumeId={selectedResumeId}
                    onSelect={setSelectedResumeId}
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
                    <span className="text-xs text-muted-foreground">(optional)</span>
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
                {hasResume && hasJobDescription && (
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
                    Your details will be pre-filled from the selected resume
                  </p>
                )}
                {!hasResume && hasJobDescription && (
                  <p className="text-xs text-muted-foreground text-center">
                    A cover letter will be created with the job context — fill in your details in the editor
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
                    disabled={!canCreate}
                    className="w-full"
                    size="lg"
                  >
                    {hasResume && hasJobDescription ? (
                      <>
                        <SparklesIcon className="h-4 w-4" />
                        Generate Cover Letter
                      </>
                    ) : (
                      "Create Cover Letter"
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
