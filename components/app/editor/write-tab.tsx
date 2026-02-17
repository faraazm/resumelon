"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
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
  );
}

interface WriteTabProps {
  resumeData: any;
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
  resumeData,
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
    // Clear the data for this section based on its type
    const sectionId = activeSection;
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
    const newSections = sections.filter((s) => s.id !== activeSection);
    updateSectionsAndNotify(newSections);
    // Navigate to first available section or show empty state
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

  return (
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
      {/* Left Sidebar - Section Navigation (hidden on mobile, shown in hamburger menu instead) */}
      <div className="hidden md:block w-56 shrink-0 border-r border-border bg-muted/20">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1">
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                    isDragging
                      ? "opacity-50 border border-dashed border-primary"
                      : ""
                  } ${
                    isActive
                      ? "bg-gray-100 text-foreground"
                      : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                  }`}
                >
                  <Bars3Icon className="h-3 w-3 shrink-0 text-gray-400 cursor-grab" />
                  <section.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{section.label}</span>
                </div>
              );
            })}

            <Separator className="my-3" />

            {/* Job Description - Fixed section */}
            <div
              onClick={() => setActiveSection("jobDescription")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeSection === "jobDescription"
                  ? "bg-gray-100 text-foreground"
                  : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
              }`}
            >
              <ClipboardDocumentListIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">Job Description</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-gray-600 font-medium cursor-pointer"
              onClick={() => setShowAddSectionDialog(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Add Section
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Center Panel - Form Editor */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-2xl p-4 md:p-6">

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
                    data={resumeData.summary}
                    onUpdate={(data) => onUpdate("summary", data)}
                    sectionLabel={currentSectionInfo?.label || "Professional Summary"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onUpdate={(data) => onUpdate("experience", data)}
                    sectionLabel={currentSectionInfo?.label || "Employment History"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onUpdate={(data) => onUpdate("education", data)}
                    sectionLabel={currentSectionInfo?.label || "Education"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
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
                    data={resumeData.internships || []}
                    onUpdate={(data) => onUpdate("internships", data)}
                    sectionLabel={currentSectionInfo?.label || "Internships"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "courses" && (
                  <CoursesForm
                    data={resumeData.courses || []}
                    onUpdate={(data) => onUpdate("courses", data)}
                    sectionLabel={currentSectionInfo?.label || "Courses & Certificates"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "references" && (
                  <ReferencesForm
                    data={resumeData.references || []}
                    onUpdate={(data) => onUpdate("references", data)}
                    sectionLabel={currentSectionInfo?.label || "References"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "languages" && (
                  <LanguagesForm
                    data={resumeData.languages || []}
                    onUpdate={(data) => onUpdate("languages", data)}
                    sectionLabel={currentSectionInfo?.label || "Languages"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "links" && (
                  <LinksForm
                    data={resumeData.links || []}
                    onUpdate={(data) => onUpdate("links", data)}
                    sectionLabel={currentSectionInfo?.label || "Links"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "hobbies" && (
                  <HobbiesForm
                    data={resumeData.hobbies || ""}
                    onUpdate={(data) => onUpdate("hobbies", data)}
                    sectionLabel={currentSectionInfo?.label || "Hobbies & Interests"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
                  />
                )}
                {activeSection === "custom" && (
                  <CustomSectionForm
                    data={resumeData.custom || { title: "", content: "" }}
                    onUpdate={(data) => onUpdate("custom", data)}
                    sectionLabel={currentSectionInfo?.label || "Custom Section"}
                    onEdit={handleEditSection}
                    onDelete={() => setShowDeleteSectionDialog(true)}
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
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        <Textarea
          placeholder="Paste the full job description here. Include the job title, requirements, responsibilities, and any other relevant details. This helps our AI tailor your resume to match what the employer is looking for."
          value={data || ""}
          onChange={(e) => onUpdate(e.target.value)}
          className="min-h-[250px] resize-none"
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
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  // Check which optional fields are already filled
  const hasNationality = !!data?.nationality;
  const hasDriverLicense = !!data?.driverLicense;
  const hasBirthDate = !!data?.birthDate;

  const optionalFieldOptions = [
    { id: "nationality", label: "Nationality", enabled: hasNationality },
    { id: "driverLicense", label: "Driver License", enabled: hasDriverLicense },
    { id: "birthDate", label: "Date of Birth", enabled: hasBirthDate },
  ];

  const toggleOptionalField = (fieldId: string) => {
    const field = optionalFieldOptions.find((f) => f.id === fieldId);
    if (field?.enabled) {
      // Remove the field
      const newData = { ...data };
      delete newData[fieldId];
      onUpdate(newData);
    } else {
      // Add the field with empty value
      onUpdate({ ...data, [fieldId]: "" });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Basic information that appears at the top of your resume"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={data?.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={data?.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Desired Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="Software Engineer"
          value={data?.jobTitle || ""}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          The role you're applying for
        </p>
      </div>

      {/* Optional Fields */}
      {(hasNationality || hasDriverLicense || hasBirthDate) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {hasNationality && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="nationality">Nationality</Label>
                <button
                  onClick={() => toggleOptionalField("nationality")}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
              <Input
                id="nationality"
                placeholder="e.g., American"
                value={data?.nationality || ""}
                onChange={(e) => handleChange("nationality", e.target.value)}
              />
            </div>
          )}
          {hasDriverLicense && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="driverLicense">Driver License</Label>
                <button
                  onClick={() => toggleOptionalField("driverLicense")}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
              <Input
                id="driverLicense"
                placeholder="e.g., Class B"
                value={data?.driverLicense || ""}
                onChange={(e) => handleChange("driverLicense", e.target.value)}
              />
            </div>
          )}
          {hasBirthDate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="birthDate">Date of Birth</Label>
                <button
                  onClick={() => toggleOptionalField("birthDate")}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
              <Input
                id="birthDate"
                placeholder="e.g., January 1, 1990"
                value={data?.birthDate || ""}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Add Optional Fields Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowOptionalFields(!showOptionalFields)}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
        >
          <PlusIcon className="h-4 w-4" />
          Add optional fields
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${showOptionalFields ? "rotate-180" : ""}`}
          />
        </button>

        {showOptionalFields && (
          <div className="mt-2 rounded-lg border border-border bg-background p-2 shadow-lg">
            {optionalFieldOptions
              .filter((f) => !f.enabled)
              .map((field) => (
                <button
                  key={field.id}
                  onClick={() => {
                    toggleOptionalField(field.id);
                    setShowOptionalFields(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <PlusIcon className="h-4 w-4" />
                  {field.label}
                </button>
              ))}
            {optionalFieldOptions.every((f) => f.enabled) && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                All optional fields added
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Photo (Optional)</Label>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
            <UserIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <Button variant="outline" size="sm">
              Upload Photo
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG or PNG, max 2MB
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
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
        <Input
          id="linkedin"
          placeholder="linkedin.com/in/johndoe"
          value={data?.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          value={data?.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          City and state/country is usually enough
        </p>
      </div>
    </div>
  );
}

// Summary Form
function SummaryForm({
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
        description="A brief overview of your experience and goals"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        <Textarea
          placeholder="Experienced software engineer with 5+ years of expertise in building scalable web applications..."
          value={data || ""}
          onChange={(e) => onUpdate(e.target.value)}
          className="min-h-[150px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Aim for 2-4 sentences highlighting your key qualifications
        </p>
      </div>

      {/* AI Suggestion Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="rounded-full bg-primary/10 p-2">
            <SparklesIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              AI Writing Assistant
            </p>
            <p className="text-xs text-muted-foreground">
              Get help writing a compelling summary based on your experience
            </p>
            <Button size="sm" variant="outline" className="mt-2">
              Generate Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Experience Form
function ExperienceForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(data?.[0]?.id || null);

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
    const itemId = data[index]?.id;
    onUpdate(data.filter((_, i) => i !== index));
    if (expandedId === itemId) {
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add your work experience, starting with the most recent"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((exp, index) => (
          <Card key={exp.id || index} className="!py-0 !gap-0 overflow-hidden">
            <button
              onClick={() =>
                setExpandedId(expandedId === exp.id ? null : exp.id)
              }
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-medium text-foreground leading-snug">
                  {exp.title || "New Position"}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {exp.company || "Company Name"}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedId === exp.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <CardContent className="border-t px-4 py-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      placeholder="Software Engineer"
                      value={exp.title || ""}
                      onChange={(e) =>
                        updateExperience(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      placeholder="Acme Inc."
                      value={exp.company || ""}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="San Francisco, CA"
                      value={exp.location || ""}
                      onChange={(e) =>
                        updateExperience(index, "location", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Jan 2020"
                      value={exp.startDate || ""}
                      onChange={(e) =>
                        updateExperience(index, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="Present"
                      value={exp.endDate || ""}
                      onChange={(e) =>
                        updateExperience(index, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="• Led development of..."
                    value={exp.bullets?.join("\n") || ""}
                    onChange={(e) =>
                      updateExperience(
                        index,
                        "bullets",
                        e.target.value.split("\n")
                      )
                    }
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use bullet points to describe your achievements
                  </p>
                </div>

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
        ))}
      </div>

      <Button variant="outline" onClick={addExperience} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Employment
      </Button>
    </div>
  );
}

// Education Form
function EducationForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(data?.[0]?.id || null);

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
    const itemId = data[index]?.id;
    onUpdate(data.filter((_, i) => i !== index));
    if (expandedId === itemId) {
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add your educational background"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-3">
        {data?.map((edu, index) => (
          <Card key={edu.id || index} className="!py-0 !gap-0 overflow-hidden">
            <button
              onClick={() =>
                setExpandedId(expandedId === edu.id ? null : edu.id)
              }
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-medium text-foreground leading-snug">
                  {edu.degree || "Degree"}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {edu.school || "School Name"}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === edu.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedId === edu.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <CardContent className="border-t px-4 py-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      value={edu.degree || ""}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>School</Label>
                    <Input
                      placeholder="University of California"
                      value={edu.school || ""}
                      onChange={(e) =>
                        updateEducation(index, "school", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Berkeley, CA"
                      value={edu.location || ""}
                      onChange={(e) =>
                        updateEducation(index, "location", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Sep 2016"
                      value={edu.startDate || ""}
                      onChange={(e) =>
                        updateEducation(index, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="May 2020"
                      value={edu.endDate || ""}
                      onChange={(e) =>
                        updateEducation(index, "endDate", e.target.value)
                      }
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
        ))}
      </div>

      <Button variant="outline" onClick={addEducation} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
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
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "SQL",
    "Git",
    "AWS",
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add skills relevant to the job you're applying for"
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

        {/* Skills chips */}
        {data && data.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
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
            ))}
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

// Internships Form (similar to Experience)
function InternshipsForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
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
    const itemId = data[index]?.id;
    onUpdate(data.filter((_, i) => i !== index));
    if (expandedId === itemId) {
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add your internship experience"
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
              className="flex w-full items-center justify-between px-4 py-3 text-left"
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      placeholder="Software Engineer Intern"
                      value={internship.title || ""}
                      onChange={(e) =>
                        updateInternship(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      placeholder="Acme Inc."
                      value={internship.company || ""}
                      onChange={(e) =>
                        updateInternship(index, "company", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="San Francisco, CA"
                      value={internship.location || ""}
                      onChange={(e) =>
                        updateInternship(index, "location", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      placeholder="Jun 2022"
                      value={internship.startDate || ""}
                      onChange={(e) =>
                        updateInternship(index, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      placeholder="Aug 2022"
                      value={internship.endDate || ""}
                      onChange={(e) =>
                        updateInternship(index, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="• Assisted with..."
                    value={internship.bullets?.join("\n") || ""}
                    onChange={(e) =>
                      updateInternship(
                        index,
                        "bullets",
                        e.target.value.split("\n")
                      )
                    }
                    className="min-h-[100px]"
                  />
                </div>

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
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
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
    const itemId = data[index]?.id;
    onUpdate(data.filter((_, i) => i !== index));
    if (expandedId === itemId) {
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add relevant courses and certifications"
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
              className="flex w-full items-center justify-between px-4 py-3 text-left"
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
                    placeholder="AWS Solutions Architect"
                    value={course.name || ""}
                    onChange={(e) => updateCourse(index, "name", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      placeholder="Amazon Web Services"
                      value={course.institution || ""}
                      onChange={(e) =>
                        updateCourse(index, "institution", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      placeholder="Mar 2023"
                      value={course.date || ""}
                      onChange={(e) => updateCourse(index, "date", e.target.value)}
                    />
                  </div>
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
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
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
    const itemId = data[index]?.id;
    onUpdate(data.filter((_, i) => i !== index));
    if (expandedId === itemId) {
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Add professional references"
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
              className="flex w-full items-center justify-between px-4 py-3 text-left"
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Jane Smith"
                      value={reference.name || ""}
                      onChange={(e) =>
                        updateReference(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Engineering Manager"
                      value={reference.title || ""}
                      onChange={(e) =>
                        updateReference(index, "title", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Tech Corp"
                    value={reference.company || ""}
                    onChange={(e) =>
                      updateReference(index, "company", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="jane@company.com"
                      value={reference.email || ""}
                      onChange={(e) =>
                        updateReference(index, "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="+1 (555) 123-4567"
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
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
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
    onUpdate(data.filter((_, i) => i !== index));
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
}: {
  data: any[];
  onUpdate: (data: any[]) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
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
    onUpdate(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Portfolio, GitHub, or other relevant links"
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

// Hobbies Form
function HobbiesForm({
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
        description="Personal interests that show your personality"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        <Textarea
          placeholder="Photography, hiking, open-source contributions, chess..."
          value={data || ""}
          onChange={(e) => onUpdate(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Keep it brief and relevant
        </p>
      </div>
    </div>
  );
}

// Custom Section Form
function CustomSectionForm({
  data,
  onUpdate,
  sectionLabel,
  onEdit,
  onDelete,
}: {
  data: { title: string; content: string };
  onUpdate: (data: { title: string; content: string }) => void;
  sectionLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title={sectionLabel}
        description="Create your own section with custom content"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sectionTitle">Section Title</Label>
          <Input
            id="sectionTitle"
            placeholder="e.g., Publications, Awards, Volunteer Work"
            value={data?.title || ""}
            onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sectionContent">Content</Label>
          <Textarea
            id="sectionContent"
            placeholder="Enter your content here..."
            value={data?.content || ""}
            onChange={(e) => onUpdate({ ...data, content: e.target.value })}
            className="min-h-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
