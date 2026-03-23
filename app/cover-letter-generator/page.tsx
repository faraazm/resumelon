import type { Metadata } from "next";
import { CoverLetterGeneratorPage } from "./cover-letter-generator-page";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator - Personalized Cover Letters in Seconds",
  description:
    "Generate tailored, professional cover letters in seconds. Our AI analyzes your resume and the job description to craft personalized letters that get responses.",
  alternates: { canonical: "/cover-letter-generator" },
  openGraph: {
    title: "AI Cover Letter Generator - Personalized Cover Letters in Seconds",
    description:
      "Generate tailored, professional cover letters in seconds. Our AI analyzes your resume and the job description to craft personalized letters that get responses.",
    url: "/cover-letter-generator",
  },
};

export default function Page() {
  return <CoverLetterGeneratorPage />;
}
