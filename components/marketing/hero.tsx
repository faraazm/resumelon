"use client";

import Link from "next/link";
import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HeroVisual } from "./hero-visual";

const trustSignals = [
  "Used by 10,000+ job seekers",
  "ATS-optimized templates",
  "AI-powered tailoring",
];

export function Hero() {
  const scrollToSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#solution");
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
              Land More Interviews with Tailored Resumes{" "}
              <span
                className="italic bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent pb-1 inline-block font-normal text-[2.75rem] sm:text-[3.25rem] lg:text-[4rem] tracking-[0.02em]"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                in Seconds
              </span>
            </h1>

            <motion.p
              className="mt-6 text-lg leading-7 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Paste a job description and resumeclone tailors your resume with
              the right keywords, skills, and phrasing—ATS-optimized and ready
              to download. Stop rewriting. Start interviewing.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ClerkLoading>
                <div className="h-11 w-[220px] animate-pulse rounded-md bg-muted" />
              </ClerkLoading>

              <ClerkLoaded>
                <SignedOut>
                  <Button size="lg" asChild className="text-base gap-1">
                    <Link href="/sign-up">
                      Generate My First Resume
                      <span>→</span>
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" asChild className="text-base gap-1">
                    <Link href="/resumes">
                      Go to Dashboard
                      <span>→</span>
                    </Link>
                  </Button>
                </SignedIn>
              </ClerkLoaded>

              <Button
                size="lg"
                variant="outline"
                onClick={scrollToSection}
                className="text-base"
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {signal}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Visual */}
          <motion.div
            className="w-full lg:w-auto items-center justify-center flex lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-lg lg:max-w-xl">
              <HeroVisual />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
