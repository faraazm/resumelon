import type { Metadata } from "next";
import { TermsPage } from "./terms-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service for resumelon. Understand your rights and responsibilities when using our AI-powered resume builder.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | resumelon",
    description: "Terms of service for using resumelon.",
    url: "https://resumelon.com/terms",
  },
};

export default function Page() {
  return <TermsPage />;
}
