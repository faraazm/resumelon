"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// Input sanitization utilities
const sanitizeText = (value: string, maxLength: number = 500): string => {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
};

const sanitizeEmail = (value: string): string => {
  return value
    .replace(/[<>'"]/g, "")
    .replace(/\s/g, "")
    .toLowerCase()
    .slice(0, 254);
};

const sanitizePhone = (value: string): string => {
  return value
    .replace(/[^0-9\s\-\(\)\+\.]/g, "")
    .slice(0, 20);
};

// Animation variants for content transitions
const contentVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Section Header component
function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 min-w-0">
        {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
        <span className="break-words">{title}</span>
      </h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

interface CoverLetterWriteTabProps {
  coverLetterId: Id<"coverLetters">;
  coverLetterData: {
    title: string;
    personalDetails: {
      firstName: string;
      lastName: string;
      jobTitle: string;
      email: string;
      phone: string;
      address: string;
    };
    letterContent: {
      companyName: string;
      hiringManagerName: string;
      content: string;
    };
  };
  onUpdate: (section: string, data: any) => void;
  activeSection: string;
  onActiveSectionChange: (sectionId: string) => void;
}

// Section configurations
const sections = [
  { id: "personalDetails", label: "Personal Details", icon: UserIcon },
  { id: "letterContent", label: "Letter Content", icon: DocumentTextIcon },
];

export function CoverLetterWriteTab({
  coverLetterId,
  coverLetterData,
  onUpdate,
  activeSection,
  onActiveSectionChange,
}: CoverLetterWriteTabProps) {
  const currentIndex = sections.findIndex((s) => s.id === activeSection);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onActiveSectionChange(sections[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      onActiveSectionChange(sections[currentIndex + 1].id);
    }
  };

  // Render section content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "personalDetails":
        return (
          <PersonalDetailsSection
            data={coverLetterData.personalDetails}
            onUpdate={(data) => onUpdate("personalDetails", data)}
          />
        );
      case "letterContent":
        return (
          <LetterContentSection
            coverLetterId={coverLetterId}
            data={coverLetterData.letterContent}
            onUpdate={(data) => onUpdate("letterContent", data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
      {/* Left Sidebar - Section Navigation (hidden on mobile) */}
      <div className="hidden md:block w-48 shrink-0 border-r border-border bg-muted/20">
        <ScrollArea className="h-full">
          <div className="p-1.5 space-y-0.5">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => onActiveSectionChange(section.id)}
                  className={`
                    flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium
                    transition-colors cursor-pointer
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Center Panel - Form */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.15 }}
              >
                {renderSectionContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Navigation Footer */}
        <div className="shrink-0 border-t border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="gap-1.5"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {sections.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentIndex === sections.length - 1}
              className="gap-1.5"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Type definitions for sections
interface PersonalDetailsData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
}

interface LetterContentData {
  companyName: string;
  hiringManagerName: string;
  content: string;
}

// Personal Details Section
function PersonalDetailsSection({
  data,
  onUpdate,
}: {
  data: PersonalDetailsData;
  onUpdate: (data: PersonalDetailsData) => void;
}) {
  const handleChange = (field: keyof typeof data, value: string) => {
    let sanitizedValue = value;

    switch (field) {
      case "email":
        sanitizedValue = sanitizeEmail(value);
        break;
      case "phone":
        sanitizedValue = sanitizePhone(value);
        break;
      default:
        sanitizedValue = sanitizeText(value, 200);
    }

    onUpdate({ ...data, [field]: sanitizedValue });
  };

  return (
    <div>
      <SectionHeader
        title="Personal Details"
        description="Your contact information for the cover letter header"
        icon={UserIcon}
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="John"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Desired Job Title</Label>
          <Input
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            placeholder="Software Engineer"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john.doe@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="New York, NY"
          />
        </div>
      </div>
    </div>
  );
}

// Letter Content Section
function LetterContentSection({
  coverLetterId,
  data,
  onUpdate,
}: {
  coverLetterId: Id<"coverLetters">;
  data: LetterContentData;
  onUpdate: (data: LetterContentData) => void;
}) {
  const handleChange = (field: keyof typeof data, value: string) => {
    if (field === "content") {
      // Don't sanitize HTML content from the editor
      onUpdate({ ...data, [field]: value });
    } else {
      onUpdate({ ...data, [field]: sanitizeText(value, 200) });
    }
  };

  return (
    <div>
      <SectionHeader
        title="Letter Content"
        description="The recipient information and body of your cover letter"
        icon={DocumentTextIcon}
      />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Acme Corporation"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hiringManagerName">Hiring Manager Name</Label>
          <Input
            id="hiringManagerName"
            value={data.hiringManagerName}
            onChange={(e) => handleChange("hiringManagerName", e.target.value)}
            placeholder="Jane Smith"
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use "Hiring Manager" in the greeting
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Letter Body</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Explain why you're a good fit for this position
          </p>
          <RichTextEditor
            content={data.content}
            onChange={(content) => handleChange("content", content)}
            placeholder="Write your cover letter here..."
            minHeight="300px"
            showAI={false}
          />
        </div>
      </div>
    </div>
  );
}
