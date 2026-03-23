"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { CoverLetterCard } from "@/components/app/dashboard/cover-letter-card";
import { CoverLetterTableRow } from "@/components/app/dashboard/cover-letter-table-row";
import { DocumentTable } from "@/components/app/dashboard/document-table";
import { ViewToggle } from "@/components/app/dashboard/view-toggle";
import { BulkActionBar } from "@/components/app/dashboard/bulk-action-bar";
import { DeleteConfirmDialog } from "@/components/app/dashboard/delete-confirm-dialog";
import { useSelection } from "@/hooks/use-selection";
import { useViewPreference } from "@/hooks/use-view-preference";

export default function CoverLettersPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();

  const coverLetters = useQuery(
    api.coverLetters.getCoverLettersByUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const generationLimit = useQuery(
    api.users.getRemainingGenerations,
    user?.id ? { clerkId: user.id, currentMonth } : "skip"
  );

  const deleteCoverLetterMutation = useMutation(api.coverLetters.deleteCoverLetter);

  const { view, setView } = useViewPreference();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<Id<"coverLetters"> | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const selection = useSelection<Id<"coverLetters">>();

  const canGenerate = !generationLimit || generationLimit.remaining > 0;

  const handleNewCoverLetter = () => {
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    router.push("/app/cover-letters/new");
  };

  const handleDelete = (id: Id<"coverLetters">) => {
    setLetterToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!user?.id || !letterToDelete) return;
    try {
      await deleteCoverLetterMutation({ id: letterToDelete, clerkId: user.id });
    } catch (error) {
      console.error("Error deleting cover letter:", error);
    }
    setDeleteDialogOpen(false);
    setLetterToDelete(null);
  };

  const confirmBulkDelete = async () => {
    if (!user?.id || selection.selectedCount === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selection.selected).map((id) =>
          deleteCoverLetterMutation({ id, clerkId: user!.id })
        )
      );
      selection.clear();
    } catch (error) {
      console.error("Error deleting cover letters:", error);
    }
    setIsBulkDeleting(false);
    setBulkDeleteOpen(false);
  };

  const isLoading = !isUserLoaded || coverLetters === undefined;

  const sorted = coverLetters
    ? [...coverLetters].sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
  const hasLetters = sorted.length > 0;
  const allIds = sorted.map((l) => l._id);

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
            Cover Letters
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your cover letters
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasLetters && <ViewToggle view={view} onViewChange={setView} />}
          <Button onClick={handleNewCoverLetter}>
            <PlusIcon className="h-4 w-4" />
            New Cover Letter
          </Button>
        </div>
      </motion.div>

      {/* Cover Letter List / Table */}
      {isLoading ? null : hasLetters ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {view === "list" ? (
            <div className="space-y-6">
              {sorted.map((letter) => (
                <CoverLetterCard
                  key={letter._id}
                  coverLetter={letter}
                  onDelete={handleDelete}
                  selected={selection.isSelected(letter._id)}
                  onSelect={() => selection.toggle(letter._id)}
                />
              ))}
            </div>
          ) : (
            <DocumentTable
              columns={["Title", "Company", "Updated"]}
              allSelected={selection.isAllSelected(allIds)}
              onSelectAll={() =>
                selection.isAllSelected(allIds)
                  ? selection.clear()
                  : selection.selectAll(allIds)
              }
            >
              {sorted.map((letter) => (
                <CoverLetterTableRow
                  key={letter._id}
                  coverLetter={letter}
                  selected={selection.isSelected(letter._id)}
                  onSelect={() => selection.toggle(letter._id)}
                  onDelete={handleDelete}
                />
              ))}
            </DocumentTable>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 rounded-full bg-muted p-4">
            <EnvelopeIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No cover letters yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first cover letter to get started
          </p>
          <Button className="mt-4" onClick={handleNewCoverLetter}>
            <PlusIcon className="h-4 w-4" />
            Create Cover Letter
          </Button>
        </motion.div>
      )}

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
        itemType="cover letter"
      />

      {/* Bulk Delete Confirmation */}
      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        count={selection.selectedCount}
        itemType="cover letter"
      />

      {/* Upgrade Dialog */}
      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
