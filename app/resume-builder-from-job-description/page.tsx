import type { Metadata } from "next";
import { ResumeBuilderFromJobDescriptionPage } from "./resume-builder-from-job-description-page";

export const metadata: Metadata = {
  title: "Resume Builder from Job Description - AI-Powered Resume Creator",
  description:
    "Build a perfectly matched resume from any job description. Paste the listing, and our AI creates a tailored, ATS-optimized resume highlighting your most relevant experience. Free to try.",
  alternates: { canonical: "/resume-builder-from-job-description" },
  openGraph: {
    title: "Resume Builder from Job Description - AI-Powered Resume Creator",
    description:
      "Build a perfectly matched resume from any job description. AI-powered, ATS-optimized, ready in minutes.",
    url: "/resume-builder-from-job-description",
  },
};

export default function Page() {
  return <ResumeBuilderFromJobDescriptionPage />;
}
