"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { ResumeCard } from "@/components/app/dashboard/resume-card";
import { ResumeTableRow } from "@/components/app/dashboard/resume-table-row";
import { DocumentTable } from "@/components/app/dashboard/document-table";
import { ViewToggle } from "@/components/app/dashboard/view-toggle";
import { BulkActionBar } from "@/components/app/dashboard/bulk-action-bar";
import { DeleteConfirmDialog } from "@/components/app/dashboard/delete-confirm-dialog";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { useSelection } from "@/hooks/use-selection";
import { useViewPreference } from "@/hooks/use-view-preference";
import { useCachedResumes } from "@/hooks/use-document-cache";

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
    isUserLoaded ? {} : "skip"
  );

  const freshResumes = useQuery(
    api.resumes.getResumesByUser,
    isUserLoaded ? {} : "skip"
  );

  // Use cached data while fresh data loads
  const resumes = useCachedResumes(freshResumes);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    isUserLoaded ? { currentMonth } : "skip"
  );

  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  const { view, setView } = useViewPreference();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Id<"resumes"> | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const selection = useSelection<Id<"resumes">>();

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (convexUser && !convexUser.hasCompletedOnboarding) {
      router.push("/onboarding");
    }
  }, [convexUser, router]);

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const handleNewResume = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    router.push("/resumes/new");
  };

  const handleTailor = (resumeId: Id<"resumes">) => {
    router.push(`/resumes/optimize?resumeId=${resumeId}`);
  };

  const handleDeleteResume = (id: Id<"resumes">) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    try {
      await deleteResumeMutation({ id: resumeToDelete });
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const confirmBulkDelete = async () => {
    if (selection.selectedCount === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selection.selected).map((id) =>
          deleteResumeMutation({ id })
        )
      );
      selection.clear();
    } catch (error) {
      console.error("Error deleting resumes:", error);
    }
    setIsBulkDeleting(false);
    setBulkDeleteOpen(false);
  };

  const sortedResumes = useMemo(
    () => (resumes ? [...resumes].sort((a, b) => b.updatedAt - a.updatedAt) : []),
    [resumes]
  );
  const hasResumes = sortedResumes.length > 0;
  const allIds = useMemo(() => sortedResumes.map((r) => r._id), [sortedResumes]);
  const isContentReady = isUserLoaded && resumes !== undefined;

  if (convexUser && !convexUser.hasCompletedOnboarding) {
    return null;
  }

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
        <div className="flex items-center gap-3">
          {isContentReady && hasResumes && <ViewToggle view={view} onViewChange={setView} />}
          <Button onClick={handleNewResume}>
            <SparklesIcon className="h-4 w-4" />
            Create Resume
          </Button>
        </div>
      </motion.div>

      {/* Resume List / Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
      {!isContentReady ? null : hasResumes ? (
        view === "list" ? (
          <div className="space-y-6">
            {sortedResumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                userName={user?.fullName || undefined}
                onDelete={handleDeleteResume}
                onTailor={handleTailor}
                selected={selection.isSelected(resume._id)}
                onSelect={() => selection.toggle(resume._id)}
              />
            ))}
          </div>
        ) : (
          <DocumentTable
            columns={["Title", "Name", "Updated"]}
            allSelected={selection.isAllSelected(allIds)}
            onSelectAll={() =>
              selection.isAllSelected(allIds)
                ? selection.clear()
                : selection.selectAll(allIds)
            }
          >
            {sortedResumes.map((resume) => (
              <ResumeTableRow
                key={resume._id}
                resume={resume}
                selected={selection.isSelected(resume._id)}
                onSelect={() => selection.toggle(resume._id)}
                onDelete={handleDeleteResume}
              />
            ))}
          </DocumentTable>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
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
        </div>
      )}
      </motion.div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selection.selectedCount}
        onDelete={() => setBulkDeleteOpen(true)}
        onClearSelection={selection.clear}
        isDeleting={isBulkDeleting}
      />

      {/* Single Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        count={1}
        itemType="resume"
      />

      {/* Bulk Delete Confirmation */}
      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        count={selection.selectedCount}
        itemType="resume"
      />

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
