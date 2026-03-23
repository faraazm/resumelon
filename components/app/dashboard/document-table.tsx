"use client";

import { Checkbox } from "@/components/ui/checkbox";

export function DocumentTable({
  children,
  columns,
  allSelected,
  onSelectAll,
}: {
  children: React.ReactNode;
  columns: string[];
  allSelected: boolean;
  onSelectAll: () => void;
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="w-10 px-3 py-3 text-left">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {col}
              </th>
            ))}
            <th className="w-20 px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
