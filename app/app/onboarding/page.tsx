"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DocumentTextIcon,
  DocumentIcon,
  EnvelopeIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";

type DocumentType = "resume" | "cover-letter" | "resignation-letter";
type OnboardingStep = "select-document" | "create-method" | "loading";

const documentTypes = [
  {
    id: "resume" as DocumentType,
    name: "Resume",
    description: "Professional resume to showcase your experience",
    icon: DocumentTextIcon,
  },
  {
    id: "cover-letter" as DocumentType,
    name: "Cover Letter",
    description: "Personalized letter to accompany your resume",
    icon: DocumentIcon,
  },
  {
    id: "resignation-letter" as DocumentType,
    name: "Resignation Letter",
    description: "Professional letter to leave your current role",
    icon: EnvelopeIcon,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState<OnboardingStep>("select-document");
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createResume = useMutation(api.resumes.createResume);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const parseDocument = useAction(api.files.parseDocument);

  const handleDocumentSelect = (type: DocumentType) => {
    setSelectedDocument(type);
    setStep("create-method");
  };

  const handleBack = () => {
    if (step === "create-method") {
      setStep("select-document");
      setSelectedDocument(null);
      setError(null);
    }
  };

  const handleSkip = async () => {
    if (!user?.id) return;

    try {
      await completeOnboarding({ clerkId: user.id });
      router.push("/app/resumes");
    } catch (err) {
      console.error("Error skipping onboarding:", err);
    }
  };

  const handleStartFromScratch = async () => {
    if (!user?.id) return;

    setIsCreating(true);
    try {
      if (selectedDocument === "resume") {
        const resumeId = await createResume({
          clerkId: user.id,
          title: "Untitled Resume",
        });
        await completeOnboarding({ clerkId: user.id });
        router.push(`/app/resumes/${resumeId}/edit`);
      } else {
        // For cover letters and resignation letters, redirect to appropriate pages
        await completeOnboarding({ clerkId: user.id });
        router.push(`/app/cover-letters`);
      }
    } catch (err) {
      console.error("Error creating document:", err);
      setError("Failed to create document. Please try again.");
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user?.id) return;

    setIsUploading(true);
    setError(null);
    setStep("loading");

    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file directly to Convex storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      const { storageId } = await uploadResponse.json();

      // Step 3: Parse the document using Convex action
      const data = await parseDocument({
        storageId,
        fileType: file.type,
        fileName: file.name,
      });

      // Prepare parsed data
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

      // Create resume directly and redirect to edit page (skip preview)
      const resumeTitle = `${parsedResumeData.personalDetails.firstName} ${parsedResumeData.personalDetails.lastName}'s Resume`.trim() || "Imported Resume";

      const resumeId = await createResume({
        clerkId: user.id,
        title: resumeTitle,
        initialData: parsedResumeData,
      });

      await completeOnboarding({ clerkId: user.id });
      router.push(`/app/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError(err instanceof Error ? err.message : "Failed to upload document. Please try again.");
      setStep("create-method");
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
      if (validTypes.includes(file.type) || file.name.endsWith(".docx") || file.name.endsWith(".doc") || file.name.endsWith(".pdf")) {
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

  // Show loading screen during parsing
  if (step === "loading") {
    return <DocumentLoading message="Parsing your document..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back button - only show when not on first step */}
      {step !== "select-document" && (
        <div className="absolute left-6 top-6 z-10">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Document Type */}
          {step === "select-document" && (
            <motion.div
              key="select-document"
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
                  What would you like to create?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Choose one to get started. You can always create the others later.
                </p>
              </motion.div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {documentTypes.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  >
                    <Card
                      onClick={() => handleDocumentSelect(doc.id)}
                      className="group cursor-pointer transition-all hover:border-primary hover:shadow-md"
                    >
                      <CardContent className="flex flex-col items-center p-6">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                          <doc.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">
                          {doc.name}
                        </h3>
                        <p className="mt-1 text-center text-sm text-muted-foreground">
                          {doc.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                <p className="text-sm text-muted-foreground">
                  You can create multiple documents anytime from your dashboard.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Create Method */}
          {step === "create-method" && (
            <motion.div
              key="create-method"
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
                  Let's create your {selectedDocument === "resume" ? "resume" : selectedDocument === "cover-letter" ? "cover letter" : "resignation letter"}
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
                        Build your {selectedDocument === "resume" ? "resume" : "document"} step by step
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
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                      isDragging ? "border-primary bg-primary/5" : ""
                    } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-8">
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
                          {isUploading ? "Uploading..." : selectedDocument === "resume" ? "Upload your resume" : "Upload reference"}
                        </h3>
                        <p className="mt-1 text-center text-sm text-muted-foreground">
                          {isDragging
                            ? "Drop your file here"
                            : selectedDocument === "resume"
                              ? "PDF or Word document"
                              : "Any reference document"}
                        </p>
                      </label>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <p className="text-xs text-muted-foreground">
                  Your progress will be saved automatically
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </Button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
