"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function BulkActionBar({
  selectedCount,
  onDelete,
  onClearSelection,
  isDeleting,
}: {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
  isDeleting: boolean;
}) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 shadow-lg">
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {selectedCount} selected
            </span>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <TrashIcon className="h-3.5 w-3.5" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={onClearSelection}
              disabled={isDeleting}
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
