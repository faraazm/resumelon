"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

interface InlineCTAProps {
  signedOutLabel?: string;
  signedOutHref?: string;
  signedInLabel?: string;
  signedInHref?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "lg" | "sm";
  className?: string;
}

export function InlineCTA({
  signedOutLabel = "Generate My First Resume",
  signedOutHref = "/sign-up",
  signedInLabel = "Go to Dashboard",
  signedInHref = "/resumes",
  variant = "default",
  size = "lg",
  className = "",
}: InlineCTAProps) {
  return (
    <div className={className}>
      <ClerkLoading>
        <div className="h-11 w-[220px] animate-pulse rounded-md bg-muted" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <Button size={size} variant={variant} asChild className="text-base gap-1">
            <Link href={signedOutHref}>
              {signedOutLabel}
              <span>→</span>
            </Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button size={size} variant={variant} asChild className="text-base gap-1">
            <Link href={signedInHref}>
              {signedInLabel}
              <span>→</span>
            </Link>
          </Button>
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}
