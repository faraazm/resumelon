"use client";

import { motion } from "framer-motion";
import {
  ClipboardDocumentIcon,
  SparklesIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
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
  FannedDocuments,
  TemplateGrid,
  SingleDocument,
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

const steps = [
  {
    icon: ClipboardDocumentIcon,
    title: "Paste the Job Description",
    description:
      "Copy the full job listing from any job board or company career page and paste it directly into our builder. The AI reads the entire posting, including responsibilities, qualifications, preferred skills, and company-specific language, so nothing important is overlooked.",
  },
  {
    icon: SparklesIcon,
    title: "AI Extracts Key Requirements",
    description:
      "Our engine parses the job description and identifies the critical requirements: hard skills, soft skills, certifications, tools, years of experience, and industry terminology. It builds a structured profile of exactly what the employer is looking for in an ideal candidate.",
  },
  {
    icon: PencilSquareIcon,
    title: "Your Resume Is Generated",
    description:
      "Using the extracted requirements and your existing experience, the AI drafts a complete, ready-to-submit resume. It rewrites your bullet points to highlight the most relevant accomplishments, weaves in the right keywords, and organizes sections to match what the hiring manager expects to see.",
  },
  {
    icon: ArrowDownTrayIcon,
    title: "Review, Refine, and Download",
    description:
      "Preview your tailored resume in real time, make any adjustments you want using our visual editor, and export a clean, ATS-optimized PDF or DOCX. Every document is formatted to pass automated screening systems and look polished when a recruiter opens it.",
  },
];

const benefits = [
  {
    icon: ClockIcon,
    title: "Save Hours of Manual Tailoring",
    description:
      "Customizing a resume for every application can take 30 to 60 minutes per job. Our AI does it in under two minutes, letting you apply to more positions in less time without sacrificing quality or relevance.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Never Miss a Critical Keyword",
    description:
      "ATS systems scan for specific terms from the job description. Our AI identifies every required keyword and weaves them naturally into your resume, so your application scores high on relevance and passes automated filters.",
  },
  {
    icon: BoltIcon,
    title: "Highlight Your Strongest Match",
    description:
      "The AI analyzes which parts of your experience align most closely with the job requirements and brings those front and center. Your most relevant accomplishments, skills, and qualifications are positioned where recruiters look first.",
  },
  {
    icon: ShieldCheckIcon,
    title: "ATS-Optimized by Default",
    description:
      "Every resume is built on clean, single-column templates that pass Workday, Greenhouse, Lever, iCIMS, and every other major ATS. Machine-readable text, standard section headings, and proper formatting are guaranteed.",
  },
  {
    icon: DocumentDuplicateIcon,
    title: "One Profile, Unlimited Versions",
    description:
      "Enter your experience once and generate a unique, tailored resume for every application. Each version is saved separately so you can track which resume you sent to which company and iterate based on results.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Full Control Over the Final Result",
    description:
      "The AI gives you a strong starting point, but you stay in charge. Edit any section, rewrite bullet points, adjust formatting, change templates, and customize colors and fonts until the resume is exactly what you want.",
  },
];

const showcaseFeatures = [
  {
    title: "Intelligent Job Description Analysis",
    description:
      "Our AI does more than scan for keywords. It understands the structure and intent of the job posting, identifying must-have qualifications versus nice-to-haves, required technical skills versus soft skills, and explicit requirements versus implied expectations. This deep analysis ensures your resume addresses what the employer actually cares about, not just surface-level keyword matching that modern ATS systems can see through.",
    bullets: [
      "Separates required qualifications from preferred qualifications",
      "Identifies industry-specific terminology and certifications",
      "Detects implied skills from responsibility descriptions",
      "Prioritizes requirements by emphasis and placement in the listing",
    ],
    visual: (
      <TemplateGrid
        type="resume"
        gradient="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50"
        templates={[
          { id: "minimal-clean", rotate: -2, x: -5, y: 4, delay: 0.1 },
          { id: "executive-navy", rotate: 2, x: 4, y: -2, delay: 0.2 },
          { id: "ats-classic", rotate: -1, x: -3, y: 2, delay: 0.3 },
          { id: "bold-modern", rotate: 3, x: 5, y: -4, delay: 0.4 },
        ]}
        badges={[
          { icon: SparklesIcon, label: "AI-Analyzed", position: "top-left", delay: 0.6, variant: "blue" },
          { icon: CheckCircleIcon, label: "Requirements Matched", position: "bottom-right", delay: 0.75, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "Context-Aware Bullet Point Rewriting",
    description:
      "Generic bullet points like 'managed a team' or 'improved processes' do not stand out in a competitive applicant pool. Our AI takes your raw experience and rewrites each bullet point to directly mirror the language, metrics, and priorities found in the target job description. The result is a resume that reads as though it was written specifically for the role, because it was. Recruiters immediately see the connection between your background and their open position.",
    bullets: [
      "Rewrites accomplishments using the employer's own terminology",
      "Adds quantified results and metrics where applicable",
      "Matches the tone and seniority level of the job posting",
      "Preserves your authentic experience while maximizing relevance",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="bold-modern"
        gradient="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
        rotate={-3}
        badges={[
          { icon: PencilSquareIcon, label: "AI Rewritten", position: "top-right", delay: 0.6, variant: "accent" },
          { icon: ChartBarIcon, label: "Relevance: 97%", position: "bottom-left", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "Real-Time Match Scoring and Feedback",
    description:
      "Before you submit your application, see exactly how well your resume matches the target job description. Our scoring engine evaluates keyword coverage, skills alignment, experience relevance, and formatting compliance to give you a clear, actionable match score. If there are gaps, the system tells you exactly what to add or change. You go into every application knowing your resume is optimized for that specific role.",
    bullets: [
      "Instant match score comparing your resume to the job posting",
      "Gap analysis showing missing skills and keywords",
      "One-click suggestions to close identified gaps",
      "Section-by-section breakdown of alignment strength",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50"
        cards={[
          { templateId: "creative-bold", rotate: -6, x: -35, y: 10, delay: 0.1 },
          { templateId: "executive-navy", rotate: 3, x: 10, y: 0, delay: 0.24 },
        ]}
        badges={[
          { icon: ChartBarIcon, label: "Match: 96/100", position: "top-left", delay: 0.6, variant: "rose" },
          { icon: DocumentCheckIcon, label: "Gaps Resolved", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
];

const comparisonItems = {
  without: [
    "Spend 30-60 minutes rewriting for each application",
    "Guess which keywords and skills to emphasize",
    "Miss critical requirements buried in the listing",
    "Submit a generic resume and hope for the best",
    "Get filtered out by ATS with no feedback",
    "No way to know if your resume matches the role",
  ],
  with: [
    "Generate a tailored resume in under two minutes",
    "AI extracts and matches every required keyword",
    "Every qualification in the posting is addressed",
    "Submit a resume purpose-built for the specific job",
    "ATS-optimized formatting passes automated screening",
    "Match score shows exactly how well you align",
  ],
};

const faqs: FAQItem[] = [
  {
    question: "How does the resume builder use a job description to create my resume?",
    answer:
      "When you paste a job description, our AI parses the entire listing to identify required skills, qualifications, responsibilities, preferred experience, and industry-specific terminology. It then cross-references these requirements against your profile and generates a complete resume that highlights your most relevant experience, uses the right keywords in the right context, and organizes your sections to match what the employer is looking for. The result is a resume that reads as though it was written specifically for that role.",
  },
  {
    question: "Do I need to have an existing resume to get started?",
    answer:
      "No. You can start from scratch by entering your work history, education, and skills directly into our builder. The AI will use whatever information you provide, combined with the job description, to generate a tailored resume. If you do have an existing resume, you can import it by uploading a PDF or Word document, and the AI will restructure and rewrite it to match the target job posting.",
  },
  {
    question: "How accurate is the AI at matching my experience to a job description?",
    answer:
      "Our AI is trained to understand the nuances of job postings across hundreds of industries and roles. It does not simply match keywords word-for-word. It understands that 'project management' and 'leading cross-functional initiatives' refer to similar competencies, and it can infer transferable skills from your existing experience. That said, the AI works best when you provide detailed information about your background, so the more complete your profile, the more accurate the match.",
  },
  {
    question: "Can I generate different resumes for different job descriptions?",
    answer:
      "Absolutely. This is exactly what the tool is designed for. You enter your experience once, and then you can paste any number of different job descriptions to generate a unique, tailored resume for each application. Every version is saved separately in your dashboard, so you always know which resume you submitted to which company and can track your results over time.",
  },
  {
    question: "Will the generated resume pass ATS screening systems?",
    answer:
      "Yes. Every resume generated by our builder uses ATS-compatible templates with clean single-column layouts, standard section headings, machine-readable text, and proper formatting. We test our templates against the most widely used ATS platforms including Workday, Greenhouse, Lever, iCIMS, and Taleo. The keyword optimization from the job description analysis further ensures your resume scores high on relevance when the ATS evaluates it.",
  },
  {
    question: "How long does it take to generate a resume from a job description?",
    answer:
      "The AI generates a complete, tailored resume in under two minutes after you paste the job description. You can then spend as much or as little time as you want reviewing and refining the result using our visual editor. Most users have a final, polished resume ready to submit within five to ten minutes total, compared to the 30 to 60 minutes it typically takes to tailor a resume manually.",
  },
  {
    question: "Can I edit the resume after the AI generates it?",
    answer:
      "Yes, you have complete control over the final document. The AI gives you a strong, targeted starting point, but you can edit every section, rewrite bullet points, add or remove content, change the template, adjust colors and fonts, and modify spacing. The live preview updates in real time as you make changes, so you always see exactly what the recruiter will see.",
  },
  {
    question: "Is there a limit to how many resumes I can generate?",
    answer:
      "Free accounts can generate up to five resumes per month, which is enough to test the tool and apply to a handful of positions. Pro subscribers get unlimited resume generation, along with access to all premium templates, AI rewriting, resume scoring, and export options. If you are actively job searching and applying to multiple positions each week, the Pro plan gives you everything you need without restrictions.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ResumeBuilderFromJobDescriptionPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---- Hero ---- */}
        <PageHero
          badge="Resume Builder"
          heading={
            <>
              Build a Tailored Resume{" "}
              <span className="text-muted-foreground">
                Directly from Any Job Description
              </span>
            </>
          }
          description="Stop sending the same generic resume to every job. Paste any job description and our AI creates a perfectly matched, ATS-optimized resume that highlights exactly what the employer is looking for. Ready in minutes, not hours."
          ctaLabel="Build My Resume Now"
          ctaHref="/sign-up"
          secondaryCtaLabel="See how it works"
          secondaryCtaHref="#how-it-works"
        />

        {/* ---- Problem Section ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="the-problem"
            ariaLabelledBy="the-problem-heading"
          >
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                id="the-problem-heading"
                badge="The Problem"
                heading="Why Generic Resumes Get Ignored"
                description="Sending the same resume to every job posting is one of the most common reasons qualified candidates never hear back."
              />
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Every job description is different. Even similar roles at
                  different companies use different terminology, prioritize
                  different skills, and expect different qualifications. When you
                  submit a generic, one-size-fits-all resume, the Applicant
                  Tracking System compares your document against the specific
                  requirements of that particular job posting. If the keywords
                  don&rsquo;t match, your resume scores low and gets filtered
                  out before a human ever reads it.
                </p>
                <p>
                  The solution is obvious: tailor your resume for every
                  application. But doing it manually is exhausting. Reading
                  through the job description, identifying the key requirements,
                  rewriting your bullet points, reorganizing sections, and
                  double-checking keyword coverage takes 30 to 60 minutes per
                  application. Multiply that by dozens of applications and you
                  are spending more time reformatting than actually applying.
                </p>
                <p>
                  That is the gap <BrandName /> fills. Our AI reads the job
                  description for you, identifies exactly what the employer wants
                  to see, and generates a complete, tailored resume that matches
                  the role. You get a resume that is targeted, keyword-optimized,
                  and ATS-ready in under two minutes instead of an hour.
                </p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- How It Works ---- */}
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
              heading="From Job Posting to Polished Resume in Four Steps"
              description="Our AI handles the heavy lifting so you can focus on applying to more jobs and landing interviews."
            />
            <motion.div
              className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {steps.map((step, index) => (
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

        {/* ---- Benefits Grid ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="benefits"
            ariaLabelledBy="benefits-heading"
          >
            <SectionHeader
              id="benefits-heading"
              badge="Why It Works"
              heading="Six Reasons to Build Your Resume from the Job Description"
              description="A targeted resume outperforms a generic one in every measurable way. Here is what you gain."
            />
            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
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
            </motion.div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Feature Showcase ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="default"
            id="features"
            ariaLabelledBy="features-heading"
          >
            <SectionHeader
              id="features-heading"
              badge="Key Features"
              heading="Intelligent Tools That Match You to the Job"
              description="Go beyond basic keyword matching with AI that understands what employers actually want."
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
              badge="The Difference"
              heading="Without vs. With Job Description Matching"
              description="See how a targeted, AI-generated resume compares to the manual approach most job seekers still rely on."
            />
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {/* Without */}
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
                      Without Job Description Matching
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Generic resume, generic results
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonItems.without.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XMarkIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* With */}
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
                      With <BrandName /> AI Matching
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tailored resume, targeted results
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonItems.with.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
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
          heading="Resume Builder from Job Description FAQ"
          description="Common questions about building tailored resumes from job descriptions with AI."
          faqs={faqs}
          id="faq"
        />

        {/* ---- CTA Banner ---- */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Your Next Resume Should Be Built for the Job You Want
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Every generic resume you send is a missed opportunity. Paste the
              job description, let our AI build a targeted resume, and start
              getting responses from the companies you actually want to work
              for.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Build My Tailored Resume"
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
