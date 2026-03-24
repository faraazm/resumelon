"use client";

import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  UserIcon,
  DocumentCheckIcon,
  ArrowUpIcon,
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

const optimizationCards = [
  {
    icon: MagnifyingGlassIcon,
    title: "Keyword Alignment",
    description:
      "Our AI compares your resume against the target job description and identifies missing keywords, skills, and phrases that recruiters and ATS systems are scanning for. You get specific suggestions for where to add each term so it reads naturally and improves your match score.",
  },
  {
    icon: ListBulletIcon,
    title: "Bullet Point Quality",
    description:
      "Weak bullet points describe duties. Strong ones demonstrate impact. We analyze every bullet on your resume and rewrite vague statements into quantified, action-driven accomplishments that show hiring managers exactly what you achieved and how it mattered.",
  },
  {
    icon: ShieldCheckIcon,
    title: "ATS Formatting",
    description:
      "Even well-written resumes fail when the formatting breaks ATS parsing. We check your document structure for common issues like tables, multi-column layouts, embedded images, and non-standard headings, then fix them so every ATS can read your resume correctly.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Section Structure",
    description:
      "The order, naming, and organization of your resume sections affect both ATS scoring and recruiter readability. We evaluate your section hierarchy and recommend adjustments that put your strongest qualifications front and center for each specific role.",
  },
  {
    icon: DocumentTextIcon,
    title: "Content Relevance",
    description:
      "Not everything on your resume belongs on every application. We identify which experiences, skills, and details are most relevant to the target role and suggest what to emphasize, condense, or remove so your resume stays focused and impactful.",
  },
  {
    icon: UserIcon,
    title: "Professional Tone",
    description:
      "Inconsistent tone, passive voice, and informal language undermine your credibility. Our AI reviews the language across your entire resume and ensures a consistent, professional voice that conveys confidence and competence to hiring managers.",
  },
];

const howItWorksSteps = [
  {
    icon: DocumentTextIcon,
    title: "Upload Your Current Resume",
    description:
      "Import your existing resume in PDF or DOCX format. Our parser extracts all your content, preserving your work history, skills, education, and personal details so you do not have to re-enter anything manually.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Paste the Target Job",
    description:
      "Copy and paste the job description you want to apply for. Our AI reads every requirement, preferred qualification, and skill listed in the posting to understand exactly what the employer is looking for.",
  },
  {
    icon: ChartBarIcon,
    title: "Get Your Optimization Report",
    description:
      "Within seconds you receive a detailed analysis showing your current match score, missing keywords, weak bullet points, formatting issues, and section-by-section recommendations for improvement.",
  },
  {
    icon: ArrowPathIcon,
    title: "Apply Improvements",
    description:
      "Review each suggestion and apply improvements with a single click. Rewrite bullets, add keywords, restructure sections, and fix formatting issues directly in the editor. Download your optimized resume when you are satisfied.",
  },
];

const showcaseFeatures = [
  {
    title: "AI-Powered Keyword Analysis",
    description:
      "Paste any job description and our AI instantly maps every requirement against your resume. It identifies exact-match keywords you already have, related terms that could be strengthened, and critical gaps where you are missing important qualifications entirely. The analysis goes beyond simple word matching. It understands context, synonyms, and industry-specific terminology so that a resume listing project management is correctly matched against a job requiring program management or stakeholder coordination.",
    bullets: [
      "Contextual keyword matching that understands synonyms and related terms",
      "Gap analysis showing exactly which requirements your resume is missing",
      "Priority-ranked suggestions based on how important each keyword is to the role",
      "Natural integration recommendations so keywords read organically",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="ats-classic"
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
    title: "Bullet Point Rewriting Engine",
    description:
      "The difference between a resume that gets interviews and one that gets ignored often comes down to how your experience is presented. Our rewriting engine transforms generic responsibility descriptions into compelling, quantified achievement statements. It analyzes each bullet point for action verb strength, measurable outcomes, relevance to the target role, and overall impact. You can accept the rewrite as-is, modify it, or generate alternative versions until you find the perfect phrasing.",
    bullets: [
      "Transforms duty-based bullets into achievement-focused statements",
      "Adds quantified metrics and measurable outcomes where possible",
      "Strengthens action verbs to convey leadership and initiative",
      "Tailors phrasing to match the language used in the target job posting",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
        cards={[
          { templateId: "bold-modern", rotate: -6, x: -35, y: 10, delay: 0.1 },
          { templateId: "executive-navy", rotate: 3, x: 10, y: 0, delay: 0.24 },
        ]}
        badges={[
          { icon: SparklesIcon, label: "AI Rewrite", position: "top-left", delay: 0.6, variant: "teal" },
          { icon: ArrowUpIcon, label: "Impact +47%", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "Comprehensive ATS Scoring",
    description:
      "Before you submit your application, run your optimized resume through our ATS compatibility scanner. It evaluates your resume across every dimension that matters to automated screening systems: formatting compliance, keyword density and placement, section structure, date consistency, file readability, and overall content quality. You receive a score out of 100 along with a prioritized list of remaining issues. Most users reach a score above 90 within minutes of starting the optimization process.",
    bullets: [
      "Detailed ATS compatibility score with section-by-section breakdown",
      "Formatting checks for parsability across all major ATS platforms",
      "Keyword density analysis to avoid both under-optimization and keyword stuffing",
      "One-click fixes for common issues like missing dates or inconsistent formatting",
    ],
    visual: (
      <TemplateGrid
        type="resume"
        gradient="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
        templates={[
          { id: "minimal-clean", rotate: -2, x: -5, y: 4, delay: 0.1 },
          { id: "creative-bold", rotate: 2, x: 4, y: -2, delay: 0.2 },
          { id: "ats-classic", rotate: -1, x: -3, y: 2, delay: 0.3 },
          { id: "bold-modern", rotate: 3, x: 5, y: -4, delay: 0.4 },
        ]}
        badges={[
          { icon: ChartBarIcon, label: "Score: 97/100", position: "top-left", delay: 0.6, variant: "amber" },
          { icon: DocumentCheckIcon, label: "All Checks Passed", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
];

const beforeAfterExamples = [
  {
    before: "Responsible for managing a team and handling various projects",
    after: "Led a cross-functional team of 12 engineers, delivering 8 product launches on time and 15% under budget",
  },
  {
    before: "Helped increase sales for the company",
    after: "Drove $2.4M in new annual recurring revenue by redesigning the outbound sales process and training 6 account executives",
  },
  {
    before: "Worked on improving customer satisfaction",
    after: "Increased customer satisfaction scores from 72% to 94% by implementing a proactive support workflow and reducing average response time by 60%",
  },
  {
    before: "Did data analysis and made reports for management",
    after: "Built automated reporting dashboards in Tableau that reduced weekly reporting time by 8 hours and surfaced $340K in cost-saving opportunities",
  },
];

const faqs: FAQItem[] = [
  {
    question: "How is resume optimization different from building a new resume?",
    answer:
      "Resume optimization starts with your existing resume and improves it for a specific target role. Instead of creating content from scratch, our AI analyzes what you already have, identifies weaknesses, and provides targeted improvements. This preserves your authentic experience while ensuring your resume is keyword-optimized, well-formatted, and tailored to the job you want. It is significantly faster than starting over and produces better results because it builds on your real career history.",
  },
  {
    question: "Will the optimized resume still sound like me?",
    answer:
      "Yes. Our AI enhances your existing content rather than replacing it with generic language. Every suggestion maintains your voice and accurately represents your experience. You review and approve each change before it is applied, so you always have full control over the final result. The goal is to make your resume more effective, not to make it sound like it was written by a machine.",
  },
  {
    question: "How long does the optimization process take?",
    answer:
      "The initial analysis takes about 30 seconds after you upload your resume and paste the job description. From there, most users complete the full optimization process in 10 to 15 minutes. You can apply suggested improvements with a single click, and the real-time preview lets you see exactly how each change affects your resume before you finalize it.",
  },
  {
    question: "Can I optimize the same resume for multiple jobs?",
    answer:
      "Absolutely. In fact, we strongly recommend it. Every job posting uses different terminology and prioritizes different qualifications. You can duplicate your base resume and run the optimization process for each role you apply to. This ensures every application is specifically tailored to what that employer is looking for, dramatically improving your chances of passing ATS screening and impressing recruiters.",
  },
  {
    question: "What file formats can I upload for optimization?",
    answer:
      "You can upload your existing resume as a PDF or DOCX file. Our parser handles both formats and extracts all your content including text, section structure, dates, and formatting. If your resume is in another format like Google Docs or Pages, simply export it as a PDF first. After optimization, you can download your improved resume in both PDF and DOCX formats.",
  },
  {
    question: "How does the keyword matching work?",
    answer:
      "When you paste a job description, our AI breaks it down into individual requirements, skills, qualifications, and keywords. It then scans your resume for exact matches, partial matches, and semantically related terms. The system understands that project management, program management, and cross-functional leadership are related concepts, so it provides intelligent matching rather than simple word-for-word comparison. You receive a prioritized list of missing keywords with specific suggestions for where and how to add them.",
  },
  {
    question: "Will optimization help my resume pass ATS systems?",
    answer:
      "Yes, ATS optimization is a core part of the process. Beyond keyword matching, we check your resume for formatting issues that cause ATS parsing failures, including tables, multi-column layouts, embedded images, and non-standard section headings. Every resume you optimize through our platform is tested against the parsing requirements of major ATS platforms like Workday, Greenhouse, Lever, and iCIMS. You receive a compatibility score so you know exactly how your resume will perform.",
  },
  {
    question: "Is there a limit to how many times I can optimize my resume?",
    answer:
      "Free accounts can create and optimize one resume. Pro subscribers get unlimited resume creation and optimization, meaning you can run the optimization process as many times as you want for as many different job applications as you need. Given that tailoring your resume for each application is one of the most effective ways to increase your interview rate, unlimited optimization is one of the most valuable features of the Pro plan.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ResumeOptimizationPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---- Hero ---- */}
        <PageHero
          badge="Resume Optimization"
          heading={
            <>
              Optimize Your Existing Resume{" "}
              <span className="text-muted-foreground">with AI-Powered Analysis</span>
            </>
          }
          description="You already have a resume. The problem is not your experience, it is how your resume presents it. Our AI analyzes your resume against any job description and delivers specific improvements to keywords, bullet points, formatting, and structure so you get more interviews from the same experience."
          ctaLabel="Optimize My Resume"
          ctaHref="/sign-up"
          secondaryCtaLabel="See how it works"
          secondaryCtaHref="#how-it-works"
        />

        {/* ---- Why Optimization Matters ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="why-optimize"
            ariaLabelledBy="why-optimize-heading"
          >
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                id="why-optimize-heading"
                badge="Why It Matters"
                heading="A Good Resume Still Needs Optimization"
                description="Your resume might accurately represent your experience, but accuracy alone does not get you interviews. Every role requires a different version of your story."
              />
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Most job seekers write one resume and send it to every job they apply for. The
                  problem is that every job description uses different terminology, emphasizes
                  different skills, and prioritizes different qualifications. A resume that works
                  well for one role may score poorly for another, even if you are equally qualified
                  for both positions. Applicant Tracking Systems compare your resume directly
                  against the job posting, and a low keyword match score means your application
                  is filtered out before a recruiter ever reads it.
                </p>
                <p>
                  Beyond keywords, the way you describe your experience matters enormously.
                  Recruiters spend an average of six to eight seconds on an initial resume scan.
                  If your bullet points describe responsibilities instead of achievements, or if
                  your most relevant experience is buried below less important details, you lose
                  the reader before they reach the content that would convince them to call you.
                  Quantified accomplishments, strong action verbs, and role-specific phrasing are
                  the difference between a resume that gets a response and one that disappears
                  into the application void.
                </p>
                <p>
                  Resume optimization is not about fabricating experience or gaming the system. It
                  is about presenting your real qualifications in the most effective way possible
                  for each specific opportunity. With <BrandName />, you start with the resume you
                  already have and transform it into one that is precisely aligned with the role
                  you want, formatted for ATS compatibility, and written to capture recruiter
                  attention in those critical first seconds.
                </p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- What We Optimize (6 cards) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="default"
            id="what-we-optimize"
            ariaLabelledBy="what-we-optimize-heading"
          >
            <SectionHeader
              id="what-we-optimize-heading"
              badge="What We Optimize"
              heading="Six Dimensions of Resume Improvement"
              description="Every optimization covers these six critical areas to ensure your resume performs at its best for both ATS systems and human reviewers."
            />
            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {optimizationCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <card.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </SectionWrapper>
        </motion.div>

        {/* ---- How It Works (4 steps) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="how-it-works"
            ariaLabelledBy="how-it-works-heading"
          >
            <SectionHeader
              id="how-it-works-heading"
              badge="The Process"
              heading="How Resume Optimization Works"
              description="Go from an unoptimized resume to a tailored, ATS-ready application in four straightforward steps."
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

        {/* ---- Feature Showcase (3 alternating blocks) ---- */}
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
              heading="Powerful Tools to Transform Your Resume"
              description="Go beyond surface-level edits with intelligent tools that analyze, rewrite, and optimize every aspect of your resume."
            />
            <div className="mt-14">
              <FeatureShowcase features={showcaseFeatures} />
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Before vs After ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="before-after"
            ariaLabelledBy="before-after-heading"
          >
            <SectionHeader
              id="before-after-heading"
              badge="Before & After"
              heading="See the Difference Optimization Makes"
              description="Real examples of how our AI transforms weak, generic bullet points into compelling, quantified achievement statements."
            />
            <div className="mt-14 space-y-6">
              {beforeAfterExamples.map((example, index) => (
                <motion.div
                  key={index}
                  className="grid gap-4 md:grid-cols-2"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  {/* Before */}
                  <div className="rounded-2xl border border-border bg-white p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50">
                        <span className="text-xs font-semibold text-red-500">B</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Before</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      &ldquo;{example.before}&rdquo;
                    </p>
                  </div>
                  {/* After */}
                  <div className="rounded-2xl border border-border bg-white p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                        <span className="text-xs font-semibold text-emerald-600">A</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">After</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      &ldquo;{example.after}&rdquo;
                    </p>
                  </div>
                </motion.div>
              ))}
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
          heading="Resume Optimization FAQ"
          description="Everything you need to know about optimizing your resume for better results."
          faqs={faqs}
          id="optimization-faq"
        />

        {/* ---- CTA Banner ---- */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Your Resume Deserves Better Results. Start Optimizing Today.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Every application you send with an unoptimized resume is a missed chance at an
              interview. Upload your resume, paste a job description, and get actionable
              improvements in minutes.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Optimize My Resume Now"
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
