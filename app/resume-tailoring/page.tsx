import type { Metadata } from "next";
import { ResumeTailoringPage } from "./resume-tailoring-page";

export const metadata: Metadata = {
  title: "Resume Tailoring - Customize Your Resume for Every Job",
  description:
    "Tailor your resume to any job description in minutes. Our AI analyzes job requirements and rewrites your resume with the right keywords, skills, and phrasing to get past ATS and impress recruiters.",
  alternates: { canonical: "/resume-tailoring" },
  openGraph: {
    title: "Resume Tailoring - Customize Your Resume for Every Job",
    description:
      "Tailor your resume to any job description in minutes. AI-powered keyword matching and content optimization for every application.",
    url: "/resume-tailoring",
  },
};

export default function Page() {
  return <ResumeTailoringPage />;
}
