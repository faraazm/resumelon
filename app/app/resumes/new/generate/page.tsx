"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { DocumentLoading } from "@/components/app/document-loading";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";

type Step = "upload" | "loading";

interface UploadedFile {
  file: File;
  id: string;
}

export default function GenerateResumePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createResume = useMutation(api.resumes.createResume);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const extractTextFromFile = useAction(api.files.extractTextFromFile);
  const generateResumeFromDocuments = useAction(api.ai.generateResumeFromDocuments);
  const incrementGeneration = useMutation(api.users.incrementGenerationCount);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    user?.id ? { clerkId: user.id, currentMonth } : "skip"
  );

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const validExtensions = [".pdf", ".docx", ".txt"];
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const filesToAdd: UploadedFile[] = [];
    for (const file of Array.from(newFiles)) {
      const isValid =
        validTypes.includes(file.type) ||
        validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

      if (isValid) {
        filesToAdd.push({ file, id: `${file.name}-${Date.now()}-${Math.random()}` });
      }
    }

    if (filesToAdd.length === 0) {
      setError("Please upload PDF, DOCX, or TXT files.");
      return;
    }

    setError(null);
    setFiles((prev) => [...prev, ...filesToAdd]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleGenerate = async () => {
    if (!user?.id || files.length === 0) return;
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }

    setError(null);
    setStep("loading");

    try {
      const textParts: string[] = [];

      for (const { file } of files) {
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { storageId } = await uploadResponse.json();

        const text = await extractTextFromFile({
          storageId,
          fileType: file.type,
          fileName: file.name,
        });

        textParts.push(`=== ${file.name} ===\n${text}`);
      }

      const documentsText = textParts.join("\n\n");

      const result = await generateResumeFromDocuments({
        documentsText,
        additionalInfo: additionalInfo.trim() || undefined,
      });

      const { resumeData } = result;

      const fullName = `${resumeData.personalDetails.firstName} ${resumeData.personalDetails.lastName}`.trim();
      const resumeTitle = fullName ? `${fullName}'s Resume` : "Untitled Resume";

      const resumeId = await createResume({
        clerkId: user.id,
        title: resumeTitle,
        source: "ai_generated",
        initialData: {
          personalDetails: resumeData.personalDetails,
          contact: resumeData.contact,
          summary: resumeData.summary,
          experience: resumeData.experience,
          education: resumeData.education,
          skills: resumeData.skills,
        },
      });

      await incrementGeneration({ clerkId: user.id });
      router.push(`/app/resumes/${resumeId}/edit`);
    } catch (err) {
      console.error("Error generating resume:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate resume. Please try again."
      );
      setStep("upload");
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
    return <DocumentLoading message="AI is building your resume..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute left-6 top-6 z-10">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/app/resumes/new">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
              Generate your resume with AI
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload your documents and we&apos;ll build your resume
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

          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileInput}
            />

            <Card
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`!py-0 cursor-pointer border-dashed transition-all hover:border-primary hover:bg-primary/5 ${
                isDragging ? "border-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="mb-3 rounded-full bg-primary/10 p-3">
                  <ArrowUpTrayIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {isDragging
                    ? "Drop your files here"
                    : "Click to browse or drag & drop files"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, DOCX, or TXT — upload multiple files
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* File chips */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {files.map(({ file, id }) => (
                <div
                  key={id}
                  className="flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 text-sm"
                >
                  <DocumentTextIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="max-w-[200px] truncate text-foreground">
                    {file.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(id);
                    }}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                  >
                    <XMarkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Additional info textarea */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-6"
          >
            <label className="text-sm font-medium text-foreground">
              Additional information{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Target role, extra skills, achievements, or anything else you'd like included..."
              className="mt-1.5 max-h-[160px] resize-none"
              rows={3}
            />
          </motion.div>

          {/* Generate button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-8"
          >
            <Button
              onClick={handleGenerate}
              disabled={files.length === 0}
              className="w-full"
              size="lg"
            >
              Generate Resume
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="mt-6 mb-8 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Your documents are processed securely and deleted after extraction
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
