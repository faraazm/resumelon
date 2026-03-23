import type { Metadata } from "next";
import { ResumeGeneratorPage } from "./resume-generator-page";

export const metadata: Metadata = {
  title: "AI Resume Generator - Create Tailored Resumes Instantly",
  description:
    "Generate ATS-optimized, job-specific resumes in seconds with AI. Paste a job description, get a tailored resume ready to submit. Free to start.",
  alternates: { canonical: "/resume-generator" },
  openGraph: {
    title: "AI Resume Generator - Create Tailored Resumes Instantly",
    description:
      "Generate ATS-optimized, job-specific resumes in seconds with AI. Paste a job description, get a tailored resume ready to submit. Free to start.",
    url: "/resume-generator",
  },
};

export default function Page() {
  return <ResumeGeneratorPage />;
}
