"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Mock data - will be replaced with Convex
const mockCoverLetters = [
  {
    id: "1",
    title: "Software Engineer - Google",
    linkedResume: "Software Engineer Resume",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    preview: "Dear Hiring Manager, I am writing to express my interest in the Software Engineer position...",
  },
  {
    id: "2",
    title: "Product Manager - Meta",
    linkedResume: "Product Manager Resume",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    preview: "I am excited to apply for the Product Manager role at Meta...",
  },
];

export default function CoverLettersPage() {
  const [coverLetters] = useState(mockCoverLetters);
  const hasLetters = coverLetters.length > 0;

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
          <h1 className="text-2xl font-semibold tracking-tight">Cover Letters</h1>
          <p className="text-sm text-muted-foreground">
            Create tailored cover letters to complement your resumes
          </p>
        </div>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          New Cover Letter
        </Button>
      </motion.div>

      {hasLetters ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
            >
              <CoverLetterCard letter={letter} />
            </motion.div>
          ))}

          {/* AI Generate Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + coverLetters.length * 0.05 }}
          >
            <Card className="group cursor-pointer border-dashed transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 rounded-full bg-primary/10 p-3">
                  <SparklesIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">AI Cover Letter</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate a tailored cover letter from your resume
                </p>
                <Button variant="outline" className="mt-4" size="sm">
                  Try it free
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
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

function CoverLetterCard({
  letter,
}: {
  letter: (typeof mockCoverLetters)[0];
}) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md !py-0 !gap-0">
      {/* Preview Area */}
      <div className="relative aspect-[4/3] bg-muted/50">
        <div className="h-full w-full bg-white p-4">
          <div className="space-y-2">
            <div className="h-2 w-1/3 rounded bg-gray-300" />
            <div className="h-1.5 w-1/2 rounded bg-gray-200" />
            <div className="mt-3 space-y-1">
              <div className="h-1 w-full rounded bg-gray-200" />
              <div className="h-1 w-full rounded bg-gray-200" />
              <div className="h-1 w-4/5 rounded bg-gray-200" />
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-1 w-full rounded bg-gray-200" />
              <div className="h-1 w-full rounded bg-gray-200" />
              <div className="h-1 w-3/5 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/5 group-hover:opacity-100">
          <Button size="sm" asChild>
            <Link href={`/app/cover-letters/${letter.id}/edit`}>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Info */}
      <CardContent className="!px-4 !py-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">
              {letter.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Linked to: {letter.linkedResume}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Updated {formatDate(letter.updatedAt)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/app/cover-letters/${letter.id}/edit`}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <DocumentTextIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No cover letters yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first cover letter to complement your resume and stand out
        to employers.
      </p>
      <div className="mt-6 flex gap-3">
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Create cover letter
        </Button>
        <Button variant="outline" className="gap-2">
          <SparklesIcon className="h-4 w-4" />
          Generate with AI
        </Button>
      </div>
    </div>
  );
}
