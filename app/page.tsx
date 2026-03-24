"use client";

import { motion } from "framer-motion";
import {
  Navbar,
  Hero,
  ProblemSection,
  SolutionSection,
  HowItWorks,
  BenefitsSection,
  FeatureSections,
  FeatureGrid,
  ComparisonSection,
  ATSExplainer,
  Testimonials,
  UseCases,
  ObjectionSection,
  PricingPreview,
  UrgencyCTA,
  FAQ,
  CTABanner,
  Footer,
} from "@/components/marketing";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "resumeclone",
  url: "https://resumeclone.com",
  logo: "https://resumeclone.com/images/resumeclone-logo.png",
  description:
    "AI-powered resume builder that helps job seekers create tailored, ATS-optimized resumes and cover letters for every application.",
  sameAs: [],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "resumeclone",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Generate ATS-friendly resumes and cover letters tailored to any job description. Create customized, optimized applications in minutes.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Plan",
      description:
        "Create 1 resume with basic templates and PDF download",
    },
    {
      "@type": "Offer",
      price: "19.99",
      priceCurrency: "USD",
      name: "Pro Plan",
      description:
        "Unlimited resumes, all templates, AI suggestions, cover letter generator, and DOCX export",
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
      name: "What is resumeclone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "resumeclone is an AI-powered resume builder that helps you create, tailor, and optimize resumes and cover letters. Upload your base resume once, paste a job description, and instantly generate an ATS-friendly, customized resume tailored to that role.",
      },
    },
    {
      "@type": "Question",
      name: "How does resumeclone work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your base resume or fill in your details, paste the job description you're targeting, and resumeclone's AI generates a tailored resume and cover letter optimized for that role. Your resume is formatted to pass ATS filters and ready to download as PDF or DOCX.",
      },
    },
    {
      "@type": "Question",
      name: "Are resumeclone templates ATS-friendly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100%. Every resumeclone template is designed from the ground up to be ATS-compatible. We use clean formatting, standard fonts, proper heading structures, and text-based PDFs that parse correctly through any Applicant Tracking System.",
      },
    },
    {
      "@type": "Question",
      name: "Is the resumeclone resume builder really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can create one resume, choose from basic templates, and download it as a PDF completely free. No credit card required. Our Pro plan ($19.99/month or $99.99/year) unlocks unlimited resumes, all premium templates, AI writing assistance, cover letters, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Does resumeclone generate cover letters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. resumeclone Pro generates a personalized cover letter alongside your tailored resume. Each cover letter is matched to the job description and pulls relevant details from your resume.",
      },
    },
    {
      "@type": "Question",
      name: "How many resumes can I create?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free users can create 1 resume with basic templates and PDF download. Pro users get unlimited resumes, all premium templates, AI suggestions, cover letters, and DOCX export—everything you need to tailor your resume for every application.",
      },
    },
    {
      "@type": "Question",
      name: "Is resumeclone suitable for students and new graduates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. resumeclone is built for all job seekers—students applying to internships, new graduates entering the job market, career switchers, and experienced professionals. The AI adapts to your experience level.",
      },
    },
    {
      "@type": "Question",
      name: "Does resumeclone work for all industries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our templates and AI optimization work across all industries—tech, finance, healthcare, marketing, education, and more. The AI tailors your resume based on the specific job description.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "resumeclone",
  url: "https://resumeclone.com",
  description:
    "AI-powered resume builder for creating tailored, ATS-optimized resumes and cover letters for every application.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://resumeclone.com/search?q={search_term_string}",
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
        {/* 1. Hero - Above the fold */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Hero />
        </motion.div>

        {/* 2. Problem - Agitate pain */}
        <AnimatedSection>
          <ProblemSection />
        </AnimatedSection>

        {/* 3. Solution - Introduce product */}
        <AnimatedSection>
          <SolutionSection />
        </AnimatedSection>

        {/* 4. How It Works - 4 steps */}
        <AnimatedSection>
          <HowItWorks />
        </AnimatedSection>

        {/* 5. Core Benefits */}
        <AnimatedSection>
          <BenefitsSection />
        </AnimatedSection>

        {/* 6. Feature Breakdown - Deeper layer */}
        <AnimatedSection>
          <FeatureSections />
        </AnimatedSection>

        {/* 7. Feature Grid */}
        <AnimatedSection>
          <FeatureGrid />
        </AnimatedSection>

        {/* 8. Before vs After */}
        <AnimatedSection>
          <ComparisonSection />
        </AnimatedSection>

        {/* 9. ATS Explainer */}
        <AnimatedSection>
          <ATSExplainer />
        </AnimatedSection>

        {/* 10. Social Proof */}
        <AnimatedSection>
          <Testimonials />
        </AnimatedSection>

        {/* 11. Use Cases */}
        <AnimatedSection>
          <UseCases />
        </AnimatedSection>

        {/* Mid-page urgency CTA */}
        <AnimatedSection>
          <UrgencyCTA />
        </AnimatedSection>

        {/* 12. Objection Handling */}
        <AnimatedSection>
          <ObjectionSection />
        </AnimatedSection>

        {/* 13. Pricing */}
        <AnimatedSection>
          <PricingPreview />
        </AnimatedSection>

        {/* 14. FAQ */}
        <AnimatedSection>
          <FAQ />
        </AnimatedSection>

        {/* 15. Final CTA */}
        <AnimatedSection>
          <CTABanner />
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
