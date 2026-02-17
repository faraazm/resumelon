"use client";

import Link from "next/link";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  const scrollToFeatures = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-background min-h-[calc(100vh-73px)] flex items-center">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 w-full">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              AI-powered resume builder
            </div>

            <h1 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
              Build a Resume That Passes ATS and{" "}
              <span
                className="italic bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent pb-1 inline-block font-normal text-[2.75rem] sm:text-[3.25rem] lg:text-[4rem] tracking-[0.02em]"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Gets Interviews
              </span>
            </h1>

            <motion.p
              className="mt-6 text-lg leading-6 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Build a job-winning resume with our intelligent builder. Get
              noticed by recruiters and land more interviews.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Loading skeleton for primary button */}
              <ClerkLoading>
                <div className="h-11 w-[180px] animate-pulse rounded-md bg-muted" />
              </ClerkLoading>

              <ClerkLoaded>
                <SignedOut>
                  <Button size="lg" asChild className="text-base gap-1">
                    <Link href="/sign-up">
                      Create my resume
                      <span>→</span>
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" asChild className="text-base gap-1">
                    <Link href="/app/resumes">
                      Go to Dashboard
                      <span>→</span>
                    </Link>
                  </Button>
                </SignedIn>
              </ClerkLoaded>

              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatures}
                className="text-base"
              >
                Learn more
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Mesh gradient placeholder */}
          <motion.div
            className="hidden items-center justify-center lg:flex lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Blue border */}
              <div className="absolute inset-0 rounded-3xl p-4 bg-primary">
                {/* Inner gray square */}
                <div className="h-full w-full rounded-2xl bg-gray-200 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    Thumbnail preview
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
