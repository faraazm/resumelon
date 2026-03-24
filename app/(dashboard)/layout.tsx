"use client";

import { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DocumentTextIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSyncUser } from "@/hooks/use-sync-user";
import { ViewPreferenceProvider } from "@/hooks/use-view-preference";
import { DocumentCacheProvider } from "@/hooks/use-document-cache";

const navigation = [
  { name: "Resumes", href: "/resumes", icon: DocumentTextIcon },
  { name: "Cover Letters", href: "/cover-letters", icon: EnvelopeIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sync Clerk user with Convex
  useSyncUser();

  // Check if we're in the resume editor or onboarding (hide navigation)
  const isEditorView = pathname.includes("/edit") || pathname.includes("/new") || pathname.includes("/optimize") || pathname.includes("/tailor");
  const isOnboarding = pathname.includes("/onboarding");
  const showNav = !isEditorView && !isOnboarding;

  // Force scrollbar visible on dashboard pages to prevent layout shift
  useEffect(() => {
    if (!showNav) return;
    document.documentElement.style.overflowY = "scroll";
    return () => {
      document.documentElement.style.overflowY = "";
    };
  }, [showNav]);

  if (!showNav) {
    return <TooltipProvider>{children}</TooltipProvider>;
  }

  return (
    <TooltipProvider>
      <ViewPreferenceProvider>
      <DocumentCacheProvider>
      <div className="min-h-screen bg-muted/30">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/resumes" className="flex items-center gap-1.5 text-[20px] font-semibold tracking-tight">
              <Image
                src="/images/resumelon-logo.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span>resumelon</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center gap-1 rounded-lg bg-gray-100 p-1 md:flex">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
      </DocumentCacheProvider>
      </ViewPreferenceProvider>
    </TooltipProvider>
  );
}
