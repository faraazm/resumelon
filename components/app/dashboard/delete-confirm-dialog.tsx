"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  itemType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
  itemType: "resume" | "cover letter";
}) {
  const plural = count > 1;
  const label = plural
    ? `${count} ${itemType}s`
    : `this ${itemType}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {plural ? `${count} ${itemType}s` : `${itemType}`}?
          </DialogTitle>
          <DialogDescription>
            {plural
              ? `These ${count} ${itemType}s will be permanently deleted.`
              : `This ${itemType} will be permanently deleted.`}{" "}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete{plural ? ` (${count})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
