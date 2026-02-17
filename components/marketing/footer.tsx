"use client";

import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Create professional, ATS-friendly resumes in minutes.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "#features")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#ats"
              onClick={(e) => scrollToSection(e, "#ats")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ATS
            </a>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "#faq")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NiceResume. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
