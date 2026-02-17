"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
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

// Default empty resume data for initial state
const defaultResumeData = {
  title: "Untitled Resume",
  jobDescription: "",
  personalDetails: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    photo: null as string | null,
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
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as Id<"resumes">;

  const [activeTab, setActiveTab] = useState<"write" | "design" | "improve">("write");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [localData, setLocalData] = useState(defaultResumeData);
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
  const [activeWriteSection, setActiveWriteSection] = useState("personalDetails");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch resume data from Convex
  const resume = useQuery(api.resumes.getResume, { id: resumeId });
  const updateResume = useMutation(api.resumes.updateResume);

  // Sync Convex data to local state when it changes
  useEffect(() => {
    if (resume) {
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
        style: resume.style,
      });
      if (!lastSaved) {
        setLastSaved(new Date(resume.updatedAt));
      }
    }
  }, [resume]);

  // Debounced save function
  const debouncedSave = useCallback(
    (updates: Partial<typeof localData>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);

      saveTimeoutRef.current = setTimeout(async () => {
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
            updates: convexUpdates as Parameters<typeof updateResume>[0]["updates"],
          });
          setLastSaved(new Date());
        } catch (error) {
          console.error("Error saving resume:", error);
        } finally {
          setIsSaving(false);
        }
      }, 500);
    },
    [resumeId, updateResume]
  );

  const handleTitleChange = (newTitle: string) => {
    setLocalData((prev) => ({ ...prev, title: newTitle }));
    debouncedSave({ title: newTitle });
  };

  const updateResumeData = (section: string, data: any) => {
    setLocalData((prev) => ({
      ...prev,
      [section]: data,
    }));
    debouncedSave({ [section]: data });
  };

  // Loading state
  if (resume === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (resume === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Resume not found</h1>
          <p className="text-sm text-muted-foreground">
            This resume may have been deleted or doesn't exist.
          </p>
          <Button asChild>
            <Link href="/app/resumes">Back to resumes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex h-screen flex-col bg-background"
    >
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3 md:px-4"
      >
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setShowMobileMenu(true)}
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>

          {/* Back button - hidden on mobile, shown in menu instead */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild className="hidden md:flex cursor-pointer">
                <Link href="/app/resumes">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to dashboard</TooltipContent>
          </Tooltip>

          <Input
            value={localData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="h-9 w-[140px] md:w-[200px] lg:w-[240px] text-sm font-medium"
            placeholder="Untitled Resume"
          />
        </div>

        {/* Center Section - Tabs (hidden on mobile) */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="hidden md:block"
        >
          <TabsList>
            <TabsTrigger value="write" className="cursor-pointer gap-1.5">
              <PencilSquareIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Write</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="cursor-pointer gap-1.5">
              <PaintBrushIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="improve" className="cursor-pointer gap-1.5">
              <SparklesIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Improve</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Save Status */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            {isSaving ? (
              <>
                <CloudArrowUpIcon className="h-4 w-4 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckIcon className="h-4 w-4 text-green-500" />
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

          <Button className="gap-2 cursor-pointer">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span className="hidden md:inline">Download</span>
          </Button>
        </div>
      </motion.header>

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
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-border md:hidden flex flex-col"
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
                  <Link
                    href="/app/resumes"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
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
                    {isSaving ? (
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-1 overflow-hidden relative"
      >
        {/* Left Panel + Center Panel */}
        <div className={`flex flex-1 overflow-hidden ${showMobilePreview ? 'hidden lg:flex' : ''}`}>
          {activeTab === "write" && (
            <WriteTab
              resumeData={localData}
              onUpdate={updateResumeData}
              onSectionOrderChange={setSectionOrder}
              onSectionsChange={setWriteSections}
              onActiveSectionChange={setActiveWriteSection}
              externalActiveSection={activeWriteSection}
            />
          )}
          {activeTab === "design" && (
            <DesignTab
              resumeData={localData}
              onUpdate={updateResumeData}
            />
          )}
          {activeTab === "improve" && (
            <ImproveTab
              resumeData={localData}
              onNavigate={(section) => {
                setActiveTab("write");
                // TODO: Scroll to section
              }}
            />
          )}
        </div>

        {/* Right Panel - Preview (hidden on mobile unless toggled) */}
        <div className={`
          ${showMobilePreview ? 'flex absolute inset-0 z-30' : 'hidden'}
          lg:flex lg:relative lg:inset-auto lg:z-auto
          w-full lg:w-[45%]
          shrink-0
          border-l border-border
          bg-background lg:bg-muted/30
          overflow-hidden
          flex-col
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-border shrink-0">
            <h3 className="font-medium text-sm">Preview</h3>
            <Button
              variant="ghost"
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
      </motion.div>
    </motion.div>
  );
}
