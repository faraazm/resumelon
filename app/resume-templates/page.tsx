import type { Metadata } from "next";
import { ResumeTemplatesPage } from "./resume-templates-page";

export const metadata: Metadata = {
  title: "Free Resume Templates - Professional, ATS-Friendly Designs",
  description:
    "Choose from professionally designed, ATS-friendly resume templates. Customize colors, fonts, and layouts. Build your perfect resume in minutes.",
  alternates: { canonical: "/resume-templates" },
  openGraph: {
    title: "Free Resume Templates - Professional, ATS-Friendly Designs",
    description:
      "Choose from professionally designed, ATS-friendly resume templates. Customize colors, fonts, and layouts. Build your perfect resume in minutes.",
    url: "/resume-templates",
  },
};

export default function Page() {
  return <ResumeTemplatesPage />;
}
