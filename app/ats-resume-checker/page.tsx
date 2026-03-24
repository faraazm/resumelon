import type { Metadata } from "next";
import { ATSResumeCheckerPage } from "./ats-resume-checker-page";

export const metadata: Metadata = {
  title: "ATS Resume Checker - Score Your Resume for Free",
  description:
    "Check if your resume passes Applicant Tracking Systems. Get an instant ATS compatibility score, keyword analysis, and actionable fixes. Free resume checker powered by AI.",
  alternates: { canonical: "/ats-resume-checker" },
  openGraph: {
    title: "ATS Resume Checker - Score Your Resume for Free",
    description:
      "Check if your resume passes ATS screening. Instant score, keyword gaps, and formatting fixes. Free AI-powered resume checker.",
    url: "/ats-resume-checker",
  },
};

export default function Page() {
  return <ATSResumeCheckerPage />;
}
