"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownTrayIcon,
  HomeIcon,
  CheckIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  PaintBrushIcon,
  SparklesIcon,
  EyeIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

// Import editor components
import { WriteTab, initialSections } from "@/components/app/editor/write-tab";
import { DesignTab } from "@/components/app/editor/design-tab";
import { ImproveTab } from "@/components/app/editor/improve-tab";
import { ResumePreview } from "@/components/app/editor/resume-preview";
import { generateResumePDF } from "@/lib/pdf-generator";

interface ResumeStyleOverrides {
  font?: string;
  headingFont?: string;
  bodyFont?: string;
  spacing?: "compact" | "normal" | "spacious";
  accentColor?: string;
  backgroundColor?: string;
  showPhoto?: boolean;
  showDividers?: boolean;
}

interface ResumeLocalData {
  title: string;
  jobDescription: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    photo: string | null;
    nationality?: string;
    driverLicense?: string;
    birthDate?: string;
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
  template: string;
  style: ResumeStyleOverrides;
}

// Default empty resume data for initial state
const defaultResumeData: ResumeLocalData = {
  title: "Untitled Resume",
  jobDescription: "",
  personalDetails: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    photo: null as string | null,
  } as {
    firstName: string;
    lastName: string;
    jobTitle: string;
    photo: string | null;
    nationality?: string;
    driverLicense?: string;
    birthDate?: string;
  },
  contact: {
    email: "",
    phone: "",
    linkedin: "",
    location: "",
  },
  summary: "",
  experience: [] as Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>,
  education: [] as Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>,
  skills: [] as string[],
  template: "modern",
  style: {
    font: "inter",
    spacing: "normal",
    accentColor: "#3b82f6",
  },
};

export default function ResumeEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading resume...</p>
          </div>
        </div>
      }
    >
      <ResumeEditorContent />
    </Suspense>
  );
}

function ResumeEditorContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const resumeId = params.id as Id<"resumes">;
  const { user, isLoaded: isUserLoaded } = useUser();
  const clerkId = user?.id;

  // Read ?section= param to deep-link into a specific write section
  const initialSection = searchParams.get("section") || "personalDetails";

  const [activeTab, setActiveTab] = useState<"write" | "design" | "improve">("write");
  const [_isSaving, setIsSaving] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const savingMinTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localData, setLocalData] = useState<ResumeLocalData>(defaultResumeData);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "personalDetails",
    "contact",
    "summary",
    "experience",
    "education",
    "skills",
  ]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [writeSections, setWriteSections] = useState(initialSections);
  const [activeWriteSection, setActiveWriteSection] = useState(initialSection);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingUpdatesRef = useRef<Partial<typeof localData>>({});
  const clerkIdRef = useRef(clerkId);
  const [isDownloading, setIsDownloading] = useState(false);

  // Keep clerkId ref in sync with latest value
  useEffect(() => {
    clerkIdRef.current = clerkId;
  }, [clerkId]);

  // Fetch resume data from Convex (only when user is loaded)
  const resume = useQuery(
    api.resumes.getResume,
    clerkId ? { id: resumeId, clerkId } : "skip"
  );
  const updateResume = useMutation(api.resumes.updateResume);

  // Sync Convex data to local state ONLY on initial load
  // After that, local state is the source of truth to prevent flicker
  useEffect(() => {
    if (resume && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLocalData({
        title: resume.title,
        jobDescription: resume.jobDescription || "",
        personalDetails: {
          ...resume.personalDetails,
          photo: resume.personalDetails.photo ?? null,
        },
        contact: resume.contact,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        template: resume.template,
        style: (resume.style as ResumeLocalData["style"]) || defaultResumeData.style,
      });
      setLastSaved(new Date(resume.updatedAt));
    }
  }, [resume]);

  // Debounced save - accumulates changes and saves after 1.5s of inactivity
  // Shows "Saving..." immediately on change, keeps it visible for at least 1s after save completes
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Show saving indicator immediately
    setShowSaving(true);
    if (savingMinTimeRef.current) {
      clearTimeout(savingMinTimeRef.current);
      savingMinTimeRef.current = null;
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const updates = pendingUpdatesRef.current;
      if (Object.keys(updates).length === 0) {
        setShowSaving(false);
        return;
      }

      // Get latest clerkId from ref to avoid stale closure
      const currentClerkId = clerkIdRef.current;
      if (!currentClerkId) {
        // User not authenticated yet, reschedule save
        console.log("Waiting for authentication, rescheduling save...");
        saveTimeoutRef.current = setTimeout(() => {
          if (Object.keys(pendingUpdatesRef.current).length > 0) {
            scheduleSave();
          }
        }, 500);
        return;
      }

      setIsSaving(true);
      const saveStartTime = Date.now();
      try {
        // Convert null to undefined for Convex compatibility
        const convexUpdates: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updates)) {
          if (key === "personalDetails" && value && typeof value === "object") {
            const pd = value as typeof localData.personalDetails;
            convexUpdates[key] = {
              firstName: pd.firstName,
              lastName: pd.lastName,
              jobTitle: pd.jobTitle,
              photo: pd.photo ?? undefined,
            };
          } else {
            convexUpdates[key] = value;
          }
        }

        await updateResume({
          id: resumeId,
          clerkId: currentClerkId,
          updates: convexUpdates as Parameters<typeof updateResume>[0]["updates"],
        });
        pendingUpdatesRef.current = {};
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving resume:", error);
      } finally {
        setIsSaving(false);
        // Keep "Saving..." visible for at least 1s from when it first appeared
        const elapsed = Date.now() - saveStartTime;
        const remaining = Math.max(0, 1000 - elapsed);
        savingMinTimeRef.current = setTimeout(() => {
          setShowSaving(false);
          savingMinTimeRef.current = null;
        }, remaining);
      }
    }, 1500);
  }, [resumeId, updateResume]);



  const updateResumeData = useCallback((section: string, data: unknown) => {
    setLocalData((prev) => ({
      ...prev,
      [section]: data,
    }));
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, [section]: data };
    scheduleSave();
  }, [scheduleSave]);

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);
    try {
      const filename = `${localData.title || "resume"}.pdf`.replace(/[^a-z0-9.-]/gi, "_");
      await generateResumePDF(resumeId, { filename });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [localData.title, resumeId]);

  // Loading state - show if user or resume is not yet loaded
  if (!isUserLoaded || (resume === undefined && !hasInitializedRef.current)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!clerkId) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Please sign in</h1>
          <p className="text-sm text-muted-foreground">
            You need to be signed in to edit resumes.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Not found state - only show if we haven't initialized and resume is null
  if (resume === null && !hasInitializedRef.current) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Resume not found</h1>
          <p className="text-sm text-muted-foreground">
            This resume may have been deleted or you don&apos;t have access to it.
          </p>
          <Button asChild>
            <Link href="/app/resumes">Back to resumes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-border px-3 md:px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile/Tablet Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden cursor-pointer"
            onClick={() => setShowMobileMenu(true)}
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>

          {/* Home button - hidden below lg, shown in menu instead */}
          <Button variant="outline" size="icon" asChild className="hidden lg:flex cursor-pointer">
            <Link href="/app/resumes">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Center Section - Tabs (absolutely centered, hidden below lg) */}
        <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            className="pointer-events-auto"
          >
            <TabsList>
              <TabsTrigger value="write" className="cursor-pointer gap-1.5">
                <PencilSquareIcon className="h-4 w-4" />
                <span>Write</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="cursor-pointer gap-1.5">
                <PaintBrushIcon className="h-4 w-4" />
                <span>Design</span>
              </TabsTrigger>
              <TabsTrigger value="improve" className="cursor-pointer gap-1.5">
                <SparklesIcon className="h-4 w-4" />
                <span>Improve</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Save Status - fixed width to prevent layout shift */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground w-[70px]">
            {showSaving ? (
              <>
                <CloudArrowUpIcon className="h-4 w-4 animate-pulse shrink-0" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckIcon className="h-4 w-4 text-green-500 shrink-0" />
                <span>Saved</span>
              </>
            ) : null}
          </div>

          {/* Mobile Preview Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden cursor-pointer"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>

          <Button
            className="gap-2 cursor-pointer"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ArrowDownTrayIcon className="h-4 w-4" />
            )}
            <span className="hidden lg:inline">{isDownloading ? "Generating..." : "Download"}</span>
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-border lg:hidden flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileMenu(false)}
                  className="cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-auto">
                {/* Back to Dashboard */}
                <div className="p-3 border-b border-border">
                  <Button variant="outline" asChild className="w-full gap-2 cursor-pointer">
                    <Link href="/app/resumes" onClick={() => setShowMobileMenu(false)}>
                      <HomeIcon className="h-4 w-4" />
                      Back to Dashboard
                    </Link>
                  </Button>
                </div>

                {/* Tabs */}
                <div className="p-3 border-b border-border">
                  <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Mode</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab("write");
                        setShowMobileMenu(false);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === "write"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Write
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("design");
                        setShowMobileMenu(false);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === "design"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <PaintBrushIcon className="h-4 w-4" />
                      Design
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("improve");
                        setShowMobileMenu(false);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === "improve"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <SparklesIcon className="h-4 w-4" />
                      Improve
                    </button>
                  </div>
                </div>

                {/* Sections (only show when Write tab is active) */}
                {activeTab === "write" && (
                  <div className="p-3 border-b border-border">
                    <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sections</p>
                    <div className="space-y-1">
                      {writeSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => {
                              setActiveWriteSection(section.id);
                              setShowMobileMenu(false);
                            }}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              activeWriteSection === section.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {section.label}
                          </button>
                        );
                      })}

                      {/* Job Description - Fixed section */}
                      <div className="pt-2 mt-2 border-t border-border">
                        <button
                          onClick={() => {
                            setActiveWriteSection("jobDescription");
                            setShowMobileMenu(false);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            activeWriteSection === "jobDescription"
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <ClipboardDocumentListIcon className="h-4 w-4" />
                          Job Description
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Status on Mobile */}
                <div className="p-3">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    {showSaving ? (
                      <>
                        <CloudArrowUpIcon className="h-4 w-4 animate-pulse" />
                        <span>Saving...</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        <span>All changes saved</span>
                      </>
                    ) : (
                      <span>Ready to edit</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel + Center Panel */}
        <div className={`flex flex-1 min-w-0 overflow-hidden ${showMobilePreview ? 'hidden lg:flex' : ''}`}>
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "write" && (
              <motion.div
                key="write"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-1 min-w-0 overflow-hidden"
              >
                <WriteTab
                  resumeId={resumeId}
                  resumeData={localData}
                  resumeSource={resume?.source}
                  onUpdate={updateResumeData}
                  onSectionOrderChange={setSectionOrder}
                  onSectionsChange={setWriteSections}
                  onActiveSectionChange={setActiveWriteSection}
                  externalActiveSection={activeWriteSection}
                />
              </motion.div>
            )}
            {activeTab === "design" && (
              <motion.div
                key="design"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-1 min-w-0 overflow-hidden"
              >
                <DesignTab
                  resumeData={localData}
                  onUpdate={updateResumeData}
                />
              </motion.div>
            )}
            {activeTab === "improve" && (
              <motion.div
                key="improve"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-1 min-w-0 overflow-hidden"
              >
                <ImproveTab
                  resumeData={localData}
                  resumeId={resumeId}
                  onNavigate={(section) => {
                    setActiveTab("write");
                    setActiveWriteSection(section);
                  }}
                  onUpdate={updateResumeData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Preview (hidden on mobile unless toggled) */}
        <div className={`
          ${showMobilePreview ? 'flex absolute inset-0 z-30' : 'hidden'}
          lg:flex lg:relative lg:inset-auto lg:z-auto
          w-full lg:w-[45%]
          shrink-0
          border-l border-border
          bg-gray-100
          overflow-hidden
          flex-col
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-border shrink-0">
            <h3 className="font-medium text-sm">Preview</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobilePreview(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
          {/* Preview content with proper sizing */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            <ResumePreview data={localData} sectionOrder={sectionOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
