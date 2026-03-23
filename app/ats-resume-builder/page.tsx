import type { Metadata } from "next";
import { ATSResumeBuilderPage } from "./ats-resume-builder-page";

export const metadata: Metadata = {
  title: "ATS Resume Builder - Create ATS-Friendly Resumes That Get Past Filters",
  description:
    "Build ATS-optimized resumes that pass automated screening systems. Clean formatting, keyword optimization, and recruiter-approved templates.",
  alternates: { canonical: "/ats-resume-builder" },
  openGraph: {
    title: "ATS Resume Builder - Create ATS-Friendly Resumes That Get Past Filters",
    description:
      "Build ATS-optimized resumes that pass automated screening systems. Clean formatting, keyword optimization, and recruiter-approved templates.",
    url: "/ats-resume-builder",
  },
};

export default function Page() {
  return <ATSResumeBuilderPage />;
}
