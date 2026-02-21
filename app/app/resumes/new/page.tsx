"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";

type Step = "choose-method" | "loading";

export default function NewResumePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<Step>("choose-method");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createResume = useMutation(api.resumes.createResume);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const parseDocument = useAction(api.files.parseDocument);
  const incrementGeneration = useMutation(api.users.incrementGenerationCount);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    user?.id ? { clerkId: user.id, currentMonth } : "skip"
  );

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const handleStartFromScratch = async () => {
    if (!user?.id || isCreating) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

    setIsCreating(true);
    try {
      const resumeId = await createResume({
        clerkId: user.id,
        title: "Untitled Resume",
        source: "scratch",
      });
      await incrementGeneration({ clerkId: user.id });
      router.push(`/app/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error creating resume:", err);
      setError("Failed to create resume. Please try again.");
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user?.id) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

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
        clerkId: user.id,
        title: resumeTitle,
        source: "upload",
        initialData: parsedResumeData,
      });

      await incrementGeneration({ clerkId: user.id });
      router.push(`/app/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload document. Please try again."
      );
      setStep("choose-method");
      setIsUploading(false);
    }
  };

  const handleChooseUpload = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    e.target.value = "";
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

  const handleGenerateWithAI = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    router.push("/app/resumes/new/generate");
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (step === "loading") {
    return <DocumentLoading message="Parsing your document..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute left-6 top-6 z-10">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/app/resumes">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key="choose-method"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl px-4 text-center"
          >
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
                Create a new resume
              </h1>
              <p className="mt-2 text-muted-foreground">
                Start fresh, upload an existing resume, or let AI generate one for you.
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
              {/* Start from scratch */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card
                  onClick={!isCreating ? handleStartFromScratch : undefined}
                  className={`!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20 ${isCreating ? "pointer-events-none opacity-60" : ""}`}
                >
                  <CardContent className="flex items-center gap-4 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      {isCreating ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[15px] font-medium text-foreground">
                        {isCreating ? "Creating..." : "Start from scratch"}
                      </h3>
                      <p className="text-[13px] text-muted-foreground">
                        Build your resume step by step
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upload existing resume */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <Card
                  onClick={handleChooseUpload}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20 ${
                    isDragging ? "border-foreground/20 bg-muted/50" : ""
                  } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
                >
                  <CardContent className="flex items-center gap-4 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      {isUploading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      ) : (
                        <ArrowUpTrayIcon className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[15px] font-medium text-foreground">
                        {isUploading ? "Uploading..." : "Upload existing resume"}
                      </h3>
                      <p className="text-[13px] text-muted-foreground">
                        {isDragging ? "Drop your file here" : "PDF or Word document"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Generate with AI */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card
                  onClick={handleGenerateWithAI}
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
                        Upload any docs, AI builds your resume
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="mt-10"
            >
              <p className="text-xs text-muted-foreground">
                Your progress will be saved automatically
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
