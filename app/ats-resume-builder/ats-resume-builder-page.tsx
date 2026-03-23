"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  CursorArrowRaysIcon,
  TableCellsIcon,
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

const atsSteps = [
  {
    icon: DocumentTextIcon,
    title: "Resume Parsing",
    description:
      "The ATS extracts text from your resume file and breaks it into structured data fields such as name, contact information, work history, education, and skills. Resumes with complex formatting, tables, or embedded images often fail at this stage because the parser cannot read them correctly.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Keyword Matching",
    description:
      "The system compares the extracted content against the job description, searching for required skills, certifications, job titles, and industry-specific terms. If your resume does not contain the right keywords in the right context, it will receive a low relevance score regardless of your actual qualifications.",
  },
  {
    icon: ChartBarIcon,
    title: "Scoring & Ranking",
    description:
      "Each resume receives a numerical score based on how closely it matches the job requirements. The ATS ranks all applicants from highest to lowest, and only candidates who exceed the employer's threshold score advance to the next round. Most systems filter out 70 to 90 percent of applicants at this stage.",
  },
  {
    icon: UserIcon,
    title: "Human Review",
    description:
      "A recruiter or hiring manager reviews only the top-scoring resumes that made it through the automated filters. Even if you are perfectly qualified for the role, a poorly formatted resume that fails parsing will never reach this stage. Making it past the ATS is the single most important step in the modern job application process.",
  },
];

const optimizationFeatures = [
  {
    icon: DocumentCheckIcon,
    title: "Clean, Parseable Formatting",
    description:
      "Every template uses a single-column layout with clearly defined sections. No text boxes, no columns nested inside tables, and no floating elements that confuse ATS parsers. Your content flows in a logical, top-to-bottom reading order that every major ATS can interpret correctly.",
  },
  {
    icon: ListBulletIcon,
    title: "Standard Section Headings",
    description:
      "ATS systems look for conventional section headings like Work Experience, Education, and Skills. Our templates use these industry-standard labels so the parser always categorizes your information into the correct fields, preventing data from being lost or misattributed.",
  },
  {
    icon: DocumentTextIcon,
    title: "Text-Based PDF Output",
    description:
      "Resumes are exported as machine-readable PDFs with selectable text, not flattened images. This ensures that every word on your resume is fully searchable and extractable by any ATS. The text layer is preserved exactly as structured, with proper character encoding throughout.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Keyword Optimization",
    description:
      "Our AI analyzes the target job description and identifies the exact skills, qualifications, and terminology the ATS will be scanning for. It then suggests where and how to incorporate these keywords naturally into your resume without keyword stuffing or awkward phrasing.",
  },
  {
    icon: CursorArrowRaysIcon,
    title: "Proper Reading Order",
    description:
      "Content is structured in a strict linear order that matches the visual layout. Many beautifully designed resumes have a visual reading order that differs from the underlying document structure, causing the ATS to read sections out of sequence and mismatch your data.",
  },
  {
    icon: TableCellsIcon,
    title: "No Tables or Graphics",
    description:
      "Icons, charts, skill bars, headshot photos, and decorative graphics are the most common reasons resumes fail ATS screening. Our templates achieve a professional, polished look using typography, whitespace, and subtle borders instead of visual elements that break parsing.",
  },
];

const showcaseFeatures = [
  {
    title: "ATS-Safe Resume Templates",
    description:
      "Every template in our library has been tested against the top ATS platforms including Workday, Greenhouse, Lever, iCIMS, and Taleo. They are designed to look professional to human readers while remaining fully machine-readable. You get the best of both worlds: a resume that passes automated filters and impresses recruiters when it lands on their desk.",
    bullets: [
      "Tested against Workday, Greenhouse, Lever, iCIMS, and Taleo",
      "Clean single-column layouts with clear visual hierarchy",
      "Professional typography that renders consistently across systems",
      "Customizable colors and spacing without breaking ATS compatibility",
    ],
    imagePlaceholder: "ATS-safe template gallery preview",
  },
  {
    title: "Intelligent Keyword Matching",
    description:
      "Paste a job description and our AI instantly identifies the most important keywords, skills, and qualifications the employer is looking for. It compares them against your resume and highlights gaps, then suggests specific, natural-sounding ways to incorporate missing terms. This is not generic advice. Every recommendation is tailored to the exact role you are applying for.",
    bullets: [
      "Automatic extraction of required and preferred qualifications",
      "Side-by-side comparison of your resume against job requirements",
      "Context-aware keyword suggestions that read naturally",
      "Industry-specific terminology matching for specialized roles",
    ],
    imagePlaceholder: "Keyword matching analysis dashboard",
  },
  {
    title: "Resume Scoring & Feedback",
    description:
      "Before you submit, run your resume through our ATS compatibility scanner. It evaluates your resume across multiple dimensions including formatting compliance, keyword density, section structure, and overall readability. You receive a detailed score with specific, actionable recommendations to improve your chances of passing the automated screening stage.",
    bullets: [
      "Comprehensive ATS compatibility score out of 100",
      "Section-by-section formatting analysis",
      "Keyword density and placement evaluation",
      "Actionable improvement suggestions with one-click fixes",
    ],
    imagePlaceholder: "Resume scoring dashboard with detailed feedback",
  },
];

const comparisonItems = [
  { label: "Single-column, linear layout", good: true, bad: false },
  { label: "Standard section headings", good: true, bad: false },
  { label: "Machine-readable text PDF", good: true, bad: false },
  { label: "Keywords matched to job description", good: true, bad: false },
  { label: "Clean typography, no decorative graphics", good: true, bad: false },
  { label: "Consistent date and location formatting", good: true, bad: false },
  { label: "Multi-column or table-based layout", good: false, bad: true },
  { label: "Creative or non-standard headings", good: false, bad: true },
  { label: "Image-based or designed PDF", good: false, bad: true },
  { label: "Generic content with no keyword targeting", good: false, bad: true },
  { label: "Icons, charts, skill bars, or photos", good: false, bad: true },
  { label: "Inconsistent or missing date formats", good: false, bad: true },
];

const stats = [
  { value: "99%", label: "ATS parse rate with our templates" },
  { value: "75%", label: "of resumes are rejected before a human sees them" },
  { value: "98%", label: "of Fortune 500 companies use an ATS" },
  { value: "3x", label: "more interviews for ATS-optimized resumes" },
];

const faqs: FAQItem[] = [
  {
    question: "What is an Applicant Tracking System (ATS)?",
    answer:
      "An Applicant Tracking System is software used by employers to collect, sort, scan, and rank job applications. When you submit a resume online, it almost always goes through an ATS before a human ever sees it. The system parses your resume into structured data, searches for relevant keywords, and assigns a score based on how well your qualifications match the job description. Only the highest-scoring resumes are forwarded to the hiring team for review.",
  },
  {
    question: "How do I know if my resume is ATS-friendly?",
    answer:
      "An ATS-friendly resume uses a clean, single-column layout with standard section headings like Work Experience, Education, and Skills. It avoids tables, text boxes, images, headers and footers, and non-standard fonts. The file should be a text-based PDF or Word document, not a designed or image-heavy file. You can test your resume by copying and pasting the text from your PDF. If the text comes out garbled or in the wrong order, it will likely fail ATS parsing as well.",
  },
  {
    question: "Do all companies use ATS software?",
    answer:
      "The vast majority do. Over 98 percent of Fortune 500 companies use an ATS, and the adoption rate among mid-size companies has grown significantly in recent years. Even many small businesses now use lightweight ATS platforms or built-in filtering tools on job boards like Indeed and LinkedIn. If you are applying to a job online, it is safe to assume your resume will go through some form of automated screening.",
  },
  {
    question: "What file format should I use for ATS submissions?",
    answer:
      "A text-based PDF is the safest choice for most ATS platforms. It preserves your formatting while keeping the text fully machine-readable. Some older ATS systems prefer Word documents (.docx), so if a job posting specifically requests a Word file, use that format instead. Avoid submitting image-based PDFs, Pages files, or any other non-standard format. Our builder exports clean, text-based PDFs that work with every major ATS.",
  },
  {
    question: "How important are keywords in an ATS resume?",
    answer:
      "Keywords are critical. The ATS scans your resume for specific terms that match the job description, including hard skills, software names, certifications, job titles, and industry terminology. If your resume lacks the right keywords, it will receive a low score and get filtered out even if you are highly qualified. The key is to incorporate relevant keywords naturally throughout your resume rather than stuffing them in unnaturally, which can also be flagged by more sophisticated ATS systems.",
  },
  {
    question: "Can I still have a well-designed resume that passes ATS?",
    answer:
      "Absolutely. ATS compatibility and visual appeal are not mutually exclusive. The key is using design elements that are both visually attractive and machine-readable. Clean typography, strategic use of whitespace, subtle color accents, and consistent formatting can create a professional, polished look without breaking ATS parsing. Our templates are specifically designed to achieve this balance, giving you a resume that looks great to recruiters and scores well with ATS software.",
  },
  {
    question: "Should I tailor my resume for every job application?",
    answer:
      "Yes, and this is one of the most effective things you can do to improve your ATS pass rate. Every job posting uses slightly different terminology and prioritizes different qualifications. Tailoring your resume to match the specific language and requirements of each job description significantly improves your keyword match score. Our keyword matching tool makes this process fast and straightforward by automatically identifying gaps between your resume and the target job posting.",
  },
  {
    question: "What mistakes cause resumes to fail ATS screening?",
    answer:
      "The most common mistakes include using tables or multi-column layouts that break the parsing order, embedding text in images or graphics, using non-standard section headings like 'Where I Have Been' instead of 'Work Experience,' placing important information in headers or footers that get ignored by many ATS parsers, using special characters or symbols that do not convert to plain text, and submitting resumes in incompatible file formats. Our builder eliminates all of these issues automatically.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ATSResumeBuilderPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---- Hero ---- */}
        <PageHero
          badge="ATS Resume Builder"
          heading={
            <>
              Build Resumes That Pass{" "}
              <span className="text-muted-foreground">Every ATS System</span>
            </>
          }
          description="Over 75% of resumes are rejected by Applicant Tracking Systems before a recruiter ever sees them. Our ATS resume builder creates clean, keyword-optimized resumes that pass automated screening and land on a hiring manager's desk."
          ctaLabel="Build My ATS Resume"
          ctaHref="/sign-up"
          secondaryCtaLabel="See how ATS works"
          secondaryCtaHref="#what-is-ats"
        />

        {/* ---- What is ATS ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="what-is-ats"
            ariaLabelledBy="what-is-ats-heading"
          >
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                id="what-is-ats-heading"
                badge="Understanding ATS"
                heading="What Is an Applicant Tracking System?"
                description="Before your resume reaches a human, it has to pass through software designed to filter candidates automatically."
              />
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  An Applicant Tracking System (ATS) is software that employers
                  use to manage their hiring pipeline. When you click
                  &ldquo;Apply&rdquo; on a job posting, your resume is uploaded
                  into the company&rsquo;s ATS, where it is parsed, analyzed,
                  and scored against the job requirements. Only the
                  highest-ranking resumes are forwarded to a recruiter for manual
                  review.
                </p>
                <p>
                  More than 98% of Fortune 500 companies and a rapidly growing
                  share of mid-size and small businesses rely on ATS platforms
                  like Workday, Greenhouse, Lever, iCIMS, and Taleo to manage
                  incoming applications. For job seekers, this means that
                  virtually every online application passes through automated
                  screening before it reaches a real person.
                </p>
                <p>
                  The problem is that most resume templates, including many sold
                  by popular design tools, are not built with ATS compatibility
                  in mind. Multi-column layouts, tables, images, icons, and
                  creative formatting can all cause parsing failures. When the
                  ATS cannot read your resume correctly, your qualifications are
                  lost, your score drops, and your application is silently
                  rejected. You never receive feedback, and you never know why
                  you didn&rsquo;t get a response.
                </p>
                <p>
                  <BrandName /> solves this problem at the source. Every resume
                  you create with our builder is engineered from the ground up to
                  be fully ATS-compatible, while still looking polished and
                  professional when a recruiter opens it on their screen.
                </p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- How ATS Filtering Works ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="default"
            id="how-ats-works"
            ariaLabelledBy="how-ats-works-heading"
          >
            <SectionHeader
              id="how-ats-works-heading"
              badge="The Process"
              heading="How ATS Filtering Works"
              description="Understanding the four stages every resume goes through helps you see exactly where things go wrong and how to fix them."
            />
            <motion.div
              className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {atsSteps.map((step, index) => (
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

        {/* ---- ATS Optimization Features (6 cards) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="ats-features"
            ariaLabelledBy="ats-features-heading"
          >
            <SectionHeader
              id="ats-features-heading"
              badge="Built for ATS"
              heading="Six Ways We Optimize Your Resume for ATS"
              description="Every resume created with our builder includes these ATS optimization features by default. No manual tweaking required."
            />
            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {optimizationFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
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
              heading="Tools Built Specifically for ATS Success"
              description="Go beyond basic formatting with intelligent tools that actively improve your chances of passing automated screening."
            />
            <div className="mt-14">
              <FeatureShowcase features={showcaseFeatures} />
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Comparison Section ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="comparison"
            ariaLabelledBy="comparison-heading"
          >
            <SectionHeader
              id="comparison-heading"
              badge="Before & After"
              heading="ATS-Unfriendly vs. ATS-Optimized"
              description="See the difference between a resume that gets filtered out and one that makes it through to a recruiter."
            />
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {/* Bad resume */}
              <motion.div
                className="rounded-2xl border border-border bg-white p-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      ATS-Unfriendly Resume
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Likely to be filtered out
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonItems
                    .filter((item) => item.bad)
                    .map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <XMarkIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                      </li>
                    ))}
                </ul>
              </motion.div>

              {/* Good resume */}
              <motion.div
                className="rounded-2xl border border-border bg-white p-8"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      ATS-Optimized Resume
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Built with <BrandName />
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonItems
                    .filter((item) => item.good)
                    .map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                      </li>
                    ))}
                </ul>
              </motion.div>
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
            background="default"
            id="stats"
            ariaLabelledBy="stats-heading"
          >
            <SectionHeader
              id="stats-heading"
              heading="100% ATS Compatible. Zero Guesswork."
              description="Our templates are built and tested to ensure your resume always makes it through automated screening."
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

        {/* ---- FAQ ---- */}
        <PageFAQ
          heading="ATS Resume Builder FAQ"
          description="Everything you need to know about building resumes that pass Applicant Tracking Systems."
          faqs={faqs}
          id="ats-faq"
        />

        {/* ---- CTA Banner ---- */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Stop Getting Filtered Out. Start Getting Interviews.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Every day you submit a resume that fails ATS screening is another
              missed opportunity. Build an ATS-optimized resume in minutes and
              put your application in front of real hiring managers.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Build My ATS Resume Now"
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
