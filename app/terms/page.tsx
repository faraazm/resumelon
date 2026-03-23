import type { Metadata } from "next";
import { TermsPage } from "./terms-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service for resumeclone. Understand your rights and responsibilities when using our AI-powered resume builder.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | resumeclone",
    description: "Terms of service for using resumeclone.",
    url: "https://resumeclone.com/terms",
  },
};

export default function Page() {
  return <TermsPage />;
}
