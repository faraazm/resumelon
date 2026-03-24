"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  BriefcaseIcon,
  SparklesIcon,
  PencilSquareIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterTextIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { SectionHeader } from "@/components/marketing/section-header";
import { InlineCTA } from "@/components/marketing/inline-cta";
import { PageHero } from "@/components/marketing/page-hero";
import { PageFAQ } from "@/components/marketing/page-faq";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { BrandName } from "@/components/marketing/logo";
import { StackedDocuments, SingleDocument, FannedDocuments } from "@/components/marketing/template-visuals";
import { PricingPreview } from "@/components/marketing/pricing-preview";

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

const howItWorksSteps = [
  {
    icon: DocumentTextIcon,
    title: "Pull From Your Resume",
    description:
      "Our AI reads your existing resume to understand your experience, skills, and accomplishments. No need to retype anything — your professional history is already captured.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Analyze the Job Description",
    description:
      "Paste the job listing and our engine identifies the key requirements, preferred qualifications, and company language so your cover letter speaks directly to what hiring managers care about.",
  },
  {
    icon: SparklesIcon,
    title: "Generate a Tailored Letter",
    description:
      "In seconds, you receive a complete cover letter that maps your background to the role. The AI highlights relevant accomplishments, mirrors the job posting's terminology, and follows a proven structure.",
  },
  {
    icon: PencilSquareIcon,
    title: "Customize and Send",
    description:
      "Fine-tune the tone, adjust paragraphs, or add personal anecdotes. Export as PDF or copy the text directly into any application portal. Your letter is ready to submit.",
  },
];

const benefits = [
  {
    icon: UserGroupIcon,
    title: "Deeply Personalized",
    description:
      "Every letter is written from scratch based on your unique resume and the specific job you are targeting. No generic templates. No recycled paragraphs. Each sentence reflects your real experience and the employer's stated needs, making every application feel hand-crafted.",
  },
  {
    icon: ClockIcon,
    title: "Ready in Under 60 Seconds",
    description:
      "What used to take 45 minutes to an hour now takes less than a minute. Paste a job description, click generate, and you have a polished first draft before your coffee gets cold. Spend your time applying to more roles instead of agonizing over opening lines.",
  },
  {
    icon: DocumentDuplicateIcon,
    title: "Complements Your Resume",
    description:
      "Because the generator reads your resume directly, your cover letter and resume tell a coherent story. Key accomplishments are echoed, not duplicated. The letter adds context and motivation that a resume alone cannot convey, giving recruiters the full picture.",
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: "Professional Tone",
    description:
      "The AI produces confident, clear prose that avoids cliches and filler. It adapts tone based on the industry — formal for finance and law, conversational for startups and creative roles — so you always sound like someone who belongs in the room.",
  },
  {
    icon: KeyIcon,
    title: "Keyword-Rich for ATS",
    description:
      "Many companies filter applications through Applicant Tracking Systems before a human ever reads them. Our generator mirrors the exact keywords and phrases from the job posting, increasing the chance your application clears automated screening and lands on a recruiter's desk.",
  },
  {
    icon: ArrowPathIcon,
    title: "Multiple Formats",
    description:
      "Export your finished cover letter as a clean PDF that matches your resume's styling, or copy the plain text for online application forms. Whether the employer wants an attachment or an inline paste, you are covered with a single click.",
  },
];

const showcaseFeatures = [
  {
    title: "AI-Powered Personalization That Actually Sounds Like You",
    description:
      "Generic cover letters get ignored. Our AI goes beyond simple mail-merge tricks. It analyzes the full context of your career trajectory, identifies the accomplishments most relevant to each role, and weaves them into a narrative that reads naturally. The result is a letter that feels authentically yours — because it is built from your real experience.",
    bullets: [
      "Matches your writing style and career narrative",
      "Highlights the most relevant accomplishments for each role",
      "Adapts tone for different industries and seniority levels",
      "Avoids generic phrases like 'team player' and 'hard worker'",
    ],
    visual: (
      <SingleDocument
        type="cover-letter"
        templateId="elegant-serif"
        gradient="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50"
        rotate={3}
        badges={[
          { icon: SparklesIcon, label: "AI Personalized", position: "top-left", delay: 0.6, variant: "teal" },
          { icon: ChatBubbleBottomCenterTextIcon, label: "Natural Tone", position: "bottom-right", delay: 0.8 },
        ]}
      />
    ),
  },
  {
    title: "Seamless Resume Integration",
    description:
      "Your cover letter should extend your resume, not repeat it. Because our generator reads directly from your saved resume, it knows exactly what you have already listed. It selects complementary details — the story behind a metric, the motivation for a career move — and presents them in a way that adds depth without redundancy.",
    bullets: [
      "Automatically pulls data from your saved resume",
      "Avoids duplicating bullet points verbatim",
      "Adds narrative context to key achievements",
      "Keeps formatting consistent across both documents",
    ],
    visual: (
      <StackedDocuments
        type="cover-letter"
        gradient="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
        sparkleColor="text-amber-500"
        cards={[
          { templateId: "ats-classic", rotate: 5, x: 25, y: 8, delay: 0.1 },
          { templateId: "bold-modern", rotate: -3, x: -15, y: -5, delay: 0.28 },
        ]}
        badges={[
          { icon: DocumentTextIcon, label: "Auto-Synced", position: "top-right", delay: 0.7, variant: "amber" },
          { icon: ArrowPathIcon, label: "Always Updated", position: "bottom-left", delay: 0.85, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "One-Click Generation, Unlimited Revisions",
    description:
      "Generating the first draft is just the beginning. Regenerate individual paragraphs, adjust the overall length, or shift the emphasis from leadership skills to technical expertise — all without starting over. Each revision preserves the core structure while refining the content, so you converge on the perfect letter faster.",
    bullets: [
      "Regenerate specific paragraphs without losing the rest",
      "Adjust length from concise to comprehensive",
      "Shift emphasis between skills, experience, and motivation",
      "Version history so you can compare drafts side by side",
    ],
    visual: (
      <FannedDocuments
        type="cover-letter"
        gradient="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50"
        cards={[
          { templateId: "executive-navy", rotate: -7, x: -40, y: 12, delay: 0.1 },
          { templateId: "creative-bold", rotate: 0, x: 0, y: 0, delay: 0.24 },
          { templateId: "minimal-clean", rotate: 6, x: 35, y: -10, delay: 0.38 },
        ]}
        badges={[
          { icon: ClockIcon, label: "Under 60 Seconds", position: "top-right", delay: 0.7, variant: "rose" },
          { icon: ArrowPathIcon, label: "Unlimited Revisions", position: "bottom-left", delay: 0.8 },
        ]}
      />
    ),
  },
];

const useCases = [
  {
    icon: AcademicCapIcon,
    title: "Recent Graduates",
    description:
      "When your resume is light on experience, a strong cover letter carries the weight. The generator translates coursework, internships, and extracurricular leadership into language that resonates with hiring managers. It helps you make a compelling case even when your work history is short, focusing on transferable skills, academic projects, and the enthusiasm that employers value in early-career candidates.",
  },
  {
    icon: ArrowPathIcon,
    title: "Career Switchers",
    description:
      "Changing industries means your resume may not immediately speak the new field's language. Our AI bridges that gap by reframing existing accomplishments in terms the target industry understands. A project manager moving into product management, a teacher transitioning to corporate training, an engineer pivoting to technical sales — the generator finds the overlap and articulates it clearly so recruiters see potential rather than a mismatch.",
  },
  {
    icon: BriefcaseIcon,
    title: "High-Volume Applicants",
    description:
      "If you are applying to dozens of roles each week, writing a unique cover letter for every one is simply not sustainable. The generator lets you produce tailored letters at scale without sacrificing quality. Paste a new job description, click generate, make a quick edit, and move on. You maintain the personalization that gets responses while reclaiming hours of your week for interview prep and networking.",
  },
  {
    icon: DocumentTextIcon,
    title: "Experienced Professionals",
    description:
      "Senior candidates face a different challenge: distilling a long career into a focused, relevant letter. The generator identifies which of your many accomplishments align with the specific role and omits the rest. It structures the narrative around impact and leadership rather than listing responsibilities, producing a letter that matches the seniority and strategic thinking that executive and management roles demand.",
  },
];

const faqs = [
  {
    question: "How does the AI generate a cover letter from my resume?",
    answer:
      "When you click generate, our AI reads your saved resume to extract your work history, skills, and accomplishments. It then cross-references that information with the job description you provide, identifying the most relevant experiences. Finally, it assembles a structured cover letter that maps your qualifications directly to the role's requirements, using natural language that avoids generic filler.",
  },
  {
    question: "Will every cover letter be unique?",
    answer:
      "Yes. Each cover letter is generated from scratch based on the combination of your specific resume and the particular job description you paste. Even if you apply to two similar roles at different companies, the generator produces distinct letters that reflect each posting's unique language, requirements, and company context.",
  },
  {
    question: "Can I edit the generated cover letter?",
    answer:
      "Absolutely. The generated letter is a starting point, not a final product. You can edit any paragraph directly in the editor, regenerate individual sections with different emphasis, adjust the overall tone, or add personal anecdotes. The goal is to give you a strong first draft that you can refine in minutes rather than building from a blank page.",
  },
  {
    question: "Does the cover letter pass ATS screening?",
    answer:
      "Our generator is designed with ATS compatibility in mind. It mirrors keywords and phrases from the job description, uses clean formatting without tables or columns that confuse parsing software, and follows a standard letter structure that ATS systems can read reliably. This increases the likelihood that your application reaches a human reviewer.",
  },
  {
    question: "What export formats are available?",
    answer:
      "You can export your cover letter as a PDF that matches your resume's styling for a cohesive application package, or copy the plain text for pasting directly into online application forms. Both options are available with a single click from the editor.",
  },
  {
    question: "Do I need a resume saved on the platform to use this feature?",
    answer:
      "Yes. The cover letter generator pulls directly from a resume you have created or imported into your account. If you have not created a resume yet, you can do so in minutes using our resume builder or by uploading an existing document. Once your resume is saved, the cover letter generator can access it instantly.",
  },
  {
    question: "How many cover letters can I generate?",
    answer:
      "Free accounts include up to five AI generations per month, which can be used for resumes or cover letters. Pro subscribers get unlimited generations, allowing you to create a unique cover letter for every application without worrying about limits.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your resume and cover letter data are encrypted in transit and at rest. We do not sell or share your personal information with third parties. Cover letter content is generated on-demand and is only accessible through your authenticated account. You can delete any document at any time, and it will be permanently removed from our systems.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export function CoverLetterGeneratorPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* -------- Hero -------- */}
        <PageHero
          badge="AI Cover Letter Generator"
          heading={
            <>
              Generate Personalized Cover Letters{" "}
              <span className="text-muted-foreground">That Get Responses</span>
            </>
          }
          description="Stop staring at a blank page. Paste a job description, and our AI writes a tailored cover letter from your resume in under 60 seconds — personalized, professional, and ready to send."
          ctaLabel="Create Your Cover Letter"
          ctaHref="/sign-up"
          secondaryCtaLabel="See how it works"
          secondaryCtaHref="#how-it-works"
        />

        {/* -------- Problem -------- */}
        <SectionWrapper background="muted" padding="md" id="problem" ariaLabelledBy="problem-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <SectionHeader
              id="problem-heading"
              heading="Cover Letters Are Painful — But Still Essential"
              description="Most job seekers know they should include a cover letter, yet the process is so tedious that many skip it entirely or submit the same generic draft over and over."
            />
            <div className="mx-auto mt-12 max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                Hiring managers spend an average of seven seconds scanning a resume. A cover letter is your
                chance to add context, show genuine interest, and differentiate yourself from candidates with
                similar qualifications. Yet writing a compelling cover letter for every application is
                exhausting. You research the company, study the job description, try to strike the right tone,
                and after forty-five minutes you are still stuck on the opening paragraph.
              </p>
              <p>
                The alternative — recycling a single letter with minor edits — is almost worse. Recruiters can
                spot a generic cover letter within the first two sentences. It signals low effort and often
                leads to an automatic rejection, regardless of how strong your resume might be. The candidates
                who get callbacks are the ones who tailor every letter to the specific role and company.
              </p>
              <p>
                That is exactly the gap <BrandName /> fills. Our AI cover letter generator eliminates the
                blank-page problem while preserving the personalization that makes cover letters effective. You
                bring the job description; we bring your resume and a language model trained to connect the two.
                The result is a polished, role-specific letter in seconds — not hours.
              </p>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* -------- How It Works -------- */}
        <SectionWrapper background="default" padding="md" id="how-it-works" ariaLabelledBy="how-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <SectionHeader
              id="how-heading"
              badge="How It Works"
              heading="From Job Posting to Finished Letter in Four Steps"
              description="No prompts to engineer. No templates to fill out. Just paste, click, and customize."
            />
          </motion.div>
          <motion.div
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={i}
                className="relative rounded-2xl border border-border bg-background p-6"
                variants={staggerItem}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="absolute right-6 top-6 text-sm font-medium text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* -------- Benefits -------- */}
        <SectionWrapper background="muted" padding="md" id="benefits" ariaLabelledBy="benefits-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <SectionHeader
              id="benefits-heading"
              badge="Benefits"
              heading="Why Job Seekers Choose Our Cover Letter Generator"
              description="Every feature is designed to save you time while increasing the quality and relevance of every letter you send."
            />
          </motion.div>
          <motion.div
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-border bg-background p-6"
                variants={staggerItem}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* -------- Feature Showcase -------- */}
        <SectionWrapper background="default" padding="md" id="features" ariaLabelledBy="features-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <SectionHeader
              id="features-heading"
              badge="Deep Dive"
              heading="Built for Quality, Speed, and Control"
              description="Explore the capabilities that make our cover letter generator more than a simple text tool."
            />
          </motion.div>
          <div className="mt-16">
            <FeatureShowcase features={showcaseFeatures} />
          </div>
        </SectionWrapper>

        {/* -------- Use Cases -------- */}
        <SectionWrapper background="muted" padding="md" id="use-cases" ariaLabelledBy="use-cases-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <SectionHeader
              id="use-cases-heading"
              badge="Who It's For"
              heading="Cover Letters for Every Stage of Your Career"
              description="Whether you are writing your very first cover letter or your five-hundredth, the generator adapts to your situation."
            />
          </motion.div>
          <motion.div
            className="mt-16 grid gap-8 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-border bg-background p-8"
                variants={staggerItem}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                  <useCase.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{useCase.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* -------- Pricing -------- */}
        <PricingPreview />

        {/* -------- FAQ -------- */}
        <PageFAQ
          heading="Cover Letter Generator FAQ"
          description="Common questions about creating AI-powered cover letters with resumelon."
          faqs={faqs}
          id="cover-letter-faq"
        />

        {/* -------- CTA -------- */}
        <SectionWrapper background="primary" padding="md">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Your Next Cover Letter Is 60 Seconds Away
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Stop spending hours crafting letters from scratch. Let our AI turn your resume and any job
              description into a personalized, interview-winning cover letter — instantly.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Generate Your First Cover Letter"
                signedOutHref="/sign-up"
              />
            </div>
          </motion.div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
