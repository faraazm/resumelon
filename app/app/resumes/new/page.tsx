"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  DocumentTextIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";

type Step = "choose-method" | "job-description" | "loading";

interface ParsedResumeData {
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

export default function NewResumePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<Step>("choose-method");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Creating your resume...");
  const [jobDescription, setJobDescription] = useState("");
  const [autoTailor, setAutoTailor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createResume = useMutation(api.resumes.createResume);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const parseDocument = useAction(api.files.parseDocument);

  // Start from scratch - go directly to editor
  const handleStartFromScratch = async () => {
    if (!user?.id || isCreating) return;

    setIsCreating(true);
    try {
      const resumeId = await createResume({
        clerkId: user.id,
        title: "Untitled Resume",
      });
      router.push(`/app/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error creating document:", err);
      setError("Failed to create resume. Please try again.");
      setIsCreating(false);
    }
  };

  // Choose to upload - open file picker directly
  const handleChooseUpload = () => {
    fileInputRef.current?.click();
  };

  // Upload, parse, and create resume (called after job description step)
  const handleUploadParseAndCreate = async (withJobDescription: boolean) => {
    if (!user?.id || !selectedFile || isCreating) return;

    setIsCreating(true);
    setStep("loading");
    setLoadingMessage("Uploading your document...");

    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file directly to Convex storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      const { storageId } = await uploadResponse.json();

      // Step 3: Parse the document
      setLoadingMessage(
        autoTailor && withJobDescription && jobDescription.trim()
          ? "Parsing and tailoring your resume..."
          : "Parsing your document..."
      );

      const data = await parseDocument({
        storageId,
        fileType: selectedFile.type,
        fileName: selectedFile.name,
      });

      // Prepare parsed data
      const resumeData: ParsedResumeData = {
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

      // TODO: If autoTailor && jobDescription, call AI to tailor the resume
      // For now, we just save the parsed data as-is

      setLoadingMessage("Creating your resume...");

      const resumeTitle = `${resumeData.personalDetails.firstName} ${resumeData.personalDetails.lastName}'s Resume`.trim() || "Imported Resume";

      const resumeId = await createResume({
        clerkId: user.id,
        title: resumeTitle,
        jobDescription: withJobDescription && jobDescription.trim() ? jobDescription.trim() : undefined,
        initialData: resumeData,
      });

      router.push(`/app/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error creating resume:", err);
      setError(err instanceof Error ? err.message : "Failed to create resume. Please try again.");
      setStep("job-description");
      setIsCreating(false);
    }
  };

  // After job description step, upload, parse and create the resume
  const handleCreateWithJobDescription = () => {
    handleUploadParseAndCreate(true);
  };

  // Skip job description and create resume directly
  const handleSkipJobDescription = () => {
    handleUploadParseAndCreate(false);
  };

  // Just store the file locally and move to job description step
  const handleFileSelected = (file: File) => {
    setError(null);
    setSelectedFile(file);
    setStep("job-description");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      if (validTypes.includes(file.type) || file.name.endsWith(".docx") || file.name.endsWith(".doc") || file.name.endsWith(".pdf")) {
        handleFileSelected(file);
      } else {
        setError("Please upload a PDF or Word document.");
      }
    }
    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  const handleBack = () => {
    setError(null);
    if (step === "job-description") {
      setStep("choose-method");
      setJobDescription("");
      setAutoTailor(false);
      setSelectedFile(null);
    }
  };

  // Show loading state while user is loading
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Show loading screen during parsing/tailoring
  if (step === "loading") {
    return <DocumentLoading message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="absolute left-6 top-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={step !== "choose-method" ? handleBack : undefined}
          asChild={step === "choose-method"}
        >
          {step === "choose-method" ? (
            <Link href="/app/resumes">
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
          {/* Step 1: Choose Method */}
          {step === "choose-method" && (
            <motion.div
              key="choose-method"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl px-4 text-center"
            >
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileInput}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Let's create your resume
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Choose how you'd like to get started
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

              {/* Two cards side by side, centered */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:items-stretch">
                {/* Start from Scratch */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="w-full sm:w-[280px]"
                >
                  <Card
                    onClick={!isCreating ? handleStartFromScratch : undefined}
                    className={`group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md ${isCreating ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-8">
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
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="w-full sm:w-[280px]"
                >
                  <Card
                    onClick={handleChooseUpload}
                    className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md"
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-8">
                      <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                        <ArrowUpTrayIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">
                        Upload your resume
                      </h3>
                      <p className="mt-1 text-center text-sm text-muted-foreground">
                        PDF or Word document
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="mt-12"
              >
                <p className="text-xs text-muted-foreground">
                  Your progress will be saved automatically
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Job Description (after file selection) */}
          {step === "job-description" && (
            <motion.div
              key="job-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl px-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Do you have a job description?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Adding a job description helps us tailor your resume for better results
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

              {/* Job description textarea */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-8"
              >
                <Textarea
                  placeholder="Paste the job description here (optional)..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[180px] text-left resize-none"
                />
              </motion.div>

              {/* Auto-tailor checkbox */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="mt-4"
              >
                <label
                  className={`flex items-center justify-center gap-3 rounded-lg border p-4 transition-all cursor-pointer ${
                    autoTailor
                      ? "border-foreground/30 bg-muted/50"
                      : "border-border hover:border-foreground/30"
                  } ${!jobDescription.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                      autoTailor
                        ? "border-foreground bg-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {autoTailor && <CheckIcon className="h-3 w-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={autoTailor}
                    onChange={(e) => setAutoTailor(e.target.checked)}
                    disabled={!jobDescription.trim()}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">
                      Automatically tailor resume to match job description
                    </span>
                  </div>
                </label>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-6 flex flex-col sm:flex-row justify-center gap-3"
              >
                <Button
                  variant="outline"
                  onClick={handleSkipJobDescription}
                  disabled={isCreating}
                  className="order-2 sm:order-1"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleCreateWithJobDescription}
                  disabled={isCreating || !jobDescription.trim()}
                  className="order-1 sm:order-2 gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-6"
              >
                <p className="text-xs text-muted-foreground">
                  You can add or edit the job description later from the editor
                </p>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
