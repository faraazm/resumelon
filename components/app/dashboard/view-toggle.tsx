"use client";

import { ListBulletIcon, TableCellsIcon } from "@heroicons/react/24/outline";

export type ViewMode = "list" | "table";

export function ViewToggle({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}) {
  return (
    <div className="flex items-center rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => onViewChange("list")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          view === "list"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ListBulletIcon className="h-4 w-4" />
        List
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          view === "table"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <TableCellsIcon className="h-4 w-4" />
        Table
      </button>
    </div>
  );
}
