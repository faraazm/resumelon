"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  EyeIcon,
  DocumentArrowUpIcon,
  ArrowPathIcon,
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
  PricingPreview,
  TemplateGrid,
  SingleDocument,
  FannedDocuments,
} from "@/components/marketing";
import type { FAQItem } from "@/components/marketing";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const atsChecks = [
  {
    icon: DocumentTextIcon,
    title: "Formatting Compliance",
    description:
      "ATS software expects a clean, linear document structure. Our checker scans your resume for tables, text boxes, multi-column layouts, headers, footers, and other formatting elements that commonly cause parsing failures. If the ATS cannot extract your text in the correct reading order, your qualifications are lost before a recruiter ever sees them. We flag every formatting issue and show you exactly how to fix it.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Keyword Density",
    description:
      "The ATS compares your resume against the job description to find matching skills, certifications, job titles, and industry terms. Our checker analyzes keyword frequency and placement across your resume, identifying critical terms you are missing and suggesting where to add them naturally. A resume without the right keywords receives a low relevance score regardless of your actual experience.",
  },
  {
    icon: ListBulletIcon,
    title: "Section Structure",
    description:
      "Applicant Tracking Systems rely on standard section headings to categorize your information. We verify that your resume uses recognized labels like Work Experience, Education, Skills, and Summary. Non-standard or creative headings such as My Journey or Toolkit cause the parser to misfile your data or skip entire sections, which directly lowers your ATS score.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Font & Layout",
    description:
      "Certain fonts, font sizes, and layout choices can break ATS parsing or render your resume unreadable. Our checker validates that you are using ATS-safe fonts, appropriate sizing, and a single-column layout that maintains a logical top-to-bottom flow. We also check for proper margin sizes and consistent spacing between sections.",
  },
  {
    icon: DocumentArrowUpIcon,
    title: "File Format",
    description:
      "Submitting your resume in the wrong file format is one of the fastest ways to get rejected. Our checker verifies that your document is a text-based PDF or DOCX with a fully selectable text layer. Image-based PDFs, design files, and uncommon formats like Pages or ODT are unreadable by most ATS platforms and will result in an automatic rejection.",
  },
  {
    icon: EyeIcon,
    title: "Readability Score",
    description:
      "Beyond ATS compatibility, your resume needs to be clear and easy to scan when it reaches a human reviewer. We evaluate sentence length, bullet point structure, action verb usage, and overall content clarity. Recruiters spend an average of six to seven seconds on an initial resume scan, so concise and impactful writing is essential for making it past both the machine and the person.",
  },
];

const howItWorksSteps = [
  {
    icon: DocumentArrowUpIcon,
    title: "Upload Your Resume",
    description:
      "Upload your existing resume as a PDF or DOCX file. Our parser reads the full document and extracts all text content, section headings, and structural elements for analysis. The upload takes seconds and works with any resume format.",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Paste the Job Description",
    description:
      "Copy and paste the job description you are targeting. Our system extracts the required skills, preferred qualifications, key responsibilities, and industry-specific terminology that the employer's ATS will be scanning for.",
  },
  {
    icon: ChartBarIcon,
    title: "Get Your Instant Score",
    description:
      "Receive a detailed ATS compatibility score out of 100 within seconds. The score breaks down into individual categories including formatting, keywords, section structure, and readability so you know exactly where your resume stands.",
  },
  {
    icon: ArrowPathIcon,
    title: "Apply Fixes & Recheck",
    description:
      "Follow our specific, actionable recommendations to fix every issue. Then run the checker again to confirm your improvements. Most users go from a failing score to above 90 in a single editing session using our guided suggestions.",
  },
];

const showcaseFeatures = [
  {
    title: "Detailed Keyword Gap Analysis",
    description:
      "Our ATS resume checker does not just tell you that keywords are missing. It performs a deep comparison between your resume and the target job description, identifying every required skill, certification, and qualification you have not addressed. The analysis categorizes missing terms by importance, distinguishing between must-have requirements and nice-to-have preferences. You see exactly which keywords to add and where they fit most naturally in your existing content, so your resume reads authentically rather than feeling keyword-stuffed.",
    bullets: [
      "Side-by-side comparison of your resume against job requirements",
      "Missing keywords ranked by importance and relevance",
      "Context-aware placement suggestions for each term",
      "Industry-specific terminology detection for specialized fields",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="executive-navy"
        gradient="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50"
        rotate={-3}
        badges={[
          { icon: MagnifyingGlassIcon, label: "12 Keywords Found", position: "top-right", delay: 0.6, variant: "blue" },
          { icon: ChartBarIcon, label: "Match: 94%", position: "bottom-left", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "Formatting & Structure Audit",
    description:
      "The formatting audit examines every structural element of your resume to ensure full ATS compatibility. It checks for problematic elements like embedded tables, text boxes, images, headers and footers, and non-standard fonts that cause parsing errors across major ATS platforms including Workday, Greenhouse, Lever, iCIMS, and Taleo. Each issue is flagged with a clear explanation of why it causes problems and a specific fix you can apply immediately. The goal is a resume that scores perfectly with automated systems while still looking polished and professional.",
    bullets: [
      "Detects tables, text boxes, and multi-column layouts",
      "Validates fonts, margins, and spacing for ATS safety",
      "Checks section heading recognition across major ATS platforms",
      "Ensures proper reading order matches visual layout",
    ],
    visual: (
      <TemplateGrid
        type="resume"
        gradient="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
        templates={[
          { id: "ats-classic", rotate: -2, x: -5, y: 4, delay: 0.1 },
          { id: "bold-modern", rotate: 2, x: 4, y: -2, delay: 0.2 },
          { id: "executive-navy", rotate: -1, x: -3, y: 2, delay: 0.3 },
          { id: "creative-bold", rotate: 3, x: 5, y: -4, delay: 0.4 },
        ]}
        badges={[
          { icon: ShieldCheckIcon, label: "Format Verified", position: "top-left", delay: 0.6, variant: "success" },
          { icon: CheckCircleIcon, label: "No Issues Found", position: "bottom-right", delay: 0.75 },
        ]}
      />
    ),
  },
  {
    title: "Score Tracking & Improvement History",
    description:
      "Track your ATS score over time as you refine your resume. Every check is saved so you can see your progress from the initial upload through each round of improvements. The score history shows exactly which changes had the biggest impact on your compatibility rating, helping you understand what matters most for ATS success. When you are ready to apply for a different role, run the checker again with a new job description to tailor your resume and ensure your score stays high across multiple applications.",
    bullets: [
      "Comprehensive score out of 100 with category breakdowns",
      "Before-and-after comparison for every editing session",
      "Tracks improvement trends across multiple job applications",
      "One-click re-check after applying suggested fixes",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
        cards={[
          { templateId: "minimal-clean", rotate: -6, x: -35, y: 10, delay: 0.1 },
          { templateId: "creative-bold", rotate: 3, x: 10, y: 0, delay: 0.24 },
        ]}
        badges={[
          { icon: ChartBarIcon, label: "Score: 97/100", position: "top-left", delay: 0.6, variant: "amber" },
          { icon: DocumentCheckIcon, label: "All Issues Resolved", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
];

const stats = [
  { value: "75%", label: "of resumes are rejected by ATS before a human reviews them" },
  { value: "98%", label: "of Fortune 500 companies use ATS to screen applicants" },
  { value: "3x", label: "more interview callbacks with an ATS-optimized resume" },
  { value: "40%", label: "of applicants are filtered out due to formatting errors alone" },
];

const faqs: FAQItem[] = [
  {
    question: "What is an ATS resume checker and how does it work?",
    answer:
      "An ATS resume checker is a tool that analyzes your resume the same way an Applicant Tracking System would. It parses your document, evaluates its formatting and structure, compares your content against a target job description for keyword matches, and produces a compatibility score. Our checker simulates the screening process used by platforms like Workday, Greenhouse, and Lever so you can identify and fix problems before you submit your application.",
  },
  {
    question: "Is the ATS resume checker free to use?",
    answer:
      "You can check your resume and receive a basic ATS compatibility score at no cost. The free check includes formatting validation, section structure analysis, and an overall score. Pro users get additional features including detailed keyword gap analysis, specific fix suggestions, score tracking over time, and unlimited re-checks across multiple job descriptions.",
  },
  {
    question: "What ATS score do I need to pass automated screening?",
    answer:
      "Most employers set their ATS threshold between 70 and 80 out of 100, though this varies by company and role. We recommend aiming for a score of 85 or above to give yourself a comfortable margin. Resumes that score below 70 are almost always filtered out automatically. Our checker gives you a clear score with specific steps to reach your target.",
  },
  {
    question: "How accurate is an ATS resume checker compared to a real ATS?",
    answer:
      "Our checker is built to replicate the parsing and scoring logic used by the most widely adopted ATS platforms. While no external tool can perfectly replicate every proprietary algorithm, our checker evaluates the same core factors that determine pass or fail: formatting compatibility, keyword presence, section structure, and file format. Users who score above 85 on our checker consistently report higher callback rates from their applications.",
  },
  {
    question: "Can I check my resume against a specific job description?",
    answer:
      "Yes, and we strongly recommend it. Paste the full job description for the role you are targeting, and our checker will perform a keyword-by-keyword comparison against your resume. It identifies every required skill, qualification, and term you are missing, then suggests where and how to incorporate them. Checking against the specific job description is far more effective than a generic ATS scan because every employer weights different keywords differently.",
  },
  {
    question: "What are the most common reasons resumes fail ATS checks?",
    answer:
      "The most frequent issues are formatting problems like tables, multi-column layouts, text boxes, and images that break the parser. After formatting, the biggest failure point is missing keywords where the resume does not contain the specific terms the ATS is searching for. Other common problems include non-standard section headings, information placed in headers or footers that the ATS ignores, incompatible file formats, and special characters that do not convert properly during text extraction.",
  },
  {
    question: "How often should I run an ATS check on my resume?",
    answer:
      "You should run a check every time you apply for a new role or make significant changes to your resume. Since different job descriptions prioritize different keywords and qualifications, a resume that scores well for one position may score poorly for another. Running the checker with each new job description takes only a few seconds and ensures your resume is optimized for the specific role you are targeting.",
  },
  {
    question: "Does the checker work with resumes created outside this platform?",
    answer:
      "Yes. You can upload any resume in PDF or DOCX format, regardless of where it was created. The checker parses and analyzes the document independently. That said, resumes built with our platform tend to score higher out of the box because our templates are engineered for ATS compatibility from the ground up, eliminating the formatting issues that cause most external resumes to fail.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ATSResumeCheckerPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---- Hero ---- */}
        <PageHero
          badge="ATS Resume Checker"
          heading={
            <>
              Check Your Resume&rsquo;s ATS Score{" "}
              <span className="text-muted-foreground">Before You Apply</span>
            </>
          }
          description="Over 75% of resumes are rejected by Applicant Tracking Systems before a recruiter ever reads them. Upload your resume, paste a job description, and get an instant ATS compatibility score with actionable fixes to improve your chances."
          ctaLabel="Check My Resume Now"
          ctaHref="/sign-up"
          secondaryCtaLabel="Learn what ATS checks"
          secondaryCtaHref="#what-ats-checks"
        />

        {/* ---- What ATS Checks ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="what-ats-checks"
            ariaLabelledBy="what-ats-checks-heading"
          >
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                id="what-ats-checks-heading"
                badge="Understanding ATS Screening"
                heading="What Applicant Tracking Systems Actually Check"
                description="When you submit a resume online, it passes through automated software that decides whether a human ever sees it. Here is what that software evaluates."
              />
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  An Applicant Tracking System is software that employers use to
                  collect, parse, filter, and rank job applications. Over 98% of
                  Fortune 500 companies and a growing majority of mid-size businesses
                  rely on ATS platforms like Workday, Greenhouse, Lever, iCIMS, and
                  Taleo to manage their hiring pipelines. When you click
                  &ldquo;Apply&rdquo; on a job posting, your resume enters this
                  system, and the ATS determines whether it moves forward or gets
                  filtered out.
                </p>
                <p>
                  The ATS begins by parsing your resume file, extracting the raw text
                  and attempting to map it into structured data fields such as name,
                  contact information, work history, education, and skills. If your
                  resume uses complex formatting like tables, multi-column layouts,
                  embedded images, or non-standard fonts, the parser may scramble
                  your content or skip entire sections. This single step is where
                  most resumes fail.
                </p>
                <p>
                  After parsing, the ATS compares your extracted content against the
                  job description, searching for matching keywords including specific
                  skills, certifications, job titles, tools, and industry terminology.
                  Your resume receives a numerical relevance score based on how many
                  of these keywords appear and how they are used in context. Only
                  resumes that exceed the employer&rsquo;s score threshold advance to
                  a recruiter for manual review. Understanding what the ATS checks is
                  the first step toward ensuring your resume makes it through.
                </p>
                <p>
                  <BrandName /> checks your resume against every one of these
                  factors, giving you a clear score and specific fixes so you can
                  submit with confidence.
                </p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- How Our Checker Works (4 steps) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="default"
            id="how-it-works"
            ariaLabelledBy="how-it-works-heading"
          >
            <SectionHeader
              id="how-it-works-heading"
              badge="How It Works"
              heading="Check Your Resume in Four Simple Steps"
              description="Our ATS resume checker walks you through a straightforward process from upload to a fully optimized, high-scoring resume."
            />
            <motion.div
              className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <step.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="absolute right-5 top-5 text-sm font-medium text-muted-foreground/50">
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
            </motion.div>
          </SectionWrapper>
        </motion.div>

        {/* ---- What We Check (6 cards) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="what-we-check"
            ariaLabelledBy="what-we-check-heading"
          >
            <SectionHeader
              id="what-we-check-heading"
              badge="Comprehensive Analysis"
              heading="Six Critical Areas We Analyze in Your Resume"
              description="Our ATS resume checker evaluates every dimension that automated screening systems care about, so nothing slips through the cracks."
            />
            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {atsChecks.map((check, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <check.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {check.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {check.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Feature Showcase (3 deep features) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="default"
            id="deep-features"
            ariaLabelledBy="deep-features-heading"
          >
            <SectionHeader
              id="deep-features-heading"
              badge="Key Features"
              heading="Go Beyond a Basic ATS Score"
              description="Our resume checker provides the detailed analysis and actionable guidance you need to consistently pass automated screening."
            />
            <div className="mt-14">
              <FeatureShowcase features={showcaseFeatures} />
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Stats / Trust Section ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="stats"
            ariaLabelledBy="stats-heading"
          >
            <SectionHeader
              id="stats-heading"
              heading="The Numbers Behind ATS Screening"
              description="Understanding the scale of automated resume filtering shows why checking your resume before applying is not optional."
            />
            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6 text-center"
                  variants={staggerItem}
                >
                  <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Pricing ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <PricingPreview />
        </motion.div>

        {/* ---- FAQ ---- */}
        <PageFAQ
          heading="ATS Resume Checker FAQ"
          description="Everything you need to know about checking and scoring your resume for Applicant Tracking Systems."
          faqs={faqs}
          id="ats-checker-faq"
        />

        {/* ---- CTA Banner ---- */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Stop Guessing. Start Scoring.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Every application you send with an unchecked resume is a gamble.
              Run your resume through our ATS checker in seconds and know
              exactly where you stand before you hit submit. Fix the issues,
              raise your score, and get your application in front of real
              hiring managers.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Check My Resume Now"
                signedOutHref="/sign-up"
              />
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
