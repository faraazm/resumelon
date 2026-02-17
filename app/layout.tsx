import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: "italic",
  variable: "--font-instrument-serif",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: {
    default: "NiceResume - Free AI Resume Builder | Create ATS-Optimized Resumes",
    template: "%s | NiceResume",
  },
  description:
    "Build professional, ATS-friendly resumes in minutes with NiceResume. Our free AI-powered resume builder helps you create job-winning resumes that pass Applicant Tracking Systems and land interviews.",
  keywords: [
    "resume builder",
    "AI resume builder",
    "free resume builder",
    "ATS resume",
    "ATS-friendly resume",
    "professional resume",
    "online resume builder",
    "resume maker",
    "CV builder",
    "job application",
    "career",
    "resume templates",
  ],
  authors: [{ name: "NiceResume" }],
  creator: "NiceResume",
  publisher: "NiceResume",
  metadataBase: new URL("https://niceresume.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://niceresume.com",
    siteName: "NiceResume",
    title: "NiceResume - Free AI Resume Builder | Create ATS-Optimized Resumes",
    description:
      "Build professional, ATS-friendly resumes in minutes. Our free AI-powered resume builder helps you create job-winning resumes that land interviews.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "NiceResume - AI-Powered Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NiceResume - Free AI Resume Builder",
    description:
      "Build professional, ATS-friendly resumes in minutes with our free AI-powered resume builder.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
            suppressHydrationWarning
          >
            {children}
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
