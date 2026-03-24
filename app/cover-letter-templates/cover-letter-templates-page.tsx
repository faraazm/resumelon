"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  BriefcaseIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  ArrowsRightLeftIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { SectionHeader } from "@/components/marketing/section-header";
import { PageHero } from "@/components/marketing/page-hero";
import { PageFAQ } from "@/components/marketing/page-faq";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { InlineCTA } from "@/components/marketing/inline-cta";
import { BrandName } from "@/components/marketing/logo";
import { ScaledCoverLetter } from "@/components/marketing/template-preview";
import { StackedDocuments, SingleDocument, TemplateGrid } from "@/components/marketing/template-visuals";
import { PricingPreview } from "@/components/marketing/pricing-preview";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const templates = [
  { name: "ATS Classic", id: "ats-classic", tag: "Professional", description: "A clean, traditional layout favored by hiring managers across industries. Structured paragraphs with clear contact headers convey reliability and attention to detail." },
  { name: "Bold Modern", id: "bold-modern", tag: "Modern", description: "Contemporary design with subtle accent lines and balanced whitespace. Ideal for candidates applying to forward-thinking companies." },
  { name: "Creative", id: "creative-bold", tag: "Creative", description: "Expressive layout with tasteful design elements that let your personality shine. Perfect for design, marketing, and media roles." },
  { name: "Minimal", id: "minimal-clean", tag: "Minimal", description: "Stripped-back elegance that puts your words front and center. A distraction-free format that performs well with ATS systems." },
  { name: "Executive", id: "executive-navy", tag: "Executive", description: "Commanding presence with refined typography suited for senior leadership and C-suite positions." },
  { name: "Elegant", id: "elegant-serif", tag: "Elegant", description: "Sophisticated styling with graceful typographic choices and harmonious spacing for client-facing and premium roles." },
];

const templateFeatures = [
  {
    icon: DocumentTextIcon,
    title: "Professional Formatting",
    description: "Every template follows established business letter conventions, including proper salutation, body structure, and sign-off. Hiring managers immediately recognize a well-formatted letter, and our layouts ensure yours never looks amateurish or thrown together at the last minute.",
  },
  {
    icon: PaintBrushIcon,
    title: "Matching Resume Style",
    description: "Your cover letter and resume should look like they belong together. Our templates are designed to pair seamlessly with the resume templates available on the platform, so your entire application package shares consistent fonts, colors, and visual weight.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Customizable Layout",
    description: "Adjust margins, spacing, font sizes, and section order to match your preferences. Whether you prefer a compact single-page layout or a more spacious design with generous whitespace, every element can be fine-tuned without breaking the overall structure.",
  },
  {
    icon: SparklesIcon,
    title: "AI-Powered Content",
    description: "Staring at a blank page is the hardest part of writing a cover letter. Our AI analyzes your resume and the target job description to generate a compelling first draft, complete with role-specific language, quantified achievements, and a confident closing paragraph.",
  },
  {
    icon: BriefcaseIcon,
    title: "Industry-Appropriate Tone",
    description: "A cover letter for a law firm reads very differently from one aimed at a startup. Our AI adapts tone, vocabulary, and formality level based on the industry you select, so your letter always strikes the right note with its intended audience.",
  },
  {
    icon: PencilSquareIcon,
    title: "Easy Editing",
    description: "Edit your cover letter directly in the live preview with our intuitive rich-text editor. See changes reflected in real time, swap between templates instantly, and export to PDF or DOCX when you are satisfied. No design skills required.",
  },
];

const showcaseFeatures = [
  {
    title: "AI Content Generation That Sounds Like You",
    description:
      "Writing a cover letter from scratch can take hours. Our AI reads your resume, extracts your strongest achievements, and weaves them into a narrative tailored to the specific job you are applying for. The result is a polished first draft that captures your voice and highlights the experience that matters most to each employer. You stay in control, editing every sentence until it feels right.",
    bullets: [
      "Analyzes your resume to pull relevant accomplishments",
      "Tailors language and keywords to the target job description",
      "Generates complete drafts in under thirty seconds",
      "Adapts tone for different industries and seniority levels",
    ],
    visual: (
      <SingleDocument
        type="cover-letter"
        templateId="elegant-serif"
        gradient="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50"
        rotate={3}
        badges={[
          { icon: SparklesIcon, label: "AI Generated", position: "top-left", delay: 0.6, variant: "teal" },
          { icon: PencilSquareIcon, label: "Your Voice", position: "bottom-right", delay: 0.8 },
        ]}
      />
    ),
  },
  {
    title: "Seamless Resume Integration",
    description:
      "Your cover letter should extend the story your resume starts, not repeat it. When you create a cover letter on the platform, it automatically pulls your work history, skills, and education from your resume so you never have to re-enter information. The visual styling matches too, giving recruiters a cohesive application package that looks intentional and professional from the first page to the last.",
    bullets: [
      "Auto-imports contact details and work history from your resume",
      "Matches fonts, colors, and layout with your chosen resume template",
      "Updates automatically when you revise your resume",
      "Creates a unified application package for every job",
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
          { icon: DocumentTextIcon, label: "Resume Synced", position: "top-right", delay: 0.7, variant: "amber" },
          { icon: CheckCircleIcon, label: "Consistent Style", position: "bottom-left", delay: 0.85 },
        ]}
      />
    ),
  },
  {
    title: "Professional Formatting, Every Time",
    description:
      "Formatting a business letter correctly involves more than picking a nice font. Proper margins, consistent spacing, correct date placement, and a clean header all send a signal that you are detail-oriented and professional. Our templates handle every formatting rule automatically, so you can focus on what you want to say rather than how the page looks. Each layout has been reviewed by career coaches and recruiters to ensure it meets current hiring standards.",
    bullets: [
      "Correct business letter structure with salutation and sign-off",
      "ATS-friendly formatting that parses cleanly through screening software",
      "Automatic page balancing to avoid awkward page breaks",
      "Export to PDF or DOCX with perfect fidelity",
    ],
    visual: (
      <TemplateGrid
        type="cover-letter"
        gradient="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50"
        templates={[
          { id: "ats-classic", rotate: -2, x: -4, y: 3, delay: 0.1 },
          { id: "executive-navy", rotate: 2, x: 4, y: -2, delay: 0.2 },
          { id: "creative-bold", rotate: -1, x: -3, y: 2, delay: 0.3 },
          { id: "bold-modern", rotate: 3, x: 5, y: -4, delay: 0.4 },
        ]}
        badges={[
          { icon: DocumentTextIcon, label: "Business Format", position: "top-left", delay: 0.6, variant: "rose" },
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
      "When your resume is light on experience, a strong cover letter carries extra weight. It gives you space to explain how your coursework, internships, volunteer work, and personal projects translate to the role. Our templates help new graduates frame transferable skills persuasively and demonstrate the enthusiasm that hiring managers look for in early-career candidates.",
  },
  {
    icon: ArrowsRightLeftIcon,
    title: "Career Changers",
    description:
      "Switching industries means your resume alone may not tell the full story. A cover letter lets you connect the dots between your past experience and your new direction. Use it to explain why you are making the change, what skills carry over, and why your unique background is an asset rather than a gap. Our AI helps translate jargon from one field into language that resonates in another.",
  },
  {
    icon: BuildingOfficeIcon,
    title: "Corporate Professionals",
    description:
      "Many corporate roles still expect a cover letter, especially at the executive level. A well-crafted letter demonstrates communication skills, strategic thinking, and cultural fit, qualities that a bullet-point resume cannot fully convey. Our Executive and Professional templates are designed for this audience, projecting competence and polish from the very first paragraph.",
  },
  {
    icon: LightBulbIcon,
    title: "Creative Professionals",
    description:
      "In creative fields, your cover letter is a writing sample. It needs to showcase your voice, your taste, and your ability to engage an audience. Our Creative and Elegant templates give you a visually distinctive starting point, while the editor lets you inject personality without sacrificing professionalism. Stand out in a stack of applications without going overboard.",
  },
];

const faqs = [
  {
    question: "Do I really need a cover letter in 2026?",
    answer:
      "Yes. While not every employer requires one, studies consistently show that a majority of hiring managers still read cover letters when they are included. A cover letter gives you a chance to explain context that a resume cannot, such as career transitions, employment gaps, or specific interest in the company. Including one signals effort and genuine interest in the role, which can set you apart from candidates who skip it.",
  },
  {
    question: "Can I customize these templates to match my resume?",
    answer:
      "Absolutely. Every template supports full customization of fonts, colors, spacing, and layout. If you have already built a resume on the platform, your cover letter can automatically inherit the same visual styling so the two documents look like a cohesive package. You can also adjust individual elements independently if you prefer a slightly different look for your letter.",
  },
  {
    question: "What tone should my cover letter use?",
    answer:
      "The ideal tone depends on the industry and role. A cover letter for a law firm should be formal and precise, while one for a tech startup can afford to be conversational and energetic. Our AI analyzes the job description and suggests an appropriate tone, but you always have the final say. As a general rule, aim for confident and professional without being stiff or overly casual.",
  },
  {
    question: "How does the AI generate cover letter content?",
    answer:
      "When you create a cover letter, the AI reads your resume data and the job description you provide. It identifies the most relevant skills, experiences, and achievements, then structures them into a compelling narrative with a strong opening, detailed middle paragraphs, and a confident closing. The result is a complete first draft that you can edit, rearrange, and refine until it sounds exactly the way you want.",
  },
  {
    question: "Will these templates pass applicant tracking systems?",
    answer:
      "Yes. All of our cover letter templates use clean, parseable formatting that applicant tracking systems can read without issues. We avoid complex layouts, text boxes, images, and other elements that can confuse ATS software. The result is a letter that looks polished to human readers and processes cleanly through automated screening tools.",
  },
  {
    question: "How long should my cover letter be?",
    answer:
      "A cover letter should generally be between 250 and 400 words, fitting comfortably on a single page. Hiring managers often spend less than a minute reviewing each letter, so conciseness matters. Our templates are designed to keep your content within this range, and the AI generates drafts that are thorough without being unnecessarily long.",
  },
  {
    question: "Can I use one cover letter for multiple job applications?",
    answer:
      "We strongly recommend tailoring each cover letter to the specific role and company. Generic letters are easy for hiring managers to spot and they suggest a lack of genuine interest. With our AI-powered generation, creating a new tailored letter takes less than a minute, so there is no reason to send the same one twice. Each version will highlight the skills and experiences most relevant to that particular position.",
  },
  {
    question: "What file formats can I export my cover letter in?",
    answer:
      "You can export your finished cover letter as a PDF or DOCX file. PDF is the preferred format for most online applications because it preserves formatting across devices and operating systems. DOCX is useful when an employer specifically requests a Word document or when you need to make further edits outside the platform.",
  },
];

export function CoverLetterTemplatesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <PageHero
          badge="Cover Letter Templates"
          heading={
            <>
              Cover Letter Templates That Make a{" "}
              <span className="text-muted-foreground">Strong First Impression</span>
            </>
          }
          description="Choose from professionally designed cover letter templates that pair perfectly with your resume. Customize every detail, generate compelling content with AI, and export a polished letter in minutes. Whether you are applying for your first job or your next executive role, the right template makes all the difference."
          ctaLabel="Create My Cover Letter"
          ctaHref="/sign-up"
        />

        {/* Template Showcase Grid */}
        <SectionWrapper background="muted" id="templates" ariaLabelledBy="templates-heading">
          <SectionHeader
            id="templates-heading"
            heading="Choose a Template That Fits Your Style"
            description="Each template has been designed by career experts and tested with real hiring managers. Pick the style that matches your industry and personality, then customize it to make it yours."
            badge="Templates"
          />
          <motion.div
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            {templates.map((template) => (
              <motion.div
                key={template.name}
                className="group overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md"
                variants={sectionVariants}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-center p-4 pb-0 bg-muted/30">
                  <ScaledCoverLetter templateId={template.id} width={260} />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {template.name}
                    </h3>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {template.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* Why a Great Cover Letter Matters */}
        <SectionWrapper background="default" id="why-cover-letters" ariaLabelledBy="why-heading">
          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionVariants}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              id="why-heading"
              heading="Why a Great Cover Letter Still Matters"
              description="In a competitive job market, your cover letter is often the first piece of writing a hiring manager reads. It sets the tone for your entire application."
              badge="The Case for Cover Letters"
            />
            <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                A resume tells employers what you have done. A cover letter tells them why it matters. It
                provides context that bullet points cannot: why you are drawn to this particular company,
                how your background connects to the role, and what kind of colleague you would be. For
                hiring managers sorting through dozens or hundreds of applications, that context is often
                what separates the shortlist from the rejection pile.
              </p>
              <p>
                Research from the Society for Human Resource Management found that 83% of HR professionals
                consider cover letters important when evaluating candidates, and nearly half said a strong
                cover letter could move a candidate forward even when their resume was not a perfect match.
                For career changers, recent graduates, and anyone with an unconventional background, that
                statistic is especially significant. The cover letter is where you explain the story behind
                the resume.
              </p>
              <p>
                Beyond persuasion, a cover letter is a writing sample. It demonstrates your communication
                skills, your ability to organize thoughts clearly, and your attention to detail. Typos,
                generic phrasing, or a sloppy layout can undermine an otherwise strong application. That
                is why starting with a professionally designed template matters: it handles the formatting
                and structure so you can focus entirely on crafting a compelling message.
              </p>
              <p>
                When your cover letter and resume share the same visual style, the effect is even stronger.
                A cohesive application package signals professionalism and intentionality. It tells the
                reader that you take the opportunity seriously and that you pay attention to how you present
                yourself. With <BrandName />, achieving that consistency is automatic. Select a cover letter
                template that matches your resume, and the fonts, colors, and spacing align without any
                extra effort on your part.
              </p>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Template Features */}
        <SectionWrapper background="muted" id="features" ariaLabelledBy="features-heading">
          <SectionHeader
            id="features-heading"
            heading="Everything You Need in a Cover Letter Template"
            description="Our templates are more than attractive layouts. They are built with the tools, intelligence, and flexibility to help you write better cover letters, faster."
          />
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.08 }}
          >
            {templateFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={sectionVariants}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </SectionWrapper>

        {/* Feature Showcase */}
        <SectionWrapper background="default" id="showcase" ariaLabelledBy="showcase-heading">
          <SectionHeader
            id="showcase-heading"
            heading="See How It Works"
            description="From AI-generated first drafts to pixel-perfect exports, every step of the cover letter process has been designed to save you time and produce better results."
            badge="In Action"
          />
          <div className="mt-12">
            <FeatureShowcase features={showcaseFeatures} />
          </div>
        </SectionWrapper>

        {/* Who Needs Cover Letter Templates */}
        <SectionWrapper background="muted" id="use-cases" ariaLabelledBy="use-cases-heading">
          <SectionHeader
            id="use-cases-heading"
            heading="Who Benefits From a Cover Letter Template?"
            description="No matter where you are in your career, a well-designed cover letter template saves time and improves the quality of every application you send."
            badge="Use Cases"
          />
          <motion.div
            className="mt-12 grid gap-8 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1 }}
          >
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  className="rounded-2xl border border-border bg-white p-8"
                  variants={sectionVariants}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{useCase.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </SectionWrapper>

        {/* Pricing */}
        <PricingPreview />

        {/* FAQ */}
        <PageFAQ
          heading="Cover Letter Template FAQs"
          description="Answers to the most common questions about using cover letter templates to strengthen your job applications."
          faqs={faqs}
        />

        {/* CTA */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Your Next Cover Letter, Ready in Minutes
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Stop staring at a blank page. Pick a template, let AI draft your content, and
              customize until it is perfect. Thousands of job seekers have already landed
              interviews with cover letters built on <BrandName />.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Create My Cover Letter Now"
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
