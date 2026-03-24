"use client";

import { motion } from "framer-motion";
import {
  ClipboardDocumentListIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon,
  BoltIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Navbar,
  Footer,
  SectionWrapper,
  SectionHeader,
  InlineCTA,
  BrandName,
  PageHero,
  PageFAQ,
  FeatureShowcase,
  FannedDocuments,
  TemplateGrid,
  SingleDocument,
  PricingPreview,
} from "@/components/marketing";
import type { FAQItem } from "@/components/marketing";

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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    icon: ClipboardDocumentListIcon,
    title: "Upload or Build Your Base Resume",
    description:
      "Start by importing an existing resume or filling in your work history, education, skills, and accomplishments. This becomes your master profile that feeds every future resume you generate.",
  },
  {
    icon: SparklesIcon,
    title: "Paste the Job Description",
    description:
      "Copy and paste the job listing you want to apply for. Our AI reads the role requirements, preferred qualifications, and keywords so it knows exactly what the hiring manager and their ATS are looking for.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "AI Generates a Tailored Resume",
    description:
      "In seconds, the generator produces a complete resume rewritten for that specific role. It highlights your most relevant experience, mirrors the language of the job posting, and structures everything for maximum ATS compatibility.",
  },
  {
    icon: DocumentArrowDownIcon,
    title: "Review, Edit, and Download",
    description:
      "Fine-tune the generated resume in our live editor, pick a professional template, and download as a polished PDF or DOCX. Your tailored resume is ready to submit.",
  },
];

const benefits = [
  {
    icon: BoltIcon,
    title: "Save Hours Per Application",
    description:
      "The average job seeker spends 30 to 60 minutes customizing a single resume. With the AI resume generator, you produce a fully tailored version in under a minute. Apply to ten jobs in the time it used to take you to apply to one.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Beat Applicant Tracking Systems",
    description:
      "Over 75 percent of resumes are rejected by ATS software before a human ever sees them. Every resume our generator creates uses clean formatting, standard section headings, and keyword optimization designed to pass automated screening filters.",
  },
  {
    icon: SparklesIcon,
    title: "Keyword-Matched Content",
    description:
      "The generator analyzes the job description for critical keywords, hard skills, and phrases. It then weaves them naturally into your resume so your application reads as a strong match without sounding forced or keyword-stuffed.",
  },
  {
    icon: DocumentDuplicateIcon,
    title: "Unlimited Variations, One Profile",
    description:
      "Maintain a single master profile and generate as many role-specific resumes as you need. Applying to five different positions this week? Each resume is uniquely tailored without you starting from scratch every time.",
  },
  {
    icon: UserGroupIcon,
    title: "Works for Every Career Stage",
    description:
      "Whether you are a recent graduate applying to your first internship, a mid-career professional pivoting industries, or a senior leader targeting executive roles, the AI adapts tone, depth, and emphasis to match your experience level.",
  },
  {
    icon: ClockIcon,
    title: "Always Up-to-Date Best Practices",
    description:
      "Resume conventions change. Our AI stays current with the latest hiring trends, formatting standards, and ATS requirements so you never have to worry about outdated advice or templates that no longer work.",
  },
];

const showcaseFeatures = [
  {
    title: "Intelligent Job Description Analysis",
    description:
      "Our AI does not just scan for keywords. It comprehends the full context of a job posting, from required qualifications and preferred experience to soft skills and team culture signals. This deep analysis ensures your generated resume aligns with what the employer actually values, not just a checklist of buzzwords.",
    bullets: [
      "Extracts hard skills, soft skills, and industry-specific terminology",
      "Identifies role seniority and adjusts language accordingly",
      "Detects preferred certifications and tools to highlight in your resume",
      "Matches company tone, whether corporate, startup, or creative",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50"
        cards={[
          { templateId: "ats-classic", rotate: -6, x: -40, y: 12, delay: 0.1 },
          { templateId: "bold-modern", rotate: 2, x: 5, y: 0, delay: 0.24 },
        ]}
        badges={[
          { icon: MagnifyingGlassIcon, label: "Keywords Found", position: "top-right", delay: 0.6, variant: "blue" },
          { icon: BoltIcon, label: "Instant Analysis", position: "bottom-left", delay: 0.8, variant: "accent" },
        ]}
      />
    ),
  },
  {
    title: "Professional Templates Built for ATS",
    description:
      "Every template in our library is engineered from the ground up to be ATS-friendly. That means clean single-column or structured multi-column layouts, standard fonts, properly tagged headings, and text-based PDF output that parses correctly through every major applicant tracking system on the market.",
    bullets: [
      "Tested against top ATS platforms including Greenhouse, Lever, and Workday",
      "Customizable colors, fonts, and spacing without breaking ATS compatibility",
      "Print-ready PDF and editable DOCX export options",
      "Consistent, polished formatting across every device and viewer",
    ],
    visual: (
      <TemplateGrid
        type="resume"
        gradient="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
        templates={[
          { id: "executive-navy", rotate: -2, x: -4, y: 4, delay: 0.1 },
          { id: "minimal-clean", rotate: 2, x: 4, y: -3, delay: 0.2 },
          { id: "ats-classic", rotate: -1, x: -3, y: 2, delay: 0.3 },
          { id: "creative-bold", rotate: 3, x: 5, y: -4, delay: 0.4 },
        ]}
        badges={[
          { icon: ShieldCheckIcon, label: "ATS Verified", position: "top-left", delay: 0.6, variant: "success" },
          { icon: AdjustmentsHorizontalIcon, label: "Fully Customizable", position: "bottom-right", delay: 0.75 },
        ]}
      />
    ),
  },
  {
    title: "AI-Powered Bullet Point Rewriting",
    description:
      "Weak, generic bullet points are the number one reason resumes fail to impress. The generator rewrites your experience bullets to be results-driven, quantified, and action-oriented. Each bullet is tailored to the specific role so reviewers immediately see your impact.",
    bullets: [
      "Transforms duty-based descriptions into achievement-focused statements",
      "Adds metrics and quantifiable outcomes where your data supports them",
      "Uses strong action verbs aligned with the target job description",
      "Maintains your authentic voice while elevating professional polish",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="timeline-blue"
        gradient="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50"
        rotate={-3}
        badges={[
          { icon: SparklesIcon, label: "AI Rewritten", position: "top-left", delay: 0.6, variant: "blue" },
          { icon: BoltIcon, label: "Results-Driven", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
];

const comparisonRows = [
  { label: "Time per application", without: "30-60 minutes", with: "Under 2 minutes" },
  { label: "Keyword optimization", without: "Manual guesswork", with: "AI-driven, automatic" },
  { label: "ATS compatibility", without: "Unknown, risky formatting", with: "Guaranteed ATS-safe templates" },
  { label: "Tailoring to job description", without: "Copy-paste and hope", with: "Context-aware rewriting" },
  { label: "Bullet point quality", without: "Generic duty lists", with: "Quantified, results-driven" },
  { label: "Consistency across applications", without: "Varies wildly", with: "Professional and uniform" },
  { label: "Confidence in submission", without: "Second-guessing every line", with: "Data-backed, optimized" },
];

const faqs: FAQItem[] = [
  {
    question: "How does the AI resume generator work?",
    answer:
      "You start by uploading or building your base resume with your work history, skills, and education. Then you paste a job description for the role you want to apply to. Our AI analyzes the job requirements, matches them against your experience, and generates a fully tailored resume that highlights your most relevant qualifications. The entire process takes less than a minute.",
  },
  {
    question: "Will my generated resume pass ATS screening?",
    answer:
      "Yes. Every resume produced by the generator uses ATS-optimized formatting, including clean layouts, standard section headings, proper font choices, and text-based PDF output. We test our templates against the most widely used applicant tracking systems, including Greenhouse, Lever, Workday, and iCIMS, to ensure your resume parses correctly every time.",
  },
  {
    question: "Can I edit the resume after it is generated?",
    answer:
      "Absolutely. The generated resume opens in our full-featured editor where you can adjust wording, reorder sections, swap templates, change fonts and colors, and fine-tune every detail before downloading. The generator gives you a strong starting point, and you have complete control over the final result.",
  },
  {
    question: "How many resumes can I generate?",
    answer:
      "Free users can generate up to five resumes per month. Pro subscribers get unlimited resume generations, which means you can create a unique, tailored resume for every single job you apply to without any restrictions.",
  },
  {
    question: "Does the generator just stuff keywords into my resume?",
    answer:
      "No. Keyword stuffing is a common mistake that actually hurts your chances. Our AI understands the context of the job description and integrates relevant keywords naturally throughout your resume. The result reads as a polished, human-written document that happens to align perfectly with what the employer is looking for.",
  },
  {
    question: "What file formats can I download my resume in?",
    answer:
      "You can download your generated resume as a PDF, which is the preferred format for most job applications, or as a DOCX file if the employer specifically requests an editable document. Both formats maintain the professional formatting and ATS compatibility of your chosen template.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption for all data in transit and at rest. Your resume content and personal information are never shared with third parties, and you can delete your data at any time from your account settings.",
  },
  {
    question: "Can I use the generator if I have limited work experience?",
    answer:
      "Yes. The AI is designed to work with all experience levels. For students and recent graduates, it emphasizes relevant coursework, projects, internships, volunteer work, and transferable skills. It adapts its language and structure to present your background in the strongest possible light, regardless of how many years of experience you have.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export function ResumeGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navbar />
      </motion.div>

      <main>
        {/* 1. Hero */}
        <PageHero
          badge="AI Resume Generator"
          heading={
            <>
              Generate Tailored Resumes for Every Job{" "}
              <span className="text-muted-foreground">— In Seconds</span>
            </>
          }
          description="Stop spending hours rewriting your resume for every application. Paste a job description, and our AI instantly generates a polished, ATS-optimized resume tailored to the role. More interviews, less busywork."
          ctaLabel="Generate My First Resume"
          ctaHref="/sign-up"
          secondaryCtaLabel="See how it works"
          secondaryCtaHref="#how-it-works"
        />

        {/* 2. Problem Section */}
        <AnimatedSection>
          <SectionWrapper background="muted" padding="md" id="problem" ariaLabelledBy="problem-heading">
            <SectionHeader
              id="problem-heading"
              heading="Resume Writing Is Broken"
              description="The traditional approach to resume writing costs you time, energy, and opportunities. Here is what most job seekers deal with every single day."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  stat: "30-60 min",
                  label: "spent customizing each resume",
                  detail:
                    "Every job posting demands a different version of your resume. Manually rewriting bullets, reorganizing sections, and adjusting keywords for each application eats up your entire evening.",
                },
                {
                  stat: "75%+",
                  label: "of resumes rejected by ATS",
                  detail:
                    "Most resumes never reach a human reviewer. Applicant tracking systems filter out applications with wrong formatting, missing keywords, or incompatible file structures before anyone reads them.",
                },
                {
                  stat: "200+",
                  label: "applications to land one offer",
                  detail:
                    "In a competitive market, volume matters. But when every application takes an hour to prepare, most candidates burn out long before they hit the numbers needed to get results.",
                },
              ].map((item) => (
                <div
                  key={item.stat}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <p className="text-3xl font-semibold tracking-tight text-foreground">
                    {item.stat}
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </AnimatedSection>

        {/* 3. How It Works */}
        <AnimatedSection>
          <SectionWrapper background="default" padding="md" id="how-it-works" ariaLabelledBy="how-it-works-heading">
            <SectionHeader
              id="how-it-works-heading"
              heading="How the AI Resume Generator Works"
              description="Four simple steps from job listing to polished, submission-ready resume. No writing skills required."
              badge="Simple Process"
            />
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-background p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <step.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="absolute right-6 top-6 text-sm font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </AnimatedSection>

        {/* 4. Benefits Grid */}
        <AnimatedSection>
          <SectionWrapper background="muted" padding="md" id="benefits" ariaLabelledBy="benefits-heading">
            <SectionHeader
              id="benefits-heading"
              heading="Why Job Seekers Choose Our Resume Generator"
              description="Every feature is designed to help you apply faster, rank higher in ATS results, and land more interviews."
              badge="Benefits"
            />
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-background p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <benefit.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </AnimatedSection>

        {/* 5. Feature Showcase */}
        <AnimatedSection>
          <SectionWrapper background="default" padding="md" id="features" ariaLabelledBy="features-heading">
            <SectionHeader
              id="features-heading"
              heading="Powerful Features Under the Hood"
              description="A closer look at the technology that makes your generated resumes stand out from the crowd."
              badge="Deep Dive"
            />
            <div className="mt-12">
              <FeatureShowcase features={showcaseFeatures} />
            </div>
          </SectionWrapper>
        </AnimatedSection>

        {/* 6. Comparison Table */}
        <AnimatedSection>
          <SectionWrapper background="muted" padding="md" id="comparison" ariaLabelledBy="comparison-heading">
            <SectionHeader
              id="comparison-heading"
              heading="Manual Resume Writing vs. resumelon"
              description="See exactly how the AI resume generator transforms your job search workflow from painful to effortless."
            />
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-background">
              {/* Table Header */}
              <div className="grid grid-cols-3 border-b border-border bg-muted/50 px-6 py-4 text-sm font-medium text-muted-foreground">
                <span />
                <span className="text-center">Without <BrandName /></span>
                <span className="text-center">With <BrandName /></span>
              </div>
              {/* Table Rows */}
              {comparisonRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${
                    index < comparisonRows.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="font-medium text-foreground">{row.label}</span>
                  <span className="flex items-center justify-center gap-2 text-center text-muted-foreground">
                    <XMarkIcon className="hidden h-4 w-4 shrink-0 text-red-400 sm:block" />
                    {row.without}
                  </span>
                  <span className="flex items-center justify-center gap-2 text-center text-foreground">
                    <CheckIcon className="hidden h-4 w-4 shrink-0 text-emerald-500 sm:block" />
                    {row.with}
                  </span>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </AnimatedSection>

        {/* 7. Pricing */}
        <AnimatedSection>
          <PricingPreview />
        </AnimatedSection>

        {/* 8. FAQ */}
        <AnimatedSection>
          <PageFAQ
            heading="Resume Generator FAQ"
            description="Everything you need to know about generating tailored resumes with AI."
            faqs={faqs}
            id="resume-generator-faq"
          />
        </AnimatedSection>

        {/* 8. Final CTA */}
        <AnimatedSection>
          <SectionWrapper background="primary" padding="md">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
                Your Next Resume Is One Click Away
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of job seekers who generate tailored, ATS-optimized
                resumes in seconds instead of hours. Stop rewriting from scratch
                and start landing interviews.
              </p>
              <div className="mt-8 flex justify-center">
                <InlineCTA
                  variant="secondary"
                  signedOutLabel="Generate My First Resume"
                  signedOutHref="/sign-up"
                />
              </div>
            </div>
          </SectionWrapper>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
