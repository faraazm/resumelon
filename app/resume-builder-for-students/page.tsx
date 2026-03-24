import type { Metadata } from "next";
import { ResumeBuilderForStudentsPage } from "./resume-builder-for-students-page";

export const metadata: Metadata = {
  title: "Resume Builder for Students - Create Your First Resume Free",
  description:
    "Build a professional resume as a student or recent graduate — even with limited experience. Our AI helps you highlight coursework, projects, internships, and skills that employers actually want to see.",
  alternates: { canonical: "/resume-builder-for-students" },
  openGraph: {
    title: "Resume Builder for Students - Create Your First Resume Free",
    description:
      "Build a professional resume as a student — even with limited experience. AI-powered, ATS-optimized, and free to start.",
    url: "/resume-builder-for-students",
  },
};

export default function Page() {
  return <ResumeBuilderForStudentsPage />;
}
