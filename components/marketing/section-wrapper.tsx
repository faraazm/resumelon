import { ReactNode } from "react";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  background?: "default" | "muted" | "primary";
  padding?: "sm" | "md" | "lg";
  ariaLabelledBy?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const bgMap = {
  default: "bg-background",
  muted: "bg-background",
  primary: "bg-primary",
};

const paddingMap = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

const maxWidthMap = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export function SectionWrapper({
  id,
  children,
  className = "",
  background = "default",
  padding = "md",
  ariaLabelledBy,
  maxWidth = "lg",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`${bgMap[background]} ${paddingMap[padding]} ${className}`}
      aria-labelledby={ariaLabelledBy}
    >
      <div className={`mx-auto ${maxWidthMap[maxWidth]} px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </section>
  );
}
