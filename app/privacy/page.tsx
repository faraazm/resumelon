import type { Metadata } from "next";
import { PrivacyPage } from "./privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how resumeclone collects, uses, and protects your personal information. Read our full privacy policy.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | resumeclone",
    description: "How resumeclone handles your data and protects your privacy.",
    url: "https://resumeclone.com/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}
