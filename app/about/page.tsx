import type { Metadata } from "next";
import { AboutPage } from "./about-page";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about resumeclone — the AI-powered resume builder helping thousands of job seekers mass apply with tailored, ATS-optimized resumes and cover letters.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | resumeclone",
    description:
      "Learn about resumeclone — the AI-powered resume builder helping job seekers land more interviews.",
    url: "https://resumeclone.com/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
