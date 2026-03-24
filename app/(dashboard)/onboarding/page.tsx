"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlusIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  DocumentTextIcon,
  BoltIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";

type OnboardingStep = "welcome" | "create-resume" | "loading";

const features = [
  {
    icon: DocumentTextIcon,
    title: "Build unlimited resumes",
    description: "Create as many resumes as you need for different roles",
  },
  {
    icon: SparklesIcon,
    title: "AI-tailored for every job",
    description:
      "Instantly tailor any resume for a specific job you're applying to",
  },
  {
    icon: BoltIcon,
    title: "Custom cover letters",
    description:
      "Get a matching cover letter generated alongside every tailored resume",
  },
  {
    icon: CheckCircleIcon,
    title: "ATS-ready formats",
    description:
      "Every version is formatted to pass applicant tracking systems",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createResume = useMutation(api.resumes.createResume);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const parseDocument = useAction(api.files.parseDocument);

  const handleContinue = () => {
    setStep("create-resume");
  };

  const handleSkip = async () => {
    if (!user) return;
    try {
      await completeOnboarding({});
      router.push("/resumes");
    } catch (err) {
      console.error("Error skipping onboarding:", err);
    }
  };

  const handleStartFromScratch = async () => {
    if (!user || isCreating) return;

    setIsCreating(true);
    try {
      const resumeId = await createResume({
        title: "Untitled Resume",
        source: "scratch",
      });
      await completeOnboarding({});
      router.push(`/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error creating resume:", err);
      setError("Failed to create resume. Please try again.");
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    setError(null);
    setStep("loading");

    try {
      const uploadUrl = await generateUploadUrl();

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      const { storageId } = await uploadResponse.json();

      const data = await parseDocument({
        storageId,
        fileType: file.type,
        fileName: file.name,
      });

      const parsedResumeData = {
        personalDetails: {
          firstName: data.personalDetails.firstName || "",
          lastName: data.personalDetails.lastName || "",
          jobTitle: data.personalDetails.jobTitle || "",
        },
        contact: {
          email: data.contact.email || "",
          phone: data.contact.phone || "",
          linkedin: data.contact.linkedin || "",
          location: data.contact.location || "",
        },
        summary: data.summary || "",
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
      };

      const fullName = `${parsedResumeData.personalDetails.firstName} ${parsedResumeData.personalDetails.lastName}`.trim();
      const resumeTitle = fullName ? `${fullName}'s Resume` : "Untitled Resume";

      const resumeId = await createResume({
        title: resumeTitle,
        source: "upload",
        initialData: parsedResumeData,
      });

      await completeOnboarding({});
      router.push(`/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload document. Please try again."
      );
      setStep("create-resume");
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      if (
        validTypes.includes(file.type) ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".pdf")
      ) {
        handleFileUpload(file);
      } else {
        setError("Please upload a PDF or Word document.");
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (step === "loading") {
    return <DocumentLoading message="Parsing your document..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl text-center"
            >
              {/* Logo + brand name side by side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-3"
              >
                <Image
                  src="/images/resumelon-logo.png"
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="text-3xl font-semibold tracking-tight">
                  resumelon
                </span>
              </motion.div>

              {/* Welcome heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Welcome to resumelon
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                A new resume for every job you apply to — generated instantly
                from one master resume, with a custom cover letter to match.
              </motion.p>

              {/* Feature list */}
              <div className="mt-8 space-y-2.5 text-left sm:mt-10 sm:space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.4 + index * 0.3,
                    }}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-3 sm:px-4"
                  >
                    <div className="mt-0.5 shrink-0 rounded-md bg-primary/10 p-1.5">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {feature.title}
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.8 }}
                className="mt-8 sm:mt-10"
              >
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Create Resume */}
          {step === "create-resume" && (
            <motion.div
              key="create-resume"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Let&apos;s create your first resume
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                  Start with a base resume, then tailor it for specific jobs
                  right from your dashboard.
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

              <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
                {/* Start from Scratch */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="w-full sm:w-[280px]"
                >
                  <Card
                    onClick={!isCreating ? handleStartFromScratch : undefined}
                    className={`group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md ${isCreating ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-6 sm:p-8">
                      <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                        {isCreating ? (
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <PlusIcon className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-foreground">
                        {isCreating ? "Creating..." : "Start from scratch"}
                      </h3>
                      <p className="mt-1 text-center text-sm text-muted-foreground">
                        Build your resume step by step
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Upload Document */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="w-full sm:w-[280px]"
                >
                  <Card
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                      isDragging ? "border-primary bg-primary/5" : ""
                    } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-6 sm:p-8">
                      <input
                        type="file"
                        id="document-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileInput}
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="document-upload"
                        className="flex w-full cursor-pointer flex-col items-center"
                      >
                        <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                          {isUploading ? (
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <ArrowUpTrayIcon className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-foreground">
                          {isUploading
                            ? "Uploading..."
                            : "Upload existing resume"}
                        </h3>
                        <p className="mt-1 text-center text-sm text-muted-foreground">
                          {isDragging
                            ? "Drop your file here"
                            : "PDF or Word document"}
                        </p>
                      </label>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                className="mt-10 flex flex-col items-center gap-2 sm:mt-12"
              >
                <button
                  onClick={handleSkip}
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                >
                  Skip for now
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
