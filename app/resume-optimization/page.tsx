import type { Metadata } from "next";
import { ResumeOptimizationPage } from "./resume-optimization-page";

export const metadata: Metadata = {
  title: "Resume Optimization - Improve Your Resume with AI",
  description:
    "Optimize your existing resume for any job with AI-powered analysis. Get keyword suggestions, content improvements, ATS scoring, and bullet point rewrites that highlight your impact.",
  alternates: { canonical: "/resume-optimization" },
  openGraph: {
    title: "Resume Optimization - Improve Your Resume with AI",
    description:
      "Optimize your resume with AI. Keyword matching, ATS scoring, bullet rewrites, and content improvements for more interviews.",
    url: "/resume-optimization",
  },
};

export default function Page() {
  return <ResumeOptimizationPage />;
}
