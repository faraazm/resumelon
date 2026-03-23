import type { Metadata } from "next";
import { CoverLetterTemplatesPage } from "./cover-letter-templates-page";

export const metadata: Metadata = {
  title: "Cover Letter Templates - Professional, Customizable Designs",
  description:
    "Choose from professionally designed cover letter templates. Customizable layouts with AI-powered content, matched to your resume style. Start free today.",
  alternates: { canonical: "/cover-letter-templates" },
  openGraph: {
    title: "Cover Letter Templates - Professional, Customizable Designs",
    description:
      "Choose from professionally designed cover letter templates. Customizable layouts with AI-powered content, matched to your resume style. Start free today.",
    url: "/cover-letter-templates",
  },
};

export default function Page() {
  return <CoverLetterTemplatesPage />;
}
