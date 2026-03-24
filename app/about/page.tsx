import type { Metadata } from "next";
import { AboutPage } from "./about-page";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about resumelon — the AI-powered resume builder helping job seekers create tailored, ATS-optimized resumes and cover letters for every application.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | resumelon",
    description:
      "Learn about resumelon — the AI-powered resume builder helping job seekers land more interviews.",
    url: "https://resumelon.com/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
