"use client";

import { useEffect, useState, ReactNode } from "react";

interface PrintPageClientProps {
  children: ReactNode;
}

export function PrintPageClient({ children }: PrintPageClientProps) {
  const [isReady, setIsReady] = useState(false);

  // Signal to Playwright that the page is ready
  useEffect(() => {
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        setIsReady(true);
        // Set a flag on window for Playwright to detect
        (window as unknown as { __RESUME_READY__: boolean }).__RESUME_READY__ = true;
        console.log("Resume ready signal set");
      }, 100);
    });
  }, []);

  return (
    <div data-ready={isReady}>
      {children}
    </div>
  );
}
