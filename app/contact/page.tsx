import type { Metadata } from "next";
import { ContactPage } from "./contact-page";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the resumelon team. We'd love to hear from you — whether you have questions, feedback, or need help with your account.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | resumelon",
    description:
      "Get in touch with the resumelon team. Questions, feedback, or support — we're here to help.",
    url: "https://resumelon.com/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
