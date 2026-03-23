"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction, useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DatePicker, MonthYearPicker } from "@/components/ui/date-picker";
import {
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  SparklesIcon,
  Bars3Icon,
  LinkIcon,
  BookOpenIcon,
  HeartIcon,
  LanguageIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor, ToneType, AIUsageState } from "@/components/ui/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeUrl, sanitizeHtml } from "@/lib/sanitize";

// Animation variants for content transitions
const contentVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Section Header component with Edit and Delete icons
function SectionHeader({
  title,
  description,
  icon: Icon,
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 min-w-0">
          {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
          <span className="truncate">{title}</span>
        </h2>
        <div className="flex items-center gap-0.5 shrink-0">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-primary"
              onClick={onEdit}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

interface WriteTabProps {
  resumeId: Id<"resumes">;
  resumeData: any;
  resumeSource?: string;
  onUpdate: (section: string, data: any) => void;
  onSectionOrderChange?: (sectionOrder: string[]) => void;
  // For mobile menu integration
  onSectionsChange?: (sections: Array<{ id: string; label: string; icon: any }>) => void;
  onActiveSectionChange?: (sectionId: string) => void;
  externalActiveSection?: string;
}

// All available sections with their default labels and descriptions
const allSectionsConfig: Record<string, { defaultLabel: string; icon: any; description: string; isDefault: boolean }> = {
  personalDetails: { defaultLabel: "Personal Details", icon: UserIcon, description: "Basic information that appears at the top", isDefault: true },
  contact: { defaultLabel: "Contact Information", icon: PhoneIcon, description: "How employers can reach you", isDefault: true },
  summary: { defaultLabel: "Professional Summary", icon: DocumentTextIcon, description: "A brief overview of your experience", isDefault: true },
  experience: { defaultLabel: "Employment History", icon: BriefcaseIcon, description: "Your work experience", isDefault: true },
  education: { defaultLabel: "Education", icon: AcademicCapIcon, description: "Your educational background", isDefault: true },
  skills: { defaultLabel: "Skills", icon: WrenchScrewdriverIcon, description: "Skills relevant to the job", isDefault: true },
  internships: { defaultLabel: "Internships", icon: BuildingOfficeIcon, description: "Add your internship experience", isDefault: false },
  courses: { defaultLabel: "Courses", icon: BookOpenIcon, description: "Certificates and additional training", isDefault: false },
  references: { defaultLabel: "References", icon: UserGroupIcon, description: "Professional references", isDefault: false },
  languages: { defaultLabel: "Languages", icon: LanguageIcon, description: "Languages you speak", isDefault: false },
  links: { defaultLabel: "Links", icon: LinkIcon, description: "Portfolio, website, or social links", isDefault: false },
  hobbies: { defaultLabel: "Hobbies", icon: HeartIcon, description: "Personal interests and hobbies", isDefault: false },
  custom: { defaultLabel: "Custom Section", icon: PencilSquareIcon, description: "Create your own section", isDefault: false },
};

// Initial sections when editing a resume
export const initialSections = [
  { id: "personalDetails", label: "Personal Details", icon: UserIcon },
  { id: "contact", label: "Contact Information", icon: PhoneIcon },
  { id: "summary", label: "Professional Summary", icon: DocumentTextIcon },
  { id: "experience", label: "Employment History", icon: BriefcaseIcon },
  { id: "education", label: "Education", icon: AcademicCapIcon },
  { id: "skills", label: "Skills", icon: WrenchScrewdriverIcon },
];

// Export icon mapping for external use
export const sectionIcons = {
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  UserGroupIcon,
  LanguageIcon,
  LinkIcon,
  HeartIcon,
  PencilSquareIcon,
  ClipboardDocumentListIcon,
};

export function WriteTab({
  resumeId,
  resumeData,
  resumeSource,
  onUpdate,
  onSectionOrderChange,
  onSectionsChange,
  onActiveSectionChange,
  externalActiveSection
}: WriteTabProps) {
  const [internalActiveSection, setInternalActiveSection] = useState("personalDetails");
  const [sections, setSections] = useState(initialSections);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showDeleteSectionDialog, setShowDeleteSectionDialog] = useState(false);
  const [showEditSectionDialog, setShowEditSectionDialog] = useState(false);
  const [editingSectionLabel, setEditingSectionLabel] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // Shared confirmation state for item-level deletes (e.g. a single job entry)
  const [pendingItemRemove, setPendingItemRemove] = useState<{ label: string; onConfirm: () => void } | null>(null);

  // Optimization limit for free users
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const optimizationLimit = useQuery(
    api.users.getRemainingOptimizations,
    clerkId ? { clerkId } : "skip"
  );
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const canOptimize = !optimizationLimit || optimizationLimit.remaining > 0;
  const handleOptimizeLimitReached = useCallback(() => setShowUpgradeDialog(true), []);
  // Server-side increment happens inside generateImprovedContent action
  const handleOptimizationUsed = useCallback(() => {}, []);

  // Persisted AI usage state map - keyed by fieldType + fieldId, survives tab switches
  const [aiUsageStates, setAIUsageStates] = useState<Record<string, AIUsageState>>({});
  const getAIUsageState = useCallback((key: string) => aiUsageStates[key], [aiUsageStates]);
  const setAIUsageState = useCallback((key: string, state: AIUsageState) => {
    setAIUsageStates(prev => ({ ...prev, [key]: state }));
  }, []);

  const confirmItemRemove = useCallback((label: string, onConfirm: () => void) => {
    setPendingItemRemove({ label, onConfirm });
  }, []);

  // Use external active section if provided, otherwise use internal state
  const activeSection = externalActiveSection ?? internalActiveSection;
  const setActiveSection = (sectionId: string) => {
    setInternalActiveSection(sectionId);
    onActiveSectionChange?.(sectionId);
  };

  // Notify parent of sections changes
  useEffect(() => {
    onSectionsChange?.(sections);
  }, [sections, onSectionsChange]);

  // Get current section info
  const currentSectionInfo = sections.find((s) => s.id === activeSection);

  // Handle editing section label
  const handleEditSection = () => {
    if (currentSectionInfo) {
      setEditingSectionLabel(currentSectionInfo.label);
      setShowEditSectionDialog(true);
    }
  };

  const handleSaveEditSection = () => {
    if (currentSectionInfo && editingSectionLabel.trim()) {
      const newSections = sections.map((s) =>
        s.id === activeSection ? { ...s, label: editingSectionLabel.trim() } : s
      );
      updateSectionsAndNotify(newSections);
    }
    setShowEditSectionDialog(false);
  };

  // Handle deleting a section
  const handleDeleteSection = () => {
    const sectionId = activeSection;

    // Clear the data for this section based on its type
    if (sectionId === "hobbies" || sectionId === "jobDescription") {
      onUpdate(sectionId, "");
    } else if (sectionId === "custom") {
      onUpdate(sectionId, { title: "", content: "" });
    } else if (sectionId === "summary") {
      onUpdate(sectionId, "");
    } else if (sectionId === "skills") {
      onUpdate(sectionId, []);
    } else if (sectionId === "personalDetails") {
      onUpdate(sectionId, { firstName: "", lastName: "", jobTitle: "", photo: null });
    } else if (sectionId === "contact") {
      onUpdate(sectionId, { email: "", phone: "", linkedin: "", location: "" });
    } else {
      onUpdate(sectionId, []);
    }

    // Remove from sections list
    const newSections = sections.filter((s) => s.id !== sectionId);
    updateSectionsAndNotify(newSections);

    // Navigate to first available section
    if (newSections.length > 0) {
      setActiveSection(newSections[0].id);
    }

    setShowDeleteSectionDialog(false);
  };

  const currentIndex = sections.findIndex((s) => s.id === activeSection);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const updateSectionsAndNotify = (newSections: typeof sections) => {
    setSections(newSections);
    // Notify parent of section order change for real-time preview update
    if (onSectionOrderChange) {
      onSectionOrderChange(newSections.map((s) => s.id));
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    updateSectionsAndNotify(newSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const addSection = (sectionId: string) => {
    const config = allSectionsConfig[sectionId];
    if (!config) return;

    const newSection = {
      id: sectionId,
      label: config.defaultLabel,
      icon: config.icon,
    };
    const newSections = [...sections, newSection];
    updateSectionsAndNotify(newSections);
    setShowAddSectionDialog(false);
    setActiveSection(sectionId);
  };

  // Get available sections (not already added) - includes both default and additional
  const availableSections = Object.entries(allSectionsConfig)
    .filter(([id]) => !sections.find((s) => s.id === id))
    .map(([id, config]) => ({
      id,
      label: config.defaultLabel,
      icon: config.icon,
      description: config.description,
      isDefault: config.isDefault,
    }));

  // Handle sidebar drag and drop
  const handleSidebarDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSidebarDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    updateSectionsAndNotify(newSections);
    setDraggedIndex(index);
  };

  const handleSidebarDragEnd = () => {
    setDraggedIndex(null);
  };

  const sidebarContent = (
    <div className="p-1.5 space-y-0.5">
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        const isDragging = draggedIndex === index;
        return (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleSidebarDragStart(e, index)}
            onDragOver={(e) => handleSidebarDragOver(e, index)}
            onDragEnd={handleSidebarDragEnd}
            onClick={() => setActiveSection(section.id)}
            className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-colors cursor-pointer ${
              isDragging
                ? "opacity-50 border border-dashed border-primary"
                : ""
            } ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
            }`}
          >
            <div className="relative h-4 w-4 shrink-0">
              <section.icon className="h-4 w-4 absolute inset-0 transition-opacity group-hover:opacity-0" />
              <Bars3Icon className="h-4 w-4 absolute inset-0 text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="truncate">{section.label}</span>
          </div>
        );
      })}

      <Separator className="my-2" />

      {/* Job Description - Fixed section */}
      <div
        onClick={() => setActiveSection("jobDescription")}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-colors cursor-pointer ${
          activeSection === "jobDescription"
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
        }`}
      >
        <ClipboardDocumentListIcon className="h-4 w-4 shrink-0" />
        <span className="truncate">Job Description</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-gray-600 font-medium cursor-pointer text-xs px-2 py-2 h-auto"
        onClick={() => setShowAddSectionDialog(true)}
      >
        <PlusIcon className="h-4 w-4 shrink-0" />
        Add Section
      </Button>
    </div>
  );

  return (
    <div className="relative flex flex-1 min-w-0 overflow-hidden flex-col lg:flex-row">
      {/* Left Sidebar - Desktop (lg+) */}
      <div className="hidden lg:block w-48 shrink-0 border-r border-border bg-muted/20">
        <ScrollArea className="h-full">
          {sidebarContent}
        </ScrollArea>
      </div>

      {/* Center Panel - Form Editor */}
      <div className="flex-1 min-w-0 overflow-hidden @container">
        <ScrollArea className="h-full [&_[data-slot=scroll-area-viewport]>div]:!block">
          <div className="p-4 @md:p-6 overflow-hidden">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeSection === "jobDescription" && (
                  <JobDescriptionForm
                    data={resumeData.jobDescription || ""}
                    onUpdate={(data) => onUpdate("jobDescription", data)}
                    sectionLabel={currentSectionInfo?.label || "Job Description"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "personalDetails" && (
                  <PersonalDetailsForm
                    data={resumeData.personalDetails}
                    onUpdate={(data) => onUpdate("personalDetails", data)}
                    sectionLabel={currentSectionInfo?.label || "Personal Details"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "contact" && (
                  <ContactForm
                    data={resumeData.contact}
                    onUpdate={(data) => onUpdate("contact", data)}
                    sectionLabel={currentSectionInfo?.label || "Contact Information"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "summary" && (
                  <SummaryForm
                    resumeId={resumeId}
                    clerkId={clerkId}
                    data={resumeData.summary}
                    onUpdate={(data) => onUpdate("summary", data)}
                    sectionLabel={currentSectionInfo?.label || "Professional Summary"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    skipAutoGen={resumeSource === "ai_generated" || resumeSource === "optimized" || resumeSource === "upload"}
                    aiUsageState={getAIUsageState("summary")}
                    onAIUsageStateChange={(s) => setAIUsageState("summary", s)}
                    canOptimize={canOptimize}
                    onOptimizeLimitReached={handleOptimizeLimitReached}
                    onOptimizationUsed={handleOptimizationUsed}
                  />
                )}
                {activeSection === "experience" && (
                  <ExperienceForm
                    resumeId={resumeId}
                    clerkId={clerkId}
                    data={resumeData.experience}
                    onUpdate={(data) => onUpdate("experience", data)}
                    sectionLabel={currentSectionInfo?.label || "Employment History"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    skipAutoGen={resumeSource === "ai_generated" || resumeSource === "optimized" || resumeSource === "upload"}
                    onConfirmRemove={confirmItemRemove}
                    getAIUsageState={getAIUsageState}
                    setAIUsageState={setAIUsageState}
                    canOptimize={canOptimize}
                    onOptimizeLimitReached={handleOptimizeLimitReached}
                    onOptimizationUsed={handleOptimizationUsed}
                  />
                )}
                {activeSection === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onUpdate={(data) => onUpdate("education", data)}
                    sectionLabel={currentSectionInfo?.label || "Education"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    onConfirmRemove={confirmItemRemove}
                  />
                )}
                {activeSection === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onUpdate={(data) => onUpdate("skills", data)}
                    sectionLabel={currentSectionInfo?.label || "Skills"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "internships" && (
                  <InternshipsForm
                    resumeId={resumeId}
                    clerkId={clerkId}
                    data={resumeData.internships || []}
                    onUpdate={(data) => onUpdate("internships", data)}
                    sectionLabel={currentSectionInfo?.label || "Internships"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    skipAutoGen={resumeSource === "ai_generated" || resumeSource === "optimized" || resumeSource === "upload"}
                    onConfirmRemove={confirmItemRemove}
                    getAIUsageState={getAIUsageState}
                    setAIUsageState={setAIUsageState}
                    canOptimize={canOptimize}
                    onOptimizeLimitReached={handleOptimizeLimitReached}
                    onOptimizationUsed={handleOptimizationUsed}
                  />
                )}
                {activeSection === "courses" && (
                  <CoursesForm
                    data={resumeData.courses || []}
                    onUpdate={(data) => onUpdate("courses", data)}
                    sectionLabel={currentSectionInfo?.label || "Courses & Certificates"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    onConfirmRemove={confirmItemRemove}
                  />
                )}
                {activeSection === "references" && (
                  <ReferencesForm
                    data={resumeData.references || []}
                    onUpdate={(data) => onUpdate("references", data)}
                    sectionLabel={currentSectionInfo?.label || "References"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    onConfirmRemove={confirmItemRemove}
                  />
                )}
                {activeSection === "languages" && (
                  <LanguagesForm
                    data={resumeData.languages || []}
                    onUpdate={(data) => onUpdate("languages", data)}
                    sectionLabel={currentSectionInfo?.label || "Languages"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    onConfirmRemove={confirmItemRemove}
                  />
                )}
                {activeSection === "links" && (
                  <LinksForm
                    data={resumeData.links || []}
                    onUpdate={(data) => onUpdate("links", data)}
                    sectionLabel={currentSectionInfo?.label || "Links"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    onConfirmRemove={confirmItemRemove}
                  />
                )}
                {activeSection === "hobbies" && (
                  <HobbiesForm
                    resumeId={resumeId}
                    clerkId={clerkId}
                    data={resumeData.hobbies || ""}
                    onUpdate={(data) => onUpdate("hobbies", data)}
                    sectionLabel={currentSectionInfo?.label || "Hobbies & Interests"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    aiUsageState={getAIUsageState("hobbies")}
                    onAIUsageStateChange={(s) => setAIUsageState("hobbies", s)}
                    canOptimize={canOptimize}
                    onOptimizeLimitReached={handleOptimizeLimitReached}
                    onOptimizationUsed={handleOptimizationUsed}
                  />
                )}
                {activeSection === "custom" && (
                  <CustomSectionForm
                    resumeId={resumeId}
                    clerkId={clerkId}
                    data={resumeData.custom || { title: "", content: "" }}
                    onUpdate={(data) => onUpdate("custom", data)}
                    sectionLabel={currentSectionInfo?.label || "Custom Section"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                    aiUsageState={getAIUsageState("custom")}
                    onAIUsageStateChange={(s) => setAIUsageState("custom", s)}
                    canOptimize={canOptimize}
                    onOptimizeLimitReached={handleOptimizeLimitReached}
                    onOptimizationUsed={handleOptimizationUsed}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Previous/Next Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="cursor-pointer"
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentIndex === sections.length - 1}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={showAddSectionDialog} onOpenChange={setShowAddSectionDialog}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Choose a section to add to your resume
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 px-6 min-h-0">
            <div className="space-y-2 py-4">
              {/* Default Sections */}
              {availableSections.filter(s => s.isDefault).length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Standard Sections
                  </p>
                  {availableSections.filter(s => s.isDefault).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => addSection(section.id)}
                      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-foreground/30 hover:bg-muted/50 mb-2 cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <section.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{section.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                      <PlusIcon className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {/* Additional Sections */}
              {availableSections.filter(s => !s.isDefault).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Additional Sections
                  </p>
                  {availableSections.filter(s => !s.isDefault).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => addSection(section.id)}
                      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-foreground/30 hover:bg-muted/50 mb-2 cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <section.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{section.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                      <PlusIcon className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {availableSections.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  All available sections have been added
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={showEditSectionDialog} onOpenChange={setShowEditSectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Change the title of this section
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="sectionLabel">Section Title</Label>
            <Input
              id="sectionLabel"
              value={editingSectionLabel}
              onChange={(e) => setEditingSectionLabel(e.target.value)}
              placeholder="Enter section title"
              className="mt-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditSectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditSection}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Section Confirmation Dialog */}
      <AlertDialog open={showDeleteSectionDialog} onOpenChange={setShowDeleteSectionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{currentSectionInfo?.label}" section?
              This will remove all data in this section. You can add it back later from the Add Section menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSection}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Item Confirmation Dialog (shared across all form sections) */}
      <AlertDialog open={!!pendingItemRemove} onOpenChange={(open) => { if (!open) setPendingItemRemove(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{pendingItemRemove?.label}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pendingItemRemove?.onConfirm();
                setPendingItemRemove(null);
              }}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpgradeDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog} />
    </div>
  );
}

// Job Description Form
function JobDescriptionForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: string;
  onUpdate: (data: string) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Paste the job description you're applying for"
        icon={ClipboardDocumentListIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        <Textarea
          placeholder="Paste the full job description here. Include the job title, requirements, responsibilities, and any other relevant details. This helps our AI tailor your resume to match what the employer is looking for."
          value={data || ""}
          onChange={(e) => onUpdate(e.target.value)}
          className="min-h-[250px] max-h-[400px] overflow-y-auto resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Adding a job description helps the AI suggest improvements tailored to the specific role
        </p>
      </div>

      {/* AI Suggestion Card */}
      {data && data.trim().length > 50 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <SparklesIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Job Description Added
              </p>
              <p className="text-xs text-muted-foreground">
                Go to the Improve tab to get AI suggestions for tailoring your resume to this job
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Photo Preview Component - fetches and displays image from Convex storage
function PhotoPreview({ storageId }: { storageId: string }) {
  const [error, setError] = useState(false);

  // Use Convex query to get the file URL
  const imageUrl = useQuery(
    api.storage.getUrl,
    storageId ? { storageId: storageId as Id<"_storage"> } : "skip"
  );

  if (error || !imageUrl) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <UserIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Profile photo"
      className="h-full w-full object-cover"
      onError={() => setError(true)}
    />
  );
}

// Personal Details Form
function PersonalDetailsForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: any;
  onUpdate: (data: any) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex mutations for file upload
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  // Track which optional fields are enabled (shown) - check if key exists in data, not just truthy value
  const [enabledOptionalFields, setEnabledOptionalFields] = useState<Set<string>>(() => {
    const enabled = new Set<string>();
    if (data && "nationality" in data) enabled.add("nationality");
    if (data && "driverLicense" in data) enabled.add("driverLicense");
    if (data && "birthDate" in data) enabled.add("birthDate");
    return enabled;
  });

  const handleChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await response.json();

      // Get the public URL for the uploaded file
      // Convex storage URLs are formatted as: https://<deployment>.convex.cloud/api/storage/<storageId>
      const photoUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".cloud/", ".site/")}/getImage?storageId=${storageId}`;

      // For now, store the storageId directly - we'll use a query to get the URL
      onUpdate({ ...data, photo: storageId });
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = () => {
    onUpdate({ ...data, photo: null });
  };

  // Check which optional fields are enabled (shown)
  const hasNationality = enabledOptionalFields.has("nationality");
  const hasDriverLicense = enabledOptionalFields.has("driverLicense");
  const hasBirthDate = enabledOptionalFields.has("birthDate");

  const optionalFieldOptions = [
    { id: "nationality", label: "Nationality", enabled: hasNationality },
    { id: "driverLicense", label: "Driver License", enabled: hasDriverLicense },
    { id: "birthDate", label: "Date of Birth", enabled: hasBirthDate },
  ];

  const toggleOptionalField = (fieldId: string) => {
    const isEnabled = enabledOptionalFields.has(fieldId);
    if (isEnabled) {
      // Remove the field
      const newData = { ...data };
      delete newData[fieldId];
      onUpdate(newData);
      setEnabledOptionalFields((prev) => {
        const next = new Set(prev);
        next.delete(fieldId);
        return next;
      });
    } else {
      // Add the field with empty value
      onUpdate({ ...data, [fieldId]: "" });
      setEnabledOptionalFields((prev) => new Set(prev).add(fieldId));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Basic information that appears at the top of your resume"
        icon={UserIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="grid gap-4 @sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            value={data?.firstName || ""}
            onChange={(e) => handleChange("firstName", sanitizeText(e.target.value, 50))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={data?.lastName || ""}
            onChange={(e) => handleChange("lastName", sanitizeText(e.target.value, 50))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Desired Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="e.g., Product Manager"
          value={data?.jobTitle || ""}
          onChange={(e) => handleChange("jobTitle", sanitizeText(e.target.value, 100))}
        />
        <p className="text-xs text-muted-foreground">
          The role you're applying for
        </p>
      </div>

      {/* Optional Fields */}
      {(hasNationality || hasDriverLicense || hasBirthDate) && (
        <div className="grid gap-4 @sm:grid-cols-2">
          {hasNationality && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="nationality">Nationality</Label>
                <button
                  type="button"
                  onClick={() => toggleOptionalField("nationality")}
                  className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <Input
                id="nationality"
                placeholder="e.g., American"
                value={data?.nationality || ""}
                onChange={(e) => handleChange("nationality", sanitizeText(e.target.value, 50))}
              />
            </div>
          )}
          {hasDriverLicense && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="driverLicense">Driver License</Label>
                <button
                  type="button"
                  onClick={() => toggleOptionalField("driverLicense")}
                  className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <Input
                id="driverLicense"
                placeholder="e.g., Class B"
                value={data?.driverLicense || ""}
                onChange={(e) => handleChange("driverLicense", sanitizeText(e.target.value, 30))}
              />
            </div>
          )}
          {hasBirthDate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="birthDate">Date of Birth</Label>
                <button
                  type="button"
                  onClick={() => toggleOptionalField("birthDate")}
                  className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <DatePicker
                value={data?.birthDate || ""}
                onChange={(value) => handleChange("birthDate", value)}
                placeholder="Select date of birth"
              />
            </div>
          )}
        </div>
      )}

      {/* Add Optional Fields Dropdown */}
      {!optionalFieldOptions.every((f) => f.enabled) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Add optional fields
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {optionalFieldOptions
              .filter((f) => !f.enabled)
              .map((field) => (
                <DropdownMenuItem
                  key={field.id}
                  onClick={() => toggleOptionalField(field.id)}
                >
                  <PlusIcon className="mr-1.5 h-4 w-4 text-muted-foreground" />
                  {field.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="space-y-2">
        <Label>Photo (Optional)</Label>
        <div className="flex items-center gap-4">
          {/* Photo preview or placeholder */}
          <div className="relative">
            {data?.photo ? (
              <div className="h-20 w-20 rounded-md overflow-hidden border border-border">
                <PhotoPreview storageId={data.photo} />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-border bg-muted/50">
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            {isUploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? "Uploading..." : data?.photo ? "Change Photo" : "Upload Photo"}
              </Button>
              {data?.photo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP, max 2MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Form
function ContactForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: any;
  onUpdate: (data: any) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="How employers can reach you"
        icon={PhoneIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="grid gap-4 @sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@email.com"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", sanitizeEmail(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", sanitizePhone(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
        <Input
          id="linkedin"
          placeholder="linkedin.com/in/yourprofile"
          value={data?.linkedin || ""}
          onChange={(e) => handleChange("linkedin", sanitizeUrl(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, State"
          value={data?.location || ""}
          onChange={(e) => handleChange("location", sanitizeText(e.target.value, 100))}
        />
        <p className="text-xs text-muted-foreground">
          City and state/country is usually enough
        </p>
      </div>
    </div>
  );
}

// Summary Form with Rich Text Editor and AI
function SummaryForm({
  resumeId,
  clerkId,
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  skipAutoGen,
  aiUsageState,
  onAIUsageStateChange,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  data: string;
  onUpdate: (data: string) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  skipAutoGen?: boolean;
  aiUsageState?: AIUsageState;
  onAIUsageStateChange?: (state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localGenerations, setLocalGenerations] = useState<Array<{
    content: string;
    tone: string;
    prompt?: string;
    createdAt: number;
  }>>([]);
  const hasTriggeredAutoGen = useRef(false);
  // Track the initial content on mount - only auto-generate for pre-existing content
  const initialContentRef = useRef<string | null>(null);

  // Capture initial content on first render only
  useEffect(() => {
    if (initialContentRef.current === null) {
      initialContentRef.current = data || "";
    }
  }, []);

  // Convex hooks
  const generateContent = useAction(api.ai.generateImprovedContent);
  const saveGeneration = useMutation(api.aiGenerations.saveGeneration);
  const selectGenerationMutation = useMutation(api.aiGenerations.selectGeneration);
  const existingGenerations = useQuery(api.aiGenerations.getGenerations, {
    resumeId,
    fieldType: "summary",
    fieldId: undefined,
  });

  // Sync existing generations from DB
  useEffect(() => {
    if (existingGenerations?.generations) {
      setLocalGenerations(existingGenerations.generations);
    }
  }, [existingGenerations]);

  // Initialize AI usage state from DB selectedIndex on load
  const hasInitializedFromDB = useRef(false);
  useEffect(() => {
    if (
      existingGenerations &&
      existingGenerations.selectedIndex != null &&
      !hasInitializedFromDB.current &&
      existingGenerations.generations.length > 0
    ) {
      hasInitializedFromDB.current = true;
      onAIUsageStateChange?.({
        hasUsedAI: true,
        originalContent: existingGenerations.originalContent,
        activeItemIndex: existingGenerations.selectedIndex + 1,
      });
    }
  }, [existingGenerations]);

  // Auto-generate ONLY if there was pre-existing content on mount (not user-typed)
  useEffect(() => {
    const initialContent = initialContentRef.current;
    // Only auto-generate if:
    // 1. Initial content existed and was substantial (> 20 chars)
    // 2. Haven't already triggered auto-gen
    // 3. DB says no auto-gen has happened yet
    const hadPreExistingContent = initialContent && initialContent.trim().length > 20;
    const shouldAutoGenerate =
      hadPreExistingContent &&
      !skipAutoGen &&
      !hasTriggeredAutoGen.current &&
      !existingGenerations?.hasAutoGenerated &&
      existingGenerations !== undefined;

    if (shouldAutoGenerate) {
      hasTriggeredAutoGen.current = true;
      handleGenerate("expert", true);
    }
  }, [existingGenerations, skipAutoGen]);

  const handleGenerate = useCallback(async (tone: ToneType, isAutoGen = false) => {
    if (!data || data.trim().length < 10 || !clerkId) return;
    if (!isAutoGen && !canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: data,
        fieldType: "summary",
        tone,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        // Save to database
        await saveGeneration({
          resumeId,
          fieldType: "summary",
          fieldId: undefined,
          originalContent: data,
          generatedContent: result.content,
          tone,
          isAutoGenerated: isAutoGen,
        });

        if (!isAutoGen) onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data, clerkId, generateContent, saveGeneration, resumeId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleCustomPrompt = useCallback(async (prompt: string) => {
    if (!data || data.trim().length < 10 || !clerkId) return;
    if (!canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: data,
        fieldType: "summary",
        tone: "custom",
        customPrompt: prompt,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone: "custom",
          prompt,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "summary",
          fieldId: undefined,
          originalContent: data,
          generatedContent: result.content,
          tone: "custom",
          prompt,
        });

        onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data, generateContent, saveGeneration, resumeId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleUseGeneration = useCallback((content: string, generationIndex: number) => {
    onUpdate(content);
    selectGenerationMutation({
      resumeId,
      fieldType: "summary",
      fieldId: undefined,
      selectedIndex: generationIndex,
    });
  }, [onUpdate, selectGenerationMutation, resumeId]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="A brief overview of your experience and goals"
        icon={DocumentTextIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        <RichTextEditor
          content={data || ""}
          onChange={(html) => onUpdate(sanitizeHtml(html))}
          placeholder="Write a brief overview of your experience and career goals..."
          minHeight="150px"
          resumeId={resumeId as string}
          fieldType="summary"
          aiGenerations={localGenerations}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onCustomPrompt={handleCustomPrompt}
          onUseGeneration={handleUseGeneration}
          showAI={true}
          aiUsageState={aiUsageState}
          onAIUsageStateChange={onAIUsageStateChange}
        />
        <p className="text-xs text-muted-foreground">
          Aim for 2-4 sentences highlighting your key qualifications
        </p>
      </div>
    </div>
  );
}


// Experience Bullets Editor with AI (sub-component for each experience item)
function ExperienceBulletsEditor({
  resumeId,
  clerkId,
  experienceId,
  bullets,
  onUpdate,
  skipAutoGen,
  aiUsageState,
  onAIUsageStateChange,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  experienceId: string;
  bullets: string[];
  onUpdate: (bullets: string[]) => void;
  skipAutoGen?: boolean;
  aiUsageState?: AIUsageState;
  onAIUsageStateChange?: (state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localGenerations, setLocalGenerations] = useState<Array<{
    content: string;
    tone: string;
    prompt?: string;
    createdAt: number;
  }>>([]);
  const hasTriggeredAutoGen = useRef(false);
  // Track the initial content on mount - only auto-generate for pre-existing content
  const initialBulletsRef = useRef<string[] | null>(null);

  // Capture initial content on first render only
  useEffect(() => {
    if (initialBulletsRef.current === null) {
      initialBulletsRef.current = bullets || [];
    }
  }, []);

  const generateContent = useAction(api.ai.generateImprovedContent);
  const saveGeneration = useMutation(api.aiGenerations.saveGeneration);
  const selectGenerationMutation = useMutation(api.aiGenerations.selectGeneration);
  const existingGenerations = useQuery(api.aiGenerations.getGenerations, {
    resumeId,
    fieldType: "experience_bullets",
    fieldId: experienceId,
  });

  // Convert bullets array to HTML for editor
  const bulletsToHtml = (bulletArr: string[]) => {
    if (!bulletArr || bulletArr.length === 0 || (bulletArr.length === 1 && !bulletArr[0])) {
      return "";
    }
    return `<ul>${bulletArr.map((b) => `<li>${b}</li>`).join("")}</ul>`;
  };

  // Convert HTML back to bullets array
  const htmlToBullets = (html: string) => {
    // Extract text from list items
    const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (matches) {
      return matches.map((li) => li.replace(/<\/?li[^>]*>/gi, "").replace(/<[^>]*>/g, "").trim());
    }
    // Fallback: just strip all HTML and split by newlines
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text ? text.split("\n").filter(Boolean) : [""];
  };

  useEffect(() => {
    if (existingGenerations?.generations) {
      setLocalGenerations(existingGenerations.generations);
    }
  }, [existingGenerations]);

  // Initialize AI usage state from DB selectedIndex on load
  const hasInitializedFromDB = useRef(false);
  useEffect(() => {
    if (
      existingGenerations &&
      existingGenerations.selectedIndex != null &&
      !hasInitializedFromDB.current &&
      existingGenerations.generations.length > 0
    ) {
      hasInitializedFromDB.current = true;
      onAIUsageStateChange?.({
        hasUsedAI: true,
        originalContent: existingGenerations.originalContent,
        activeItemIndex: existingGenerations.selectedIndex + 1,
      });
    }
  }, [existingGenerations]);

  // Auto-generate ONLY if there was pre-existing content on mount (not user-typed)
  useEffect(() => {
    const initialBullets = initialBulletsRef.current;
    const initialContent = initialBullets?.join(" ") || "";
    // Only auto-generate if initial content existed and was substantial
    const hadPreExistingContent = initialContent.trim().length > 20;
    const shouldAutoGenerate =
      hadPreExistingContent &&
      !skipAutoGen &&
      !hasTriggeredAutoGen.current &&
      !existingGenerations?.hasAutoGenerated &&
      existingGenerations !== undefined;

    if (shouldAutoGenerate) {
      hasTriggeredAutoGen.current = true;
      handleGenerate("expert", true);
    }
  }, [existingGenerations, skipAutoGen]);

  const handleGenerate = useCallback(async (tone: ToneType, isAutoGen = false) => {
    const bulletContent = bullets?.join("\n") || "";
    if (bulletContent.trim().length < 10 || !clerkId) return;
    if (!isAutoGen && !canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: bulletContent,
        fieldType: "experience_bullets",
        tone,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "experience_bullets",
          fieldId: experienceId,
          originalContent: bulletContent,
          generatedContent: result.content,
          tone,
          isAutoGenerated: isAutoGen,
        });

        if (!isAutoGen) onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [bullets, clerkId, generateContent, saveGeneration, resumeId, experienceId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleCustomPrompt = useCallback(async (prompt: string) => {
    const bulletContent = bullets?.join("\n") || "";
    if (bulletContent.trim().length < 10 || !clerkId) return;
    if (!canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: bulletContent,
        fieldType: "experience_bullets",
        tone: "custom",
        customPrompt: prompt,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone: "custom",
          prompt,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "experience_bullets",
          fieldId: experienceId,
          originalContent: bulletContent,
          generatedContent: result.content,
          tone: "custom",
          prompt,
        });

        onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [bullets, generateContent, saveGeneration, resumeId, experienceId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleUseGeneration = useCallback((content: string, generationIndex: number) => {
    onUpdate(htmlToBullets(content));
    selectGenerationMutation({
      resumeId,
      fieldType: "experience_bullets",
      fieldId: experienceId,
      selectedIndex: generationIndex,
    });
  }, [onUpdate, selectGenerationMutation, resumeId, experienceId]);

  const handleChange = useCallback((html: string) => {
    onUpdate(htmlToBullets(html));
  }, [onUpdate]);

  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <RichTextEditor
        content={bulletsToHtml(bullets)}
        onChange={handleChange}
        placeholder="Describe your responsibilities and achievements..."
        minHeight="100px"
        resumeId={resumeId as string}
        fieldType="experience_bullets"
        fieldId={experienceId}
        aiGenerations={localGenerations}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        onCustomPrompt={handleCustomPrompt}
        onUseGeneration={handleUseGeneration}
        showAI={true}
        aiUsageState={aiUsageState}
        onAIUsageStateChange={onAIUsageStateChange}
      />
      <p className="text-xs text-muted-foreground">
        Use bullet points to describe your achievements
      </p>
    </div>
  );
}

// Experience Form
// Sortable Experience Card
function SortableExperienceCard({
  exp,
  index,
  expandedId,
  setExpandedId,
  updateExperience,
  removeExperience,
  resumeId,
  clerkId,
  skipAutoGen,
  getAIUsageState,
  setAIUsageState,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  exp: any;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  updateExperience: (index: number, field: string, value: any) => void;
  removeExperience: (index: number) => void;
  resumeId: Id<"resumes">;
  clerkId?: string;
  skipAutoGen?: boolean;
  getAIUsageState: (key: string) => AIUsageState | undefined;
  setAIUsageState: (key: string, state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: "relative" as const,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`!py-0 !gap-0 overflow-hidden ${isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/20" : ""}`}
    >
      <div className="flex w-full items-center">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing pl-4 py-3 text-muted-foreground/50 hover:text-muted-foreground touch-none"
          title="Drag to reorder"
        >
          <Bars3Icon className="h-4 w-4" />
        </span>
        <button
          onClick={() =>
            setExpandedId(expandedId === exp.id ? null : exp.id)
          }
          className="flex flex-1 items-center justify-between text-left cursor-pointer min-w-0 pl-3 pr-4 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground leading-snug truncate">
              {exp.title || "New Position"}
            </p>
            <p className="text-sm text-muted-foreground leading-snug truncate">
              {exp.company || "Company Name"}
            </p>
          </div>
          <motion.div
            animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 ml-2"
          >
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expandedId === exp.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <CardContent className="border-t px-4 py-4 space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  placeholder="Your job title"
                  value={exp.title || ""}
                  onChange={(e) =>
                    updateExperience(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  placeholder="Company name"
                  value={exp.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="City, State"
                  value={exp.location || ""}
                  onChange={(e) =>
                    updateExperience(index, "location", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-4 @sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <MonthYearPicker
                    value={exp.startDate || ""}
                    onChange={(value) =>
                      updateExperience(index, "startDate", value)
                    }
                    placeholder="Select start date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <MonthYearPicker
                    value={exp.endDate || ""}
                    onChange={(value) =>
                      updateExperience(index, "endDate", value)
                    }
                    placeholder="Present"
                    disabled={exp.current}
                  />
                </div>
              </div>
              <ExperienceBulletsEditor
                resumeId={resumeId}
                clerkId={clerkId}
                experienceId={exp.id}
                bullets={exp.bullets || [""]}
                onUpdate={(bullets) => updateExperience(index, "bullets", bullets)}
                skipAutoGen={skipAutoGen}
                aiUsageState={getAIUsageState(`experience_${exp.id}`)}
                onAIUsageStateChange={(s) => setAIUsageState(`experience_${exp.id}`, s)}
                canOptimize={canOptimize}
                onOptimizeLimitReached={onOptimizeLimitReached}
                onOptimizationUsed={onOptimizationUsed}
              />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeExperience(index)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function ExperienceForm({
  resumeId,
  clerkId,
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  skipAutoGen,
  onConfirmRemove,
  getAIUsageState,
  setAIUsageState,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  skipAutoGen?: boolean;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
  getAIUsageState: (key: string) => AIUsageState | undefined;
  setAIUsageState: (key: string, state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addExperience = () => {
    const newId = Date.now().toString();
    const newExp = {
      id: newId,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    onUpdate([...data, newExp]);
    setExpandedId(newId);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeExperience = (index: number) => {
    const item = data[index];
    const label = item?.title || item?.company || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
      if (expandedId === item?.id) {
        setExpandedId(null);
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((item: any) => item.id === active.id);
      const newIndex = data.findIndex((item: any) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onUpdate(arrayMove(data, oldIndex, newIndex));
      }
    }
  };

  const itemIds = data?.map((exp: any) => exp.id) || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add your work experience, starting with the most recent"
        icon={BriefcaseIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {data?.map((exp, index) => (
              <SortableExperienceCard
                key={exp.id || index}
                exp={exp}
                index={index}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                updateExperience={updateExperience}
                removeExperience={removeExperience}
                resumeId={resumeId}
                clerkId={clerkId}
                skipAutoGen={skipAutoGen}
                getAIUsageState={getAIUsageState}
                setAIUsageState={setAIUsageState}
                canOptimize={canOptimize}
                onOptimizeLimitReached={onOptimizeLimitReached}
                onOptimizationUsed={onOptimizationUsed}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addExperience} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Employment
      </Button>
    </div>
  );
}

// Education Form
// Sortable Education Card
function SortableEducationCard({
  edu,
  index,
  expandedId,
  setExpandedId,
  updateEducation,
  removeEducation,
}: {
  edu: any;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  updateEducation: (index: number, field: string, value: any) => void;
  removeEducation: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: "relative" as const,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`!py-0 !gap-0 overflow-hidden ${isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/20" : ""}`}
    >
      <div className="flex w-full items-center">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing pl-4 py-3 text-muted-foreground/50 hover:text-muted-foreground touch-none"
          title="Drag to reorder"
        >
          <Bars3Icon className="h-4 w-4" />
        </span>
        <button
          onClick={() =>
            setExpandedId(expandedId === edu.id ? null : edu.id)
          }
          className="flex flex-1 items-center justify-between text-left cursor-pointer min-w-0 pl-3 pr-4 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium text-foreground leading-snug truncate">
              {edu.degree || "Degree"}
            </p>
            <p className="text-sm text-muted-foreground leading-snug truncate">
              {edu.school || "School Name"}
            </p>
          </div>
          <motion.div
            animate={{ rotate: expandedId === edu.id ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 ml-2"
          >
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expandedId === edu.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <CardContent className="border-t px-4 py-4 space-y-4">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  placeholder="Degree and field of study"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input
                  placeholder="School or university name"
                  value={edu.school || ""}
                  onChange={(e) =>
                    updateEducation(index, "school", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="City, State"
                  value={edu.location || ""}
                  onChange={(e) =>
                    updateEducation(index, "location", sanitizeText(e.target.value, 100))
                  }
                />
              </div>
              <div className="grid gap-4 @sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <MonthYearPicker
                    value={edu.startDate || ""}
                    onChange={(value) =>
                      updateEducation(index, "startDate", value)
                    }
                    placeholder="Select start date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <MonthYearPicker
                    value={edu.endDate || ""}
                    onChange={(value) =>
                      updateEducation(index, "endDate", value)
                    }
                    placeholder="Select end date"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeEducation(index)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function EducationForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  onConfirmRemove,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addEducation = () => {
    const newId = Date.now().toString();
    const newEdu = {
      id: newId,
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
    };
    onUpdate([...data, newEdu]);
    setExpandedId(newId);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeEducation = (index: number) => {
    const item = data[index];
    const label = item?.degree || item?.school || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
      if (expandedId === item?.id) {
        setExpandedId(null);
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((item: any) => item.id === active.id);
      const newIndex = data.findIndex((item: any) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onUpdate(arrayMove(data, oldIndex, newIndex));
      }
    }
  };

  const itemIds = data?.map((edu: any) => edu.id) || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add your educational background"
        icon={AcademicCapIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {data?.map((edu, index) => (
              <SortableEducationCard
                key={edu.id || index}
                edu={edu}
                index={index}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                updateEducation={updateEducation}
                removeEducation={removeEducation}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addEducation} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
}

// Sortable Skill Badge Component
function SortableSkillBadge({
  skill,
  onRemove,
}: {
  skill: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 select-none cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/20" : ""
      }`}
    >
      {skill}
      <button
        onClick={onRemove}
        onPointerDown={(e) => e.stopPropagation()}
        className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}

// Skills Form
function SkillsForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: string[];
  onUpdate: (data: string[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.indexOf(active.id as string);
      const newIndex = data.indexOf(over.id as string);
      onUpdate(arrayMove(data, oldIndex, newIndex));
    }
  };

  const addSkill = () => {
    if (inputValue.trim() && !data?.includes(inputValue.trim())) {
      onUpdate([...(data || []), inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate(data?.filter((s) => s !== skill) || []);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Project Management",
    "Teamwork",
    "Time Management",
    "Critical Thinking",
    "Adaptability",
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add skills relevant to the job you're applying for"
        icon={WrenchScrewdriverIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={addSkill}>Add</Button>
        </div>

        {/* Skills chips - Draggable */}
        {data && data.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">
              Drag skills to reorder:
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={data} strategy={rectSortingStrategy}>
                <div className="flex flex-wrap gap-2">
                  {data.map((skill) => (
                    <SortableSkillBadge
                      key={skill}
                      skill={skill}
                      onRemove={() => removeSkill(skill)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Suggested skills */}
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Suggested skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills
              .filter((s) => !data?.includes(s))
              .slice(0, 6)
              .map((skill) => (
                <button
                  key={skill}
                  onClick={() => onUpdate([...(data || []), skill])}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Internship Bullets Editor with AI (reuses same pattern as ExperienceBulletsEditor)
function InternshipBulletsEditor({
  resumeId,
  clerkId,
  internshipId,
  bullets,
  onUpdate,
  skipAutoGen,
  aiUsageState,
  onAIUsageStateChange,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  internshipId: string;
  bullets: string[];
  onUpdate: (bullets: string[]) => void;
  skipAutoGen?: boolean;
  aiUsageState?: AIUsageState;
  onAIUsageStateChange?: (state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localGenerations, setLocalGenerations] = useState<Array<{
    content: string;
    tone: string;
    prompt?: string;
    createdAt: number;
  }>>([]);
  const hasTriggeredAutoGen = useRef(false);
  // Track the initial content on mount - only auto-generate for pre-existing content
  const initialBulletsRef = useRef<string[] | null>(null);

  // Capture initial content on first render only
  useEffect(() => {
    if (initialBulletsRef.current === null) {
      initialBulletsRef.current = bullets || [];
    }
  }, []);

  const generateContent = useAction(api.ai.generateImprovedContent);
  const saveGeneration = useMutation(api.aiGenerations.saveGeneration);
  const selectGenerationMutation = useMutation(api.aiGenerations.selectGeneration);
  const existingGenerations = useQuery(api.aiGenerations.getGenerations, {
    resumeId,
    fieldType: "internship_bullets",
    fieldId: internshipId,
  });

  const bulletsToHtml = (bulletArr: string[]) => {
    if (!bulletArr || bulletArr.length === 0 || (bulletArr.length === 1 && !bulletArr[0])) {
      return "";
    }
    return `<ul>${bulletArr.map((b) => `<li>${b}</li>`).join("")}</ul>`;
  };

  const htmlToBullets = (html: string) => {
    const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (matches) {
      return matches.map((li) => li.replace(/<\/?li[^>]*>/gi, "").replace(/<[^>]*>/g, "").trim());
    }
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text ? text.split("\n").filter(Boolean) : [""];
  };

  useEffect(() => {
    if (existingGenerations?.generations) {
      setLocalGenerations(existingGenerations.generations);
    }
  }, [existingGenerations]);

  // Initialize AI usage state from DB selectedIndex on load
  const hasInitializedFromDB = useRef(false);
  useEffect(() => {
    if (
      existingGenerations &&
      existingGenerations.selectedIndex != null &&
      !hasInitializedFromDB.current &&
      existingGenerations.generations.length > 0
    ) {
      hasInitializedFromDB.current = true;
      onAIUsageStateChange?.({
        hasUsedAI: true,
        originalContent: existingGenerations.originalContent,
        activeItemIndex: existingGenerations.selectedIndex + 1,
      });
    }
  }, [existingGenerations]);

  // Auto-generate ONLY if there was pre-existing content on mount (not user-typed)
  useEffect(() => {
    const initialBullets = initialBulletsRef.current;
    const initialContent = initialBullets?.join(" ") || "";
    // Only auto-generate if initial content existed and was substantial
    const hadPreExistingContent = initialContent.trim().length > 20;
    const shouldAutoGenerate =
      hadPreExistingContent &&
      !skipAutoGen &&
      !hasTriggeredAutoGen.current &&
      !existingGenerations?.hasAutoGenerated &&
      existingGenerations !== undefined;

    if (shouldAutoGenerate) {
      hasTriggeredAutoGen.current = true;
      handleGenerate("expert", true);
    }
  }, [existingGenerations, skipAutoGen]);

  const handleGenerate = useCallback(async (tone: ToneType, isAutoGen = false) => {
    const bulletContent = bullets?.join("\n") || "";
    if (bulletContent.trim().length < 10 || !clerkId) return;
    if (!isAutoGen && !canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: bulletContent,
        fieldType: "internship_bullets",
        tone,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "internship_bullets",
          fieldId: internshipId,
          originalContent: bulletContent,
          generatedContent: result.content,
          tone,
          isAutoGenerated: isAutoGen,
        });

        if (!isAutoGen) onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [bullets, clerkId, generateContent, saveGeneration, resumeId, internshipId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleCustomPrompt = useCallback(async (prompt: string) => {
    const bulletContent = bullets?.join("\n") || "";
    if (bulletContent.trim().length < 10 || !clerkId) return;
    if (!canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: bulletContent,
        fieldType: "internship_bullets",
        tone: "custom",
        customPrompt: prompt,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone: "custom",
          prompt,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "internship_bullets",
          fieldId: internshipId,
          originalContent: bulletContent,
          generatedContent: result.content,
          tone: "custom",
          prompt,
        });

        onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [bullets, generateContent, saveGeneration, resumeId, internshipId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleUseGeneration = useCallback((content: string, generationIndex: number) => {
    onUpdate(htmlToBullets(content));
    selectGenerationMutation({
      resumeId,
      fieldType: "internship_bullets",
      fieldId: internshipId,
      selectedIndex: generationIndex,
    });
  }, [onUpdate, selectGenerationMutation, resumeId, internshipId]);

  const handleChange = useCallback((html: string) => {
    onUpdate(htmlToBullets(html));
  }, [onUpdate]);

  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <RichTextEditor
        content={bulletsToHtml(bullets)}
        onChange={handleChange}
        placeholder="Describe your responsibilities and achievements..."
        minHeight="100px"
        resumeId={resumeId as string}
        fieldType="internship_bullets"
        fieldId={internshipId}
        aiGenerations={localGenerations}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        onCustomPrompt={handleCustomPrompt}
        onUseGeneration={handleUseGeneration}
        showAI={true}
        aiUsageState={aiUsageState}
        onAIUsageStateChange={onAIUsageStateChange}
      />
    </div>
  );
}

// Internships Form (similar to Experience)
function InternshipsForm({
  resumeId,
  clerkId,
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  skipAutoGen,
  onConfirmRemove,
  getAIUsageState,
  setAIUsageState,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  skipAutoGen?: boolean;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
  getAIUsageState: (key: string) => AIUsageState | undefined;
  setAIUsageState: (key: string, state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(data?.[0]?.id || null);

  const addInternship = () => {
    const newId = Date.now().toString();
    const newInternship = {
      id: newId,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    };
    onUpdate([...data, newInternship]);
    setExpandedId(newId);
  };

  const updateInternship = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeInternship = (index: number) => {
    const item = data[index];
    const label = item?.title || item?.company || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
      if (expandedId === item?.id) {
        setExpandedId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add your internship experience"
        icon={BuildingOfficeIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((internship, index) => (
          <Card key={internship.id || index} className="!py-0 !gap-0 overflow-hidden">
            <button
              onClick={() =>
                setExpandedId(expandedId === internship.id ? null : internship.id)
              }
              className="flex w-full items-center justify-between px-4 py-3 text-left cursor-pointer"
            >
              <div>
                <p className="font-medium text-foreground leading-snug">
                  {internship.title || "New Internship"}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {internship.company || "Company Name"}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === internship.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedId === internship.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <CardContent className="border-t px-4 py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        placeholder="Your internship title"
                        value={internship.title || ""}
                        onChange={(e) =>
                          updateInternship(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        placeholder="Company name"
                        value={internship.company || ""}
                        onChange={(e) =>
                          updateInternship(index, "company", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="City, State"
                        value={internship.location || ""}
                        onChange={(e) =>
                          updateInternship(index, "location", sanitizeText(e.target.value, 100))
                        }
                      />
                    </div>
                    <div className="grid gap-4 @sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <MonthYearPicker
                          value={internship.startDate || ""}
                          onChange={(value) =>
                            updateInternship(index, "startDate", value)
                          }
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <MonthYearPicker
                          value={internship.endDate || ""}
                          onChange={(value) =>
                            updateInternship(index, "endDate", value)
                          }
                          placeholder="Select end date"
                        />
                      </div>
                    </div>
                    <InternshipBulletsEditor
                      resumeId={resumeId}
                      clerkId={clerkId}
                      internshipId={internship.id}
                      bullets={internship.bullets || [""]}
                      onUpdate={(bullets) => updateInternship(index, "bullets", bullets)}
                      skipAutoGen={skipAutoGen}
                      aiUsageState={getAIUsageState(`internship_${internship.id}`)}
                      onAIUsageStateChange={(s) => setAIUsageState(`internship_${internship.id}`, s)}
                      canOptimize={canOptimize}
                      onOptimizeLimitReached={onOptimizeLimitReached}
                      onOptimizationUsed={onOptimizationUsed}
                    />
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeInternship(index)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addInternship} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Internship
      </Button>
    </div>
  );
}

// Courses Form
function CoursesForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  onConfirmRemove,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(data?.[0]?.id || null);

  const addCourse = () => {
    const newId = Date.now().toString();
    const newCourse = {
      id: newId,
      name: "",
      institution: "",
      date: "",
    };
    onUpdate([...data, newCourse]);
    setExpandedId(newId);
  };

  const updateCourse = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeCourse = (index: number) => {
    const item = data[index];
    const label = item?.name || item?.institution || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
      if (expandedId === item?.id) {
        setExpandedId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add relevant courses and certifications"
        icon={BookOpenIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((course, index) => (
          <Card key={course.id || index} className="!py-0 !gap-0 overflow-hidden">
            <button
              onClick={() =>
                setExpandedId(expandedId === course.id ? null : course.id)
              }
              className="flex w-full items-center justify-between px-4 py-3 text-left cursor-pointer"
            >
              <div>
                <p className="font-medium text-foreground leading-snug">
                  {course.name || "New Course"}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {course.institution || "Institution"}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === course.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedId === course.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <CardContent className="border-t px-4 py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Course / Certificate Name</Label>
                      <Input
                        placeholder="Certificate or course name"
                        value={course.name || ""}
                        onChange={(e) => updateCourse(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        placeholder="Issuing organization"
                        value={course.institution || ""}
                        onChange={(e) =>
                          updateCourse(index, "institution", sanitizeText(e.target.value, 100))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <MonthYearPicker
                        value={course.date || ""}
                        onChange={(value) => updateCourse(index, "date", value)}
                        placeholder="Select date"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeCourse(index)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addCourse} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Course
      </Button>
    </div>
  );
}

// References Form
function ReferencesForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  onConfirmRemove,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(data?.[0]?.id || null);

  const addReference = () => {
    const newId = Date.now().toString();
    const newReference = {
      id: newId,
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
    };
    onUpdate([...data, newReference]);
    setExpandedId(newId);
  };

  const updateReference = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeReference = (index: number) => {
    const item = data[index];
    const label = item?.name || item?.company || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
      if (expandedId === item?.id) {
        setExpandedId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add professional references"
        icon={UserGroupIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((reference, index) => (
          <Card key={reference.id || index} className="!py-0 !gap-0 overflow-hidden">
            <button
              onClick={() =>
                setExpandedId(expandedId === reference.id ? null : reference.id)
              }
              className="flex w-full items-center justify-between px-4 py-3 text-left cursor-pointer"
            >
              <div>
                <p className="font-medium text-foreground leading-snug">
                  {reference.name || "New Reference"}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {reference.company || "Company"}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === reference.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedId === reference.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <CardContent className="border-t px-4 py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        placeholder="Reference's full name"
                        value={reference.name || ""}
                        onChange={(e) =>
                          updateReference(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Their job title"
                        value={reference.title || ""}
                        onChange={(e) =>
                          updateReference(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        placeholder="Their company"
                        value={reference.company || ""}
                        onChange={(e) =>
                          updateReference(index, "company", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-4 @sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          placeholder="Their email"
                          value={reference.email || ""}
                          onChange={(e) =>
                            updateReference(index, "email", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          placeholder="Their phone number"
                          value={reference.phone || ""}
                          onChange={(e) =>
                            updateReference(index, "phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeReference(index)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addReference} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Reference
      </Button>
    </div>
  );
}

// Languages Form
function LanguagesForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  onConfirmRemove,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
}) {
  const addLanguage = () => {
    const newLanguage = {
      id: Date.now().toString(),
      language: "",
      proficiency: "Intermediate",
    };
    onUpdate([...data, newLanguage]);
  };

  const updateLanguage = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeLanguage = (index: number) => {
    const item = data[index];
    const label = item?.language || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
    });
  };

  const proficiencyLevels = [
    "Native",
    "Fluent",
    "Advanced",
    "Intermediate",
    "Basic",
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Languages you speak and your proficiency"
        icon={LanguageIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((lang, index) => (
          <div
            key={lang.id || index}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Language"
                value={lang.language || ""}
                onChange={(e) => updateLanguage(index, "language", e.target.value)}
              />
            </div>
            <select
              value={lang.proficiency || "Intermediate"}
              onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {proficiencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeLanguage(index)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addLanguage} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Language
      </Button>
    </div>
  );
}

// Links Form
function LinksForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  onConfirmRemove,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmRemove: (label: string, onConfirm: () => void) => void;
}) {
  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      label: "",
      url: "",
    };
    onUpdate([...data, newLink]);
  };

  const updateLink = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeLink = (index: number) => {
    const item = data[index];
    const label = item?.label || item?.url || "This entry";
    onConfirmRemove(label, () => {
      onUpdate(data.filter((_, i) => i !== index));
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Portfolio, GitHub, or other relevant links"
        icon={LinkIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((link, index) => (
          <div
            key={link.id || index}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            <div className="w-32">
              <Input
                placeholder="Label"
                value={link.label || ""}
                onChange={(e) => updateLink(index, "label", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="https://..."
                value={link.url || ""}
                onChange={(e) => updateLink(index, "url", e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeLink(index)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addLink} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Link
      </Button>
    </div>
  );
}

// Hobbies Form with AI
function HobbiesForm({
  resumeId,
  clerkId,
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  aiUsageState,
  onAIUsageStateChange,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  data: string;
  onUpdate: (data: string) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  aiUsageState?: AIUsageState;
  onAIUsageStateChange?: (state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localGenerations, setLocalGenerations] = useState<Array<{
    content: string;
    tone: string;
    prompt?: string;
    createdAt: number;
  }>>([]);
  const hasTriggeredAutoGen = useRef(false);
  // Track the initial content on mount - only auto-generate for pre-existing content
  const initialContentRef = useRef<string | null>(null);

  // Capture initial content on first render only
  useEffect(() => {
    if (initialContentRef.current === null) {
      initialContentRef.current = data || "";
    }
  }, []);

  const generateContent = useAction(api.ai.generateImprovedContent);
  const saveGeneration = useMutation(api.aiGenerations.saveGeneration);
  const selectGenerationMutation = useMutation(api.aiGenerations.selectGeneration);
  const existingGenerations = useQuery(api.aiGenerations.getGenerations, {
    resumeId,
    fieldType: "hobbies",
    fieldId: undefined,
  });

  useEffect(() => {
    if (existingGenerations?.generations) {
      setLocalGenerations(existingGenerations.generations);
    }
  }, [existingGenerations]);

  // Initialize AI usage state from DB selectedIndex on load
  const hasInitializedFromDB = useRef(false);
  useEffect(() => {
    if (
      existingGenerations &&
      existingGenerations.selectedIndex != null &&
      !hasInitializedFromDB.current &&
      existingGenerations.generations.length > 0
    ) {
      hasInitializedFromDB.current = true;
      onAIUsageStateChange?.({
        hasUsedAI: true,
        originalContent: existingGenerations.originalContent,
        activeItemIndex: existingGenerations.selectedIndex + 1,
      });
    }
  }, [existingGenerations]);

  // Auto-generate ONLY if there was pre-existing content on mount (not user-typed)
  useEffect(() => {
    const initialContent = initialContentRef.current;
    // Only auto-generate if initial content existed and was substantial
    const hadPreExistingContent = initialContent && initialContent.trim().length > 20;
    const shouldAutoGenerate =
      hadPreExistingContent &&
      !hasTriggeredAutoGen.current &&
      !existingGenerations?.hasAutoGenerated &&
      existingGenerations !== undefined;

    if (shouldAutoGenerate) {
      hasTriggeredAutoGen.current = true;
      handleGenerate("expert", true);
    }
  }, [existingGenerations]);

  const handleGenerate = useCallback(async (tone: ToneType, isAutoGen = false) => {
    if (!data || data.trim().length < 10 || !clerkId) return;
    if (!isAutoGen && !canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: data,
        fieldType: "hobbies",
        tone,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "hobbies",
          fieldId: undefined,
          originalContent: data,
          generatedContent: result.content,
          tone,
          isAutoGenerated: isAutoGen,
        });

        if (!isAutoGen) onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data, clerkId, generateContent, saveGeneration, resumeId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleCustomPrompt = useCallback(async (prompt: string) => {
    if (!data || data.trim().length < 10 || !clerkId) return;
    if (!canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: data,
        fieldType: "hobbies",
        tone: "custom",
        customPrompt: prompt,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone: "custom",
          prompt,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "hobbies",
          fieldId: undefined,
          originalContent: data,
          generatedContent: result.content,
          tone: "custom",
          prompt,
        });

        onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data, generateContent, saveGeneration, resumeId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleUseGeneration = useCallback((content: string, generationIndex: number) => {
    onUpdate(content);
    selectGenerationMutation({
      resumeId,
      fieldType: "hobbies",
      fieldId: undefined,
      selectedIndex: generationIndex,
    });
  }, [onUpdate, selectGenerationMutation, resumeId]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Personal interests that show your personality"
        icon={HeartIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        <RichTextEditor
          content={data || ""}
          onChange={onUpdate}
          placeholder="List your hobbies and interests..."
          minHeight="100px"
          resumeId={resumeId as string}
          fieldType="hobbies"
          aiGenerations={localGenerations}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onCustomPrompt={handleCustomPrompt}
          onUseGeneration={handleUseGeneration}
          showAI={true}
          aiUsageState={aiUsageState}
          onAIUsageStateChange={onAIUsageStateChange}
        />
        <p className="text-xs text-muted-foreground">
          Keep it brief and relevant
        </p>
      </div>
    </div>
  );
}

// Custom Section Form with AI
function CustomSectionForm({
  resumeId,
  clerkId,
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
  aiUsageState,
  onAIUsageStateChange,
  canOptimize,
  onOptimizeLimitReached,
  onOptimizationUsed,
}: {
  resumeId: Id<"resumes">;
  clerkId?: string;
  data: { title: string; content: string };
  onUpdate: (data: { title: string; content: string }) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  aiUsageState?: AIUsageState;
  onAIUsageStateChange?: (state: AIUsageState) => void;
  canOptimize?: boolean;
  onOptimizeLimitReached?: () => void;
  onOptimizationUsed?: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [localGenerations, setLocalGenerations] = useState<Array<{
    content: string;
    tone: string;
    prompt?: string;
    createdAt: number;
  }>>([]);
  const hasTriggeredAutoGen = useRef(false);
  // Track the initial content on mount - only auto-generate for pre-existing content
  const initialContentRef = useRef<string | null>(null);

  // Capture initial content on first render only
  useEffect(() => {
    if (initialContentRef.current === null) {
      initialContentRef.current = data?.content || "";
    }
  }, []);

  const generateContent = useAction(api.ai.generateImprovedContent);
  const saveGeneration = useMutation(api.aiGenerations.saveGeneration);
  const selectGenerationMutation = useMutation(api.aiGenerations.selectGeneration);
  const existingGenerations = useQuery(api.aiGenerations.getGenerations, {
    resumeId,
    fieldType: "custom",
    fieldId: undefined,
  });

  useEffect(() => {
    if (existingGenerations?.generations) {
      setLocalGenerations(existingGenerations.generations);
    }
  }, [existingGenerations]);

  // Initialize AI usage state from DB selectedIndex on load
  const hasInitializedFromDB = useRef(false);
  useEffect(() => {
    if (
      existingGenerations &&
      existingGenerations.selectedIndex != null &&
      !hasInitializedFromDB.current &&
      existingGenerations.generations.length > 0
    ) {
      hasInitializedFromDB.current = true;
      onAIUsageStateChange?.({
        hasUsedAI: true,
        originalContent: existingGenerations.originalContent,
        activeItemIndex: existingGenerations.selectedIndex + 1,
      });
    }
  }, [existingGenerations]);

  // Auto-generate ONLY if there was pre-existing content on mount (not user-typed)
  useEffect(() => {
    const initialContent = initialContentRef.current;
    // Only auto-generate if initial content existed and was substantial
    const hadPreExistingContent = initialContent && initialContent.trim().length > 20;
    const shouldAutoGenerate =
      hadPreExistingContent &&
      !hasTriggeredAutoGen.current &&
      !existingGenerations?.hasAutoGenerated &&
      existingGenerations !== undefined;

    if (shouldAutoGenerate) {
      hasTriggeredAutoGen.current = true;
      handleGenerate("expert", true);
    }
  }, [existingGenerations]);

  const handleGenerate = useCallback(async (tone: ToneType, isAutoGen = false) => {
    if (!data?.content || data.content.trim().length < 10 || !clerkId) return;
    if (!isAutoGen && !canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: data.content,
        fieldType: "custom",
        tone,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "custom",
          fieldId: undefined,
          originalContent: data.content,
          generatedContent: result.content,
          tone,
          isAutoGenerated: isAutoGen,
        });

        if (!isAutoGen) onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data?.content, clerkId, generateContent, saveGeneration, resumeId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleCustomPrompt = useCallback(async (prompt: string) => {
    if (!data?.content || data.content.trim().length < 10 || !clerkId) return;
    if (!canOptimize) { onOptimizeLimitReached?.(); return; }

    setIsGenerating(true);
    try {
      const result = await generateContent({
        clerkId,
        content: data.content,
        fieldType: "custom",
        tone: "custom",
        customPrompt: prompt,
      });

      if (result?.content) {
        const newGeneration = {
          content: result.content,
          tone: "custom",
          prompt,
          createdAt: Date.now(),
        };

        setLocalGenerations((prev) => [...prev, newGeneration]);

        await saveGeneration({
          resumeId,
          fieldType: "custom",
          fieldId: undefined,
          originalContent: data.content,
          generatedContent: result.content,
          tone: "custom",
          prompt,
        });

        onOptimizationUsed?.();
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [data?.content, generateContent, saveGeneration, resumeId, canOptimize, onOptimizeLimitReached, onOptimizationUsed]);

  const handleUseGeneration = useCallback((content: string, generationIndex: number) => {
    onUpdate({ ...data, content });
    selectGenerationMutation({
      resumeId,
      fieldType: "custom",
      fieldId: undefined,
      selectedIndex: generationIndex,
    });
  }, [onUpdate, data, selectGenerationMutation, resumeId]);

  const handleContentChange = useCallback((content: string) => {
    onUpdate({ ...data, content });
  }, [onUpdate, data]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Create your own section with custom content"
        icon={PencilSquareIcon}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sectionTitle">Section Title</Label>
          <Input
            id="sectionTitle"
            placeholder="Section title"
            value={data?.title || ""}
            onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sectionContent">Content</Label>
          <RichTextEditor
            content={data?.content || ""}
            onChange={handleContentChange}
            placeholder="Add your content here..."
            minHeight="150px"
            resumeId={resumeId as string}
            fieldType="custom"
            aiGenerations={localGenerations}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onCustomPrompt={handleCustomPrompt}
            onUseGeneration={handleUseGeneration}
            showAI={true}
            aiUsageState={aiUsageState}
            onAIUsageStateChange={onAIUsageStateChange}
          />
        </div>
      </div>
    </div>
  );
}
