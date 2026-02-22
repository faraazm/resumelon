"use client";

import { useState } from "react";
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
import { PlusIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Id } from "@/convex/_generated/dataModel";
import { UpgradeDialog } from "@/components/app/upgrade-dialog";
import { CoverLetterCard } from "@/components/app/dashboard/cover-letter-card";

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<Id<"coverLetters"> | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

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

  const isLoading = !isUserLoaded || coverLetters === undefined;

  const sorted = coverLetters
    ? [...coverLetters].sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
  const hasLetters = sorted.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Cover Letters
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your cover letters
          </p>
        </div>
        <Button onClick={handleNewCoverLetter}>
          <PlusIcon className="h-4 w-4" />
          New Cover Letter
        </Button>
      </motion.div>

      {/* Cover Letter List */}
      {isLoading ? null : hasLetters ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {sorted.map((letter) => (
            <CoverLetterCard
              key={letter._id}
              coverLetter={letter}
              onDelete={handleDelete}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cover Letter?</DialogTitle>
            <DialogDescription>
              This cover letter will be permanently deleted. This action cannot be undone.
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
