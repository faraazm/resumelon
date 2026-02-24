"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { ResumeCard } from "@/components/app/dashboard/resume-card";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";

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

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    user?.id ? { clerkId: user.id, currentMonth } : "skip"
  );

  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Id<"resumes"> | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (convexUser && !convexUser.hasCompletedOnboarding) {
      router.push("/app/onboarding");
    }
  }, [convexUser, router]);

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const handleNewResume = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    router.push("/app/resumes/new");
  };

  const handleTailor = (resumeId: Id<"resumes">) => {
    router.push(`/app/resumes/optimize?resumeId=${resumeId}`);
  };

  const handleDeleteResume = (id: Id<"resumes">) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!user?.id || !resumeToDelete) return;
    try {
      await deleteResumeMutation({ id: resumeToDelete, clerkId: user.id });
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const isLoading = !isUserLoaded || resumes === undefined || convexUser === undefined;

  if (convexUser && !convexUser.hasCompletedOnboarding) {
    return null;
  }

  const sortedResumes = resumes
    ? [...resumes].sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
  const hasResumes = sortedResumes.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My Resumes
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and tailor your resumes
          </p>
        </div>
        <Button
          onClick={handleNewResume}
          className="w-full sm:w-auto text-white border-0"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          Create Resume
        </Button>
      </motion.div>

      {/* Resume List */}
      {isLoading ? null : hasResumes ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {sortedResumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              userName={user?.fullName || undefined}
              onDelete={handleDeleteResume}
              onTailor={handleTailor}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 rounded-full bg-muted p-4">
            <FileTextIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No resumes yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first resume to get started
          </p>
          <Button className="mt-4" onClick={handleNewResume}>
            <PlusIcon className="h-4 w-4" />
            Create Resume
          </Button>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume?</DialogTitle>
            <DialogDescription>
              This resume will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
