"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export function CTABanner() {
  return (
    <section className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
            Craft your perfect professional resume
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of job seekers who have landed their dream jobs with
            NiceResume. Start building your future today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <ClerkLoading>
              <div className="h-11 w-[180px] animate-pulse rounded-md bg-primary-foreground/20" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedOut>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-base"
                >
                  <Link href="/sign-up">
                    Create my resume
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-base"
                >
                  <Link href="/app/resumes">
                    Go to Dashboard
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </section>
  );
}
