"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Logo } from "./logo";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
    },
  }),
};

const buttonVariants = {
  closed: { opacity: 0, y: 20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
    },
  }),
};

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydration safety pattern
    setMounted(true);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-x-0 top-[73px] bottom-0 z-[9999] overflow-y-auto bg-white md:hidden"
          style={{ backgroundColor: "#ffffff" }}
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <div className="flex min-h-full flex-col px-4 py-6">
            <div className="flex-1 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block rounded-md px-3 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100"
                  variants={itemVariants}
                  custom={i}
                  initial="closed"
                  animate="open"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3 pb-6">
              <ClerkLoading>
                <div className="h-11 w-full animate-pulse rounded-md bg-gray-200" />
                <div className="h-11 w-full animate-pulse rounded-md bg-gray-200" />
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <motion.div
                    variants={buttonVariants}
                    custom={0}
                    initial="closed"
                    animate="open"
                  >
                    <Button variant="outline" size="lg" asChild className="w-full">
                      <Link href="/sign-in">Log in</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    custom={1}
                    initial="closed"
                    animate="open"
                  >
                    <Button size="lg" asChild className="w-full">
                      <Link href="/sign-up">Create my resume</Link>
                    </Button>
                  </motion.div>
                </SignedOut>
                <SignedIn>
                  <motion.div
                    variants={buttonVariants}
                    custom={0}
                    initial="closed"
                    animate="open"
                  >
                    <Button size="lg" asChild className="w-full">
                      <Link href="/resumes">Go to Dashboard</Link>
                    </Button>
                  </motion.div>
                </SignedIn>
              </ClerkLoaded>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Spacer to prevent content jump when header becomes fixed */}
      {mobileMenuOpen && <div className="h-[73px] md:hidden" />}
      <header className={`${mobileMenuOpen ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 w-full border-b border-border/40 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95`}>
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Loading skeleton - shows while Clerk is initializing */}
            <ClerkLoading>
              <div className="flex items-center gap-4">
                <div className="h-9 w-[70px] animate-pulse rounded-md bg-muted" />
                <div className="h-9 w-[140px] animate-pulse rounded-md bg-muted" />
              </div>
            </ClerkLoading>

            {/* Actual auth buttons - shown after Clerk loads */}
            <ClerkLoaded>
              <SignedOut>
                <Button variant="outline" asChild>
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Create my resume</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button variant="outline" asChild>
                  <Link href="/resumes">Dashboard</Link>
                </Button>
                <UserButton />
              </SignedIn>
            </ClerkLoaded>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile menu - rendered via portal to document.body */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
