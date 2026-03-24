import type { Metadata } from "next";
import { PrivacyPage } from "./privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how resumelon collects, uses, and protects your personal information. Read our full privacy policy.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | resumelon",
    description: "How resumelon handles your data and protects your privacy.",
    url: "https://resumelon.com/privacy",
  },
};

export default function Page() {
  return <PrivacyPage />;
}
