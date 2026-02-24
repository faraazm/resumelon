"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function TailorResumePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const resumes = useQuery(
    api.resumes.getResumesByUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const sortedResumes = resumes
    ? [...resumes].sort(
        (a, b) =>
          new Date(b.updatedAt ?? b._creationTime).getTime() -
          new Date(a.updatedAt ?? a._creationTime).getTime()
      )
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute left-6 top-6 z-10">
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href="/app/resumes/new">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-3xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Choose a resume to tailor
            </h1>
            <p className="mt-2 text-muted-foreground">
              Select a resume to optimize for a specific job description
            </p>
          </motion.div>

          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-2.5">
            {sortedResumes === null ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : sortedResumes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="py-8 text-center"
              >
                <p className="text-muted-foreground">
                  No resumes yet.{" "}
                  <Link
                    href="/app/resumes/new"
                    className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    Create one first
                  </Link>{" "}
                  to get started.
                </p>
              </motion.div>
            ) : (
              sortedResumes.map((resume, index) => (
                <motion.div
                  key={resume._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <Card
                    onClick={() =>
                      router.push(
                        `/app/resumes/optimize?resumeId=${resume._id}`
                      )
                    }
                    className="!py-0 shadow-none group cursor-pointer transition-all hover:border-foreground/20"
                  >
                    <CardContent className="flex items-center gap-4 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 text-left">
                        <h3 className="truncate text-[15px] font-medium text-foreground">
                          {resume.title}
                        </h3>
                        <p className="text-[13px] text-muted-foreground">
                          Updated{" "}
                          {new Date(
                            resume.updatedAt ?? resume._creationTime
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
