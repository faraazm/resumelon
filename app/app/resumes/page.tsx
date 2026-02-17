"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { TemplateRenderer, getTemplate, ResumeData } from "@/lib/templates";

interface Resume {
  _id: Id<"resumes">;
  title: string;
  updatedAt: number;
  template: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    photo?: string;
  };
  contact?: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary?: string;
  experience?: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education?: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills?: string[];
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ResumeCard({ resume, onDelete }: { resume: Resume; onDelete: (id: Id<"resumes">) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  // Prepare resume data for preview
  const resumeData: ResumeData = {
    personalDetails: resume.personalDetails || { firstName: "", lastName: "", jobTitle: "" },
    contact: resume.contact || { email: "", phone: "", linkedin: "", location: "" },
    summary: resume.summary || "",
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
  };

  const template = getTemplate(resume.template || "professional");

  // Check if resume has content
  const hasContent =
    resumeData.personalDetails.firstName ||
    resumeData.personalDetails.lastName ||
    resumeData.summary ||
    resumeData.experience.length > 0 ||
    resumeData.education.length > 0 ||
    resumeData.skills.length > 0;

  // Calculate scale based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = containerWidth / 816;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <Link href={`/app/resumes/${resume._id}/edit`} className="block">
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-foreground/20 !py-0 !gap-0 cursor-pointer !rounded-none sm:!rounded-lg">
        {/* Template Preview - Real preview or skeleton with proper portrait ratio (8.5:11) */}
        <div ref={containerRef} className="relative bg-gray-50 overflow-hidden aspect-[8.5/11]">
          {hasContent ? (
            <div
              className="absolute top-0 left-0 bg-white origin-top-left"
              style={{
                width: "816px",
                height: "1056px",
                transform: `scale(${scale})`,
              }}
            >
              <TemplateRenderer data={resumeData} template={template} />
            </div>
          ) : (
            <div className="absolute inset-0 bg-white p-6">
              {/* Mini resume preview skeleton */}
              <div className="space-y-3">
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-3/4 rounded bg-gray-100" />
                <div className="mt-6 space-y-2">
                  <div className="h-2.5 w-full rounded bg-gray-100" />
                  <div className="h-2.5 w-full rounded bg-gray-100" />
                  <div className="h-2.5 w-2/3 rounded bg-gray-100" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2.5 w-full rounded bg-gray-100" />
                  <div className="h-2.5 w-full rounded bg-gray-100" />
                </div>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </div>

        {/* Card Footer */}
        <CardContent className="!px-4 !py-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-foreground">
                {resume.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Updated {formatDate(resume.updatedAt)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/app/resumes/${resume._id}/edit`}>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(resume._id);
                  }}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FileTextIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">No resumes yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first resume to get started
      </p>
      <Button asChild className="mt-4">
        <Link href="/app/resumes/new">
          <PlusIcon className="h-4 w-4" />
          Create Resume
        </Link>
      </Button>
    </div>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

export default function ResumesPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const resumes = useQuery(
    api.resumes.getResumesByUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const deleteResume = useMutation(api.resumes.deleteResume);

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (convexUser && !convexUser.hasCompletedOnboarding) {
      router.push("/app/onboarding");
    }
  }, [convexUser, router]);

  const handleDeleteResume = async (id: Id<"resumes">) => {
    try {
      await deleteResume({ id });
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  // Loading state
  if (!isUserLoaded || resumes === undefined || convexUser === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[8.5/11] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // If user hasn't completed onboarding, show nothing (redirect will happen)
  if (convexUser && !convexUser.hasCompletedOnboarding) {
    return null;
  }

  const hasResumes = resumes && resumes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My Resumes
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage your resumes
          </p>
        </div>
        <Button asChild>
          <Link href="/app/resumes/new">
            <PlusIcon className="h-4 w-4" />
            Create Resume
          </Link>
        </Button>
      </motion.div>

      {/* Content */}
      {hasResumes ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume: Resume, index: number) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
              >
                <ResumeCard
                  resume={resume}
                  onDelete={handleDeleteResume}
                />
              </motion.div>
            ))}
          </div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Need another resume for a different role?
            </p>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/app/resumes/new">
                <PlusIcon className="h-4 w-4" />
                Create Another Resume
              </Link>
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <EmptyState />
        </motion.div>
      )}
    </motion.div>
  );
}

