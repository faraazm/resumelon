"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeftIcon,
  CheckIcon,
  CloudArrowUpIcon,
  EyeIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Import editor components
import { CoverLetterWriteTab } from "@/components/app/editor/cover-letter-write-tab";
import { CoverLetterPreview } from "@/components/app/editor/cover-letter-preview";

// Default empty cover letter data for initial state
const defaultCoverLetterData = {
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
};

// Section configuration for sidebar
const coverLetterSections = [
  { id: "personalDetails", label: "Personal Details", icon: UserIcon },
  { id: "letterContent", label: "Letter Content", icon: DocumentTextIcon },
];

export default function CoverLetterEditorPage() {
  const params = useParams();
  const coverLetterId = params.id as Id<"coverLetters">;
  const { user, isLoaded: isUserLoaded } = useUser();
  const clerkId = user?.id;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [localData, setLocalData] = useState(defaultCoverLetterData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("personalDetails");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingUpdatesRef = useRef<Partial<typeof localData>>({});
  const clerkIdRef = useRef(clerkId);

  // Keep clerkId ref in sync with latest value
  useEffect(() => {
    clerkIdRef.current = clerkId;
  }, [clerkId]);

  // Fetch cover letter data from Convex (only when user is loaded)
  const coverLetter = useQuery(
    api.coverLetters.getCoverLetter,
    clerkId ? { id: coverLetterId, clerkId } : "skip"
  );
  const updateCoverLetter = useMutation(api.coverLetters.updateCoverLetter);

  // Sync Convex data to local state ONLY on initial load
  useEffect(() => {
    if (coverLetter && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLocalData({
        title: coverLetter.title,
        personalDetails: coverLetter.personalDetails || defaultCoverLetterData.personalDetails,
        letterContent: coverLetter.letterContent || defaultCoverLetterData.letterContent,
      });
      setLastSaved(new Date(coverLetter.updatedAt));
    }
  }, [coverLetter]);

  // Debounced save - accumulates changes and saves after 1.5s of inactivity
  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const updates = pendingUpdatesRef.current;
      if (Object.keys(updates).length === 0) return;

      const currentClerkId = clerkIdRef.current;
      if (!currentClerkId) {
        console.log("Waiting for authentication, rescheduling save...");
        saveTimeoutRef.current = setTimeout(() => {
          if (Object.keys(pendingUpdatesRef.current).length > 0) {
            scheduleSave();
          }
        }, 500);
        return;
      }

      setIsSaving(true);
      try {
        await updateCoverLetter({
          id: coverLetterId,
          clerkId: currentClerkId,
          updates: updates as Parameters<typeof updateCoverLetter>[0]["updates"],
        });
        pendingUpdatesRef.current = {};
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving cover letter:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  }, [coverLetterId, updateCoverLetter]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setLocalData((prev) => ({ ...prev, title: newTitle }));
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, title: newTitle };
    scheduleSave();
  }, [scheduleSave]);

  const updateCoverLetterData = useCallback((section: string, data: any) => {
    setLocalData((prev) => ({
      ...prev,
      [section]: data,
    }));
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, [section]: data };
    scheduleSave();
  }, [scheduleSave]);

  // Loading state
  if (!isUserLoaded || (coverLetter === undefined && !hasInitializedRef.current)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading cover letter...</p>
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
            You need to be signed in to edit cover letters.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (coverLetter === null && !hasInitializedRef.current) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Cover letter not found</h1>
          <p className="text-sm text-muted-foreground">
            This cover letter may have been deleted or you don't have access to it.
          </p>
          <Button asChild>
            <Link href="/app/cover-letters">Back to cover letters</Link>
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

          {/* Back button - hidden on mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" asChild className="hidden md:flex cursor-pointer">
                <Link href="/app/cover-letters">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to cover letters</TooltipContent>
          </Tooltip>

          <Input
            value={localData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="h-9 w-[140px] md:w-[200px] lg:w-[240px] text-sm font-medium"
            placeholder="Untitled Cover Letter"
          />
        </div>

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
                    href="/app/cover-letters"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Cover Letters
                  </Link>
                </div>

                {/* Sections */}
                <div className="p-3 border-b border-border">
                  <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sections</p>
                  <div className="space-y-1">
                    {coverLetterSections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setShowMobileMenu(false);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            activeSection === section.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {section.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
          <CoverLetterWriteTab
            coverLetterId={coverLetterId}
            coverLetterData={localData}
            onUpdate={updateCoverLetterData}
            activeSection={activeSection}
            onActiveSectionChange={setActiveSection}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className={`
          ${showMobilePreview ? 'flex absolute inset-0 z-30' : 'hidden'}
          lg:flex lg:relative lg:inset-auto lg:z-auto
          w-full lg:w-[45%]
          shrink-0
          border-l border-border
          bg-background lg:bg-gray-100
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
          {/* Preview content */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            <CoverLetterPreview data={localData} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
