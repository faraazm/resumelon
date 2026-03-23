"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./logo";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "/resume-generator", label: "Resume Generator" },
      { href: "/cover-letter-generator", label: "Cover Letter Generator" },
      { href: "/ats-resume-builder", label: "ATS Resume Builder" },
      { href: "/resume-templates", label: "Resume Templates" },
      { href: "/cover-letter-templates", label: "Cover Letter Templates" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How It Works" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // On the home page, scroll to the section directly
    if (isHomePage && href.startsWith("/#")) {
      e.preventDefault();
      const element = document.querySelector(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    // On other pages, the <Link> will navigate to /#section which loads
    // the home page and the browser handles the hash scroll
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              AI-powered resumes and cover letters, tailored for every job you
              apply to. Mass apply smarter, land more interviews.
            </p>
          </div>

          {/* Link Columns */}
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={`${column.title} links`}>
              <h3 className="text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleClick(e, link.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} resumeclone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
