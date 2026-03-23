"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
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
  EyeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { CoverLetterWriteTab } from "@/components/app/editor/cover-letter-write-tab";
import { CoverLetterDesignTab } from "@/components/app/editor/cover-letter-design-tab";
import { CoverLetterPreview } from "@/components/app/editor/cover-letter-preview";
import { generateCoverLetterPDF } from "@/lib/cover-letter-pdf-generator";

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
  template: "ats-classic",
  style: {
    font: "inter",
    spacing: "normal",
    accentColor: "#000000",
  },
};

export default function CoverLetterEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading cover letter...</p>
          </div>
        </div>
      }
    >
      <CoverLetterEditorContent />
    </Suspense>
  );
}

function CoverLetterEditorContent() {
  const params = useParams();
  const coverLetterId = params.id as Id<"coverLetters">;
  const { user, isLoaded: isUserLoaded } = useUser();
  const clerkId = user?.id;

  const [activeTab, setActiveTab] = useState<"write" | "design">("write");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const savingMinTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localData, setLocalData] = useState(defaultCoverLetterData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeWriteSection, setActiveWriteSection] = useState("personalDetails");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingUpdatesRef = useRef<Partial<typeof localData>>({});
  const clerkIdRef = useRef(clerkId);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    clerkIdRef.current = clerkId;
  }, [clerkId]);

  const coverLetter = useQuery(
    api.coverLetters.getCoverLetter,
    clerkId ? { id: coverLetterId, clerkId } : "skip"
  );
  const updateCoverLetter = useMutation(api.coverLetters.updateCoverLetter);

  useEffect(() => {
    if (coverLetter && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLocalData({
        title: coverLetter.title,
        personalDetails: coverLetter.personalDetails || defaultCoverLetterData.personalDetails,
        letterContent: coverLetter.letterContent || defaultCoverLetterData.letterContent,
        template: coverLetter.template || "ats-classic",
        style: coverLetter.style || defaultCoverLetterData.style,
      });
      setLastSaved(new Date(coverLetter.updatedAt));
    }
  }, [coverLetter]);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setShowSaving(true);
    if (savingMinTimeRef.current) {
      clearTimeout(savingMinTimeRef.current);
      savingMinTimeRef.current = null;
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const updates = pendingUpdatesRef.current;
      if (Object.keys(updates).length === 0) { setShowSaving(false); return; }

      const currentClerkId = clerkIdRef.current;
      if (!currentClerkId) {
        saveTimeoutRef.current = setTimeout(() => {
          if (Object.keys(pendingUpdatesRef.current).length > 0) scheduleSave();
        }, 500);
        return;
      }

      setIsSaving(true);
      const saveStartTime = Date.now();
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
        const elapsed = Date.now() - saveStartTime;
        const remaining = Math.max(0, 1000 - elapsed);
        savingMinTimeRef.current = setTimeout(() => {
          setShowSaving(false);
          savingMinTimeRef.current = null;
        }, remaining);
      }
    }, 1500);
  }, [coverLetterId, updateCoverLetter]);

  const updateData = useCallback(
    (section: string, data: any) => {
      setLocalData((prev) => ({ ...prev, [section]: data }));
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, [section]: data };
      scheduleSave();
    },
    [scheduleSave]
  );

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);
    try {
      const filename = `${localData.title || "cover-letter"}.pdf`.replace(/[^a-z0-9.-]/gi, "_");
      await generateCoverLetterPDF(coverLetterId, { filename });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [localData.title, coverLetterId]);

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

  if (!clerkId) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Please sign in</h1>
          <Button asChild><Link href="/sign-in">Sign in</Link></Button>
        </div>
      </div>
    );
  }

  if (coverLetter === null && !hasInitializedRef.current) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">Cover letter not found</h1>
          <Button asChild><Link href="/app/cover-letters">Back to cover letters</Link></Button>
        </div>
      </div>
    );
  }

  const writeSections = [
    { id: "personalDetails", label: "Personal Details" },
    { id: "letterContent", label: "Letter Content" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="relative flex h-14 shrink-0 items-center justify-between border-b border-border px-3 md:px-4"
      >
        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer" onClick={() => setShowMobileMenu(true)}>
            <Bars3Icon className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" asChild className="hidden lg:flex cursor-pointer">
            <Link href="/app/cover-letters"><HomeIcon className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="pointer-events-auto">
            <TabsList>
              <TabsTrigger value="write" className="cursor-pointer gap-1.5">
                <PencilSquareIcon className="h-4 w-4" /><span>Write</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="cursor-pointer gap-1.5">
                <PaintBrushIcon className="h-4 w-4" /><span>Design</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground w-[70px]">
            {showSaving ? (
              <><CloudArrowUpIcon className="h-4 w-4 animate-pulse shrink-0" /><span>Saving...</span></>
            ) : lastSaved ? (
              <><CheckIcon className="h-4 w-4 text-green-500 shrink-0" /><span>Saved</span></>
            ) : null}
          </div>
          <Button variant="outline" size="icon" className="lg:hidden cursor-pointer" onClick={() => setShowMobilePreview(!showMobilePreview)}>
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button className="gap-2 cursor-pointer" onClick={handleDownloadPDF} disabled={isDownloading}>
            {isDownloading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ArrowDownTrayIcon className="h-4 w-4" />
            )}
            <span className="hidden lg:inline">{isDownloading ? "Generating..." : "Download"}</span>
          </Button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setShowMobileMenu(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.2, ease: "easeOut" }} className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-border lg:hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} className="cursor-pointer"><XMarkIcon className="h-5 w-5" /></Button>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="p-3 border-b border-border">
                  <Button variant="outline" asChild className="w-full gap-2 cursor-pointer">
                    <Link href="/app/cover-letters" onClick={() => setShowMobileMenu(false)}>
                      <HomeIcon className="h-4 w-4" />Back to Dashboard
                    </Link>
                  </Button>
                </div>
                <div className="p-3 border-b border-border">
                  <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Mode</p>
                  <div className="space-y-1">
                    {(["write", "design"] as const).map((tab) => (
                      <button key={tab} onClick={() => { setActiveTab(tab); setShowMobileMenu(false); }}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                        {tab === "write" ? <PencilSquareIcon className="h-4 w-4" /> : <PaintBrushIcon className="h-4 w-4" />}
                        {tab === "write" ? "Write" : "Design"}
                      </button>
                    ))}
                  </div>
                </div>
                {activeTab === "write" && (
                  <div className="p-3 border-b border-border">
                    <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sections</p>
                    <div className="space-y-1">
                      {writeSections.map((section) => (
                        <button key={section.id} onClick={() => { setActiveWriteSection(section.id); setShowMobileMenu(false); }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeWriteSection === section.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    {showSaving ? (<><CloudArrowUpIcon className="h-4 w-4 animate-pulse" /><span>Saving...</span></>) : lastSaved ? (<><CheckIcon className="h-4 w-4 text-green-500" /><span>All changes saved</span></>) : (<span>Ready to edit</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex flex-1 overflow-hidden relative">
        <div className={`flex flex-1 min-w-0 overflow-hidden ${showMobilePreview ? "hidden lg:flex" : ""}`}>
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "write" && (
              <motion.div key="write" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="flex flex-1 min-w-0 overflow-hidden">
                <CoverLetterWriteTab
                  coverLetterId={coverLetterId}
                  coverLetterData={localData}
                  onUpdate={updateData}
                  activeSection={activeWriteSection}
                  onActiveSectionChange={setActiveWriteSection}
                />
              </motion.div>
            )}
            {activeTab === "design" && (
              <motion.div key="design" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="flex flex-1 min-w-0 overflow-hidden">
                <CoverLetterDesignTab coverLetterData={localData} onUpdate={updateData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`${showMobilePreview ? "flex absolute inset-0 z-30" : "hidden"} lg:flex lg:relative lg:inset-auto lg:z-auto w-full lg:w-[45%] shrink-0 border-l border-border bg-gray-100 overflow-hidden flex-col`}>
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-border shrink-0">
            <h3 className="font-medium text-sm">Preview</h3>
            <Button variant="outline" size="sm" onClick={() => setShowMobilePreview(false)} className="cursor-pointer">Close</Button>
          </div>
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            <CoverLetterPreview data={localData} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
