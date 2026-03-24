"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  BoltIcon,
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
  StackedDocuments,
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
    icon: DocumentTextIcon,
    title: "Upload Your Base Resume",
    description:
      "Start by uploading your existing resume or selecting one you have already built in the dashboard. This becomes your master document containing your complete work history, skills, education, and accomplishments. You only need to create it once, and it serves as the foundation for every tailored version you generate going forward.",
  },
  {
    icon: ClipboardDocumentListIcon,
    title: "Paste the Job Description",
    description:
      "Copy and paste the full job posting for the role you are applying to. Our system reads the entire description and extracts the key requirements, preferred qualifications, required skills, industry terminology, and specific phrasing that the employer uses. This step takes just a few seconds and gives the AI everything it needs to customize your resume.",
  },
  {
    icon: SparklesIcon,
    title: "AI Tailors Your Content",
    description:
      "The AI compares your resume against the job description and rewrites your summary, bullet points, and skills section to align with what the employer is looking for. It incorporates missing keywords, adjusts the emphasis of your experience, and refines the language to match the tone and terminology of the posting. Every change is natural and professional.",
  },
  {
    icon: ArrowDownTrayIcon,
    title: "Review, Download & Apply",
    description:
      "Preview the tailored resume side by side with the original so you can see exactly what changed. Make any final edits, then export as a clean, ATS-compatible PDF ready to submit. The entire process from pasting a job description to downloading a finished resume takes less than five minutes.",
  },
];

const benefits = [
  {
    icon: MagnifyingGlassIcon,
    title: "Intelligent Keyword Matching",
    description:
      "The AI identifies the exact keywords, skills, and qualifications from the job description and weaves them into your resume naturally. No awkward keyword stuffing. Every term is placed in the right context so your resume reads well to both ATS software and human recruiters reviewing it afterward.",
  },
  {
    icon: ShieldCheckIcon,
    title: "ATS Optimization Built In",
    description:
      "Every tailored resume maintains a clean, single-column format with standard section headings and machine-readable text. Your customized content never breaks ATS compatibility. The formatting is tested against major platforms including Workday, Greenhouse, Lever, and iCIMS to ensure a high parse rate every time.",
  },
  {
    icon: ClockIcon,
    title: "Save Hours Per Application",
    description:
      "Manually rewriting a resume for each job takes thirty minutes to an hour. Our tailoring tool does it in under five minutes. That means you can apply to more positions with genuinely customized resumes instead of blasting the same generic document to every opening and hoping for the best.",
  },
  {
    icon: PencilSquareIcon,
    title: "Personalized Content Rewrites",
    description:
      "The AI does not just swap out a few words. It rewrites your professional summary to speak directly to the role, adjusts bullet points to emphasize the most relevant accomplishments, and reorders your skills to put the most important ones first. Each version feels like it was written specifically for that job because it was.",
  },
  {
    icon: UserIcon,
    title: "Professional Tone & Language",
    description:
      "Every rewrite maintains a consistent, professional tone that matches the standard expectations of your industry. Whether you are applying for a technical engineering role, a creative marketing position, or an executive leadership opportunity, the language adapts to fit while keeping your authentic voice intact.",
  },
  {
    icon: DocumentDuplicateIcon,
    title: "Multiple Export Formats",
    description:
      "Download your tailored resume as a text-based PDF optimized for ATS submission, or export as a DOCX file if the employer specifically requests a Word document. Both formats preserve your formatting and keep the content fully machine-readable so nothing is lost during the application process.",
  },
];

const showcaseFeatures = [
  {
    title: "Side-by-Side Job Match Analysis",
    description:
      "Before any changes are made, the AI runs a comprehensive gap analysis between your resume and the target job description. It identifies which required qualifications you already address, which ones are missing entirely, and which are present but could be strengthened with better phrasing or more specific detail. This analysis drives every recommendation and rewrite, ensuring that the tailored version covers all the bases the employer cares about most.",
    bullets: [
      "Automatic extraction of required and preferred qualifications from the posting",
      "Visual gap analysis showing matched, missing, and weak areas",
      "Priority ranking of the most important keywords for each specific role",
      "Actionable suggestions you can accept or modify before finalizing",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50"
        cards={[
          { templateId: "ats-classic", rotate: -6, x: -35, y: 10, delay: 0.1 },
          { templateId: "executive-navy", rotate: 3, x: 10, y: 0, delay: 0.24 },
        ]}
        badges={[
          { icon: MagnifyingGlassIcon, label: "Gap Analysis", position: "top-left", delay: 0.6, variant: "blue" },
          { icon: ChartBarIcon, label: "Match: 94%", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "AI-Powered Bullet Point Rewrites",
    description:
      "Generic bullet points are the fastest way to lose a recruiter's attention. Our AI rewrites each accomplishment to highlight the specific skills and outcomes the employer is looking for. It pulls language directly from the job description and mirrors it in your experience section so that ATS scanners see an immediate match. The result is a set of bullet points that feel tailored and intentional rather than copied and pasted from a generic template.",
    bullets: [
      "Rewrites accomplishments using terminology from the job posting",
      "Emphasizes metrics and outcomes that align with role expectations",
      "Maintains your authentic experience while sharpening the focus",
      "Supports bulk rewriting across all positions or targeted edits per role",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="bold-modern"
        gradient="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
        rotate={-3}
        badges={[
          { icon: SparklesIcon, label: "AI Rewritten", position: "top-right", delay: 0.6, variant: "success" },
          { icon: BoltIcon, label: "Optimized", position: "bottom-left", delay: 0.8, variant: "amber" },
        ]}
      />
    ),
  },
  {
    title: "Version Control for Every Application",
    description:
      "Every tailored resume is saved as a separate version linked to the job you created it for. This means you can track exactly which version you sent to each employer, revisit past applications, and refine your approach over time based on what gets results. No more digging through folders trying to remember which file you sent where. Your entire application history is organized in one place with the original job description attached to each version for easy reference.",
    bullets: [
      "Automatic versioning tied to specific job descriptions",
      "Side-by-side comparison between any two versions of your resume",
      "One-click duplication to create a new tailored version from any existing one",
      "Full history of changes so you can see what was modified for each application",
    ],
    visual: (
      <StackedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
        cards={[
          { templateId: "minimal-clean", rotate: 4, x: 20, y: 8, delay: 0.1 },
          { templateId: "creative-bold", rotate: -3, x: -15, y: -5, delay: 0.28 },
        ]}
        badges={[
          { icon: DocumentDuplicateIcon, label: "3 Versions", position: "top-left", delay: 0.6, variant: "amber" },
          { icon: AdjustmentsHorizontalIcon, label: "Compare", position: "bottom-right", delay: 0.8 },
        ]}
      />
    ),
  },
];

const faqs: FAQItem[] = [
  {
    question: "What does it mean to tailor a resume?",
    answer:
      "Tailoring a resume means customizing the content of your resume to match a specific job description. Instead of sending the same generic resume to every employer, you adjust your professional summary, reorder and rewrite your bullet points, and update your skills section to emphasize the qualifications that matter most for each particular role. This process significantly improves your chances of getting past ATS filters and catching a recruiter's attention because your resume directly addresses what the employer is looking for.",
  },
  {
    question: "Why should I tailor my resume for every job application?",
    answer:
      "Every job posting has different requirements, even for similar roles at different companies. The specific keywords, skills, and qualifications that one employer prioritizes may differ from another. ATS software scans for these specific terms, and a generic resume will miss many of them. Studies show that tailored resumes are up to three times more likely to result in an interview compared to generic ones. It is the single most effective thing you can do to improve your response rate.",
  },
  {
    question: "How does the AI tailor my resume?",
    answer:
      "The AI reads both your existing resume and the target job description. It identifies the required skills, preferred qualifications, and key terminology from the posting, then compares them against your current resume content. It rewrites your professional summary to address the role directly, adjusts bullet points to highlight your most relevant accomplishments, incorporates missing keywords in natural contexts, and reorders your skills to put the most important ones first. Every change is designed to sound professional and authentic.",
  },
  {
    question: "Will the tailored resume still sound like me?",
    answer:
      "Yes. The AI uses your existing experience and accomplishments as the foundation for every rewrite. It does not fabricate new experience or add skills you do not have. Instead, it reframes and rephrases what you have already done to better align with the language and priorities of the job posting. The tone remains professional and consistent with your original resume. You also have full control to review and edit every change before downloading.",
  },
  {
    question: "How long does it take to tailor a resume?",
    answer:
      "The entire process takes less than five minutes from start to finish. You paste the job description, the AI generates a tailored version in about thirty seconds, and then you review the changes and download. Compare that to the thirty minutes to an hour it typically takes to manually rewrite a resume for each application. Over the course of a job search with dozens of applications, that time savings adds up to days of work.",
  },
  {
    question: "Can I tailor my resume for different industries?",
    answer:
      "Absolutely. The AI adapts its recommendations based on the specific job description you provide, regardless of industry. Whether you are applying for roles in technology, healthcare, finance, marketing, education, or any other field, it adjusts the terminology, tone, and emphasis to match that industry's expectations. If you are making a career change, it is especially helpful at translating your existing experience into language that resonates with a new industry.",
  },
  {
    question: "Does tailoring my resume affect ATS compatibility?",
    answer:
      "Tailoring actually improves ATS compatibility. ATS software scores your resume based on how well your content matches the job description. A tailored resume that includes the right keywords and qualifications will receive a significantly higher match score than a generic one. Our builder ensures that all tailored versions maintain clean formatting and standard structure so the ATS can parse every section correctly while benefiting from the improved keyword alignment.",
  },
  {
    question: "How many tailored versions can I create?",
    answer:
      "With a Pro subscription, you can create unlimited tailored versions of your resume. Each version is saved separately and linked to the job description you created it for, so your application history stays organized. You can also duplicate any existing tailored version as a starting point for a new application, which is useful when applying to similar roles where only minor adjustments are needed between versions.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ResumeTailoringPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---- Hero ---- */}
        <PageHero
          badge="Resume Tailoring"
          heading={
            <>
              Tailor Your Resume for{" "}
              <span className="text-muted-foreground">Every Job You Apply To</span>
            </>
          }
          description="Sending the same resume to every employer is the fastest way to get ignored. Our AI reads the job description, identifies what the employer wants, and rewrites your resume to match. More relevant keywords, stronger alignment, and a higher ATS score in under five minutes."
          ctaLabel="Start Tailoring My Resume"
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
            id="why-tailor"
            ariaLabelledBy="why-tailor-heading"
          >
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                id="why-tailor-heading"
                badge="The Problem"
                heading="Why Generic Resumes Do Not Work Anymore"
                description="The job market has changed. Automated screening systems and overwhelmed recruiters mean your resume has to earn attention in seconds."
              />
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Over 75% of resumes are rejected by Applicant Tracking Systems
                  before a human being ever reads them. These systems scan for
                  specific keywords, skills, and qualifications that match the
                  job description. A resume that was written for a general
                  audience will almost always score lower than one that speaks
                  directly to the requirements of the specific role.
                </p>
                <p>
                  Even when your resume does reach a recruiter, they spend an
                  average of just six to seven seconds on an initial scan.
                  If your most relevant qualifications are not immediately
                  visible and clearly aligned with the job, your application
                  goes into the rejection pile. Recruiters are not going to
                  read between the lines or infer that your experience is
                  transferable. Your resume has to make the case explicitly.
                </p>
                <p>
                  The solution is straightforward but time-consuming when done
                  manually: customize your resume for every single application.
                  Rewrite your summary to address the role, adjust your bullet
                  points to emphasize the most relevant accomplishments, update
                  your skills list to match what the employer asked for, and
                  mirror the terminology used in the posting. <BrandName />{" "}
                  automates this entire process so you get a perfectly tailored
                  resume in minutes instead of hours.
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
              heading="Four Steps to a Perfectly Tailored Resume"
              description="Go from a generic resume to a job-specific one in under five minutes. No writing experience required."
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

        {/* ---- Benefits Grid (6 cards) ---- */}
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
              badge="Benefits"
              heading="Why Tailored Resumes Get More Interviews"
              description="Every feature is designed to help you stand out from the competition and get past the filters that block generic applications."
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
            id="features"
            ariaLabelledBy="features-heading"
          >
            <SectionHeader
              id="features-heading"
              badge="Key Features"
              heading="Powerful Tools for Smarter Job Applications"
              description="Go beyond surface-level changes with intelligent features that make every version of your resume stronger than the last."
            />
            <div className="mt-14">
              <FeatureShowcase features={showcaseFeatures} />
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
          heading="Resume Tailoring FAQ"
          description="Common questions about tailoring your resume for specific job applications and how our AI-powered tool works."
          faqs={faqs}
          id="tailoring-faq"
        />

        {/* ---- CTA Banner ---- */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Stop Sending Generic Resumes. Start Landing Interviews.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Every application you submit with an untailored resume is a missed
              opportunity. Customize your resume for the job in under five
              minutes and give yourself the best possible chance of getting a
              callback.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Start Tailoring My Resume"
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
