"use client";

import { motion } from "framer-motion";
import {
  Navbar,
  Hero,
  FeatureSections,
  FeatureGrid,
  ATSExplainer,
  PricingPreview,
  FAQ,
  CTABanner,
  Footer,
} from "@/components/marketing";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NiceResume",
  url: "https://niceresume.com",
  logo: "https://niceresume.com/images/nice-resume-logo.png",
  description:
    "AI-powered resume builder that helps job seekers create professional, ATS-optimized resumes.",
  sameAs: [],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NiceResume",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Plan",
      description: "Create 1 resume with basic templates",
    },
    {
      "@type": "Offer",
      price: "19.99",
      priceCurrency: "USD",
      name: "Pro Plan",
      description:
        "Unlimited resumes, all templates, AI suggestions, and cover letter generator",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1200",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why should I use an online resume builder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An online resume builder like NiceResume saves you hours of formatting headaches. You get professional, ATS-optimized templates, real-time previews, and AI-powered suggestions—all without needing design skills.",
      },
    },
    {
      "@type": "Question",
      name: "Are NiceResume templates ATS-friendly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100%. Every NiceResume template is designed from the ground up to be ATS-compatible. We use clean formatting, standard fonts, proper heading structures, and text-based PDFs that parse correctly through any Applicant Tracking System.",
      },
    },
    {
      "@type": "Question",
      name: "Is the NiceResume resume builder really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can create one resume, choose from our basic templates, and download it as a PDF completely free. No credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "What is ATS and why does it matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ATS (Applicant Tracking System) is software used by over 90% of large companies to filter resumes before a human sees them. If your resume isn't ATS-friendly, it might never reach a recruiter—no matter how qualified you are.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NiceResume",
  url: "https://niceresume.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://niceresume.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navbar />
      </motion.div>
      <main>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Hero />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <FeatureSections />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <FeatureGrid />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <ATSExplainer />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <PricingPreview />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <FAQ />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <CTABanner />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
