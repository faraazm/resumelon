import { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  heading: ReactNode;
  description?: ReactNode;
  badge?: string;
  align?: "center" | "left";
  className?: string;
  headingClassName?: string;
}

export function SectionHeader({
  id,
  heading,
  description,
  badge,
  align = "center",
  className = "",
  headingClassName = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "mx-auto max-w-3xl text-center" : "";

  return (
    <div className={`${alignClass} ${className}`}>
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {badge}
        </div>
      )}
      <h2
        id={id}
        className={`text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl ${headingClassName}`}
      >
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
