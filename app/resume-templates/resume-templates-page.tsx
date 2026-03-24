"use client";

import { motion } from "framer-motion";
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
  ScaledResume,
  FannedDocuments,
  TemplateGrid,
  SingleDocument,
} from "@/components/marketing";
import type { FAQItem } from "@/components/marketing";
import {
  SwatchIcon,
  LanguageIcon,
  ArrowsPointingOutIcon,
  QueueListIcon,
  UserCircleIcon,
  MinusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PaintBrushIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const templates = [
  {
    name: "ATS Classic",
    id: "ats-classic",
    category: "Classic",
    description:
      "Traditional ATS format with serif name and clean black line dividers. Time-tested formatting trusted by recruiters across every industry.",
  },
  {
    name: "Bold Modern",
    id: "bold-modern",
    category: "Modern",
    description:
      "Large centered name with strong professional presence. Clean lines and contemporary layout perfect for tech and startup roles.",
  },
  {
    name: "Creative",
    id: "creative-bold",
    category: "Creative",
    description:
      "Bold design with strong visual hierarchy and distinctive sections for design, media, and arts professionals.",
  },
  {
    name: "Minimal",
    id: "minimal-clean",
    category: "Minimal",
    description:
      "Ultra-minimal with maximum whitespace. Stripped-back elegance that puts your experience front and center.",
  },
  {
    name: "Executive",
    id: "executive-navy",
    category: "Executive",
    description:
      "Premium design with navy accents for senior leaders, directors, and C-suite candidates.",
  },
  {
    name: "Elegant",
    id: "elegant-serif",
    category: "Elegant",
    description:
      "Sophisticated serif typography with centered layout. A polished option for client-facing and premium roles.",
  },
];

const categoryColors: Record<string, string> = {
  Modern: "bg-blue-50 text-blue-700 border-blue-200",
  Professional: "bg-slate-50 text-slate-700 border-slate-200",
  Creative: "bg-purple-50 text-purple-700 border-purple-200",
  Minimal: "bg-gray-50 text-gray-700 border-gray-200",
  Executive: "bg-amber-50 text-amber-700 border-amber-200",
  Classic: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Elegant: "bg-rose-50 text-rose-700 border-rose-200",
};

const whyDifferent = [
  {
    icon: ShieldCheckIcon,
    title: "ATS-Safe by Default",
    description:
      "Every template is built from the ground up to pass Applicant Tracking Systems. We avoid headers in text boxes, images that hide content, and multi-column tricks that confuse parsers. Your information flows through ATS software exactly as you wrote it, so your resume reaches a real human every time.",
  },
  {
    icon: SwatchIcon,
    title: "Fully Customizable Colors and Fonts",
    description:
      "Personalize any template without starting from scratch. Adjust accent colors to match a company brand, swap between professional font pairings, and fine-tune spacing until every section sits exactly where you want it. Your resume should feel like yours, not a cookie-cutter download.",
  },
  {
    icon: SparklesIcon,
    title: "Live Preview as You Edit",
    description:
      "See every change reflected instantly in a pixel-perfect preview panel. No more toggling between an editor and a separate PDF viewer. Move sections, rewrite bullets, change colors, and watch the result update in real time so you can iterate with confidence.",
  },
  {
    icon: DocumentArrowDownIcon,
    title: "Print-Ready PDF and DOCX Export",
    description:
      "Download your finished resume as a crisp PDF or a fully editable DOCX file. Both formats preserve your layout, fonts, and spacing so what you see on screen is exactly what a recruiter sees on paper or in their inbox.",
  },
];

const templateFeatures = [
  {
    icon: SwatchIcon,
    title: "Customizable Colors",
    description:
      "Choose from a curated palette or enter any hex code to match your personal brand or the company you are targeting.",
  },
  {
    icon: LanguageIcon,
    title: "Font Selection",
    description:
      "Pick from a library of professional typefaces. Pair serif headings with sans-serif body text, or keep everything uniform.",
  },
  {
    icon: ArrowsPointingOutIcon,
    title: "Spacing Control",
    description:
      "Adjust line height, section gaps, and margins to fit more content or give your resume breathing room.",
  },
  {
    icon: QueueListIcon,
    title: "Section Reordering",
    description:
      "Drag sections into any order. Lead with education if you are a new grad, or highlight skills first for a career change.",
  },
  {
    icon: UserCircleIcon,
    title: "Photo Toggle",
    description:
      "Add a professional headshot when applying internationally or toggle it off for markets where photos are not expected.",
  },
  {
    icon: MinusIcon,
    title: "Divider Styles",
    description:
      "Switch between solid lines, dotted separators, or clean whitespace to subtly change the visual rhythm of your layout.",
  },
];

const showcaseFeatures = [
  {
    title: "Design Customization That Goes Beyond Color Swaps",
    description:
      "Most resume builders let you pick a color and call it customization. With resumelon, you control every visual detail. Adjust font sizes independently for headings and body text, set custom margins for print, and choose between single-column and multi-column layouts that still pass ATS checks. The result is a resume that looks intentionally designed, not generated from a rigid template.",
    bullets: [
      "Independent heading and body font controls",
      "Custom margin and padding adjustments",
      "Single and multi-column ATS-safe layouts",
      "Real-time preview of every change",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
        cards={[
          { templateId: "bold-modern", rotate: -7, x: -40, y: 12, delay: 0.1 },
          { templateId: "elegant-serif", rotate: 0, x: 0, y: 0, delay: 0.24 },
          { templateId: "creative-bold", rotate: 6, x: 35, y: -10, delay: 0.38 },
        ]}
        badges={[
          { icon: SwatchIcon, label: "Custom Colors", position: "top-right", delay: 0.7, variant: "accent" },
          { icon: PaintBrushIcon, label: "Font Pairing", position: "bottom-left", delay: 0.8 },
        ]}
      />
    ),
  },
  {
    title: "ATS Compatibility You Can Trust",
    description:
      "Applicant Tracking Systems reject roughly 75 percent of resumes before a human ever reads them. Our templates are reverse-engineered from the parsing logic of the most popular ATS platforms including Greenhouse, Lever, Workday, and Taleo. Every heading uses standard labels, every section follows a predictable document flow, and every export renders clean text that machines can read without guessing.",
    bullets: [
      "Tested against Greenhouse, Lever, Workday, and Taleo parsers",
      "Standard section headings for reliable parsing",
      "No hidden text boxes, tables, or graphics that break parsing",
      "Built-in resume scoring to catch issues before you apply",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="ats-classic"
        gradient="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
        rotate={-3}
        badges={[
          { icon: ShieldCheckIcon, label: "ATS Score: 98%", position: "top-left", delay: 0.6, variant: "success" },
          { icon: EyeIcon, label: "Recruiter Approved", position: "bottom-right", delay: 0.8 },
        ]}
      />
    ),
  },
  {
    title: "One-Click Export in Multiple Formats",
    description:
      "When your resume is ready, exporting should take seconds, not minutes of reformatting. Click once to generate a pixel-perfect PDF that preserves every font, color, and spacing decision you made. Need an editable file for a recruiter who insists on DOCX? That option is one click away too. Both formats are optimized for email attachments, online uploads, and direct printing at standard paper sizes.",
    bullets: [
      "High-resolution PDF with embedded fonts",
      "Fully editable DOCX that maintains layout",
      "Optimized file sizes for email and upload portals",
      "US Letter and A4 paper size support",
    ],
    visual: (
      <TemplateGrid
        type="resume"
        gradient="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50"
        templates={[
          { id: "executive-navy", rotate: -2, x: -4, y: 3, delay: 0.1 },
          { id: "minimal-clean", rotate: 2, x: 4, y: -2, delay: 0.2 },
          { id: "timeline-blue", rotate: -1, x: -3, y: 2, delay: 0.3 },
          { id: "coral-two-column", rotate: 3, x: 5, y: -4, delay: 0.4 },
        ]}
        badges={[
          { icon: ArrowDownTrayIcon, label: "PDF & DOCX", position: "top-right", delay: 0.6, variant: "blue" },
          { icon: SparklesIcon, label: "Pixel Perfect", position: "bottom-left", delay: 0.75 },
        ]}
      />
    ),
  },
];

const industryGuide = [
  {
    icon: BriefcaseIcon,
    title: "Corporate and Finance",
    description:
      "Choose the Professional or Classic template. These industries value tradition and clarity. Stick with neutral colors like navy or charcoal, use a serif font for headings, and keep the layout single-column. Lead with your experience section and quantify achievements with dollar amounts and percentages.",
  },
  {
    icon: PaintBrushIcon,
    title: "Design and Creative",
    description:
      "The Creative or Modern template gives you room to express visual taste without sacrificing readability. Use an accent color that matches your portfolio brand, add a professional photo if the market expects it, and consider leading with a skills section that highlights your tools and software proficiency.",
  },
  {
    icon: AcademicCapIcon,
    title: "Academic and Research",
    description:
      "The Classic or Executive template works well for academic CVs. Prioritize education, publications, and grants. Use generous spacing so dense content remains scannable, and keep colors minimal. Section reordering lets you put teaching experience or research above employment history when that matters more.",
  },
  {
    icon: SparklesIcon,
    title: "Technology and Startups",
    description:
      "The Modern or Minimal template resonates with tech recruiters who review hundreds of resumes a week. Use a clean sans-serif font, keep your summary to two or three lines, and front-load technical skills. A subtle accent color helps your name stand out without looking unprofessional.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "Are the resume templates really free?",
    answer:
      "Yes. Every template is available on our free plan. You can pick any design, customize colors and fonts, and download your resume without paying. The Pro plan unlocks additional features like AI-powered bullet rewrites, unlimited resume generations, and advanced export options, but the templates themselves are always free.",
  },
  {
    question: "Can I customize the templates after choosing one?",
    answer:
      "Absolutely. Every template supports full customization. You can change accent colors, swap fonts, adjust spacing and margins, reorder sections, toggle a profile photo on or off, and switch between divider styles. All changes appear instantly in the live preview so you can experiment without risk.",
  },
  {
    question: "Which template is best for my industry?",
    answer:
      "It depends on the norms of your field. Corporate and finance roles typically favor the Professional or Classic templates with conservative colors. Creative and design roles can benefit from the Creative or Modern templates with bolder accents. Technology and startup candidates often prefer the Modern or Minimal templates. Our guide section on this page breaks it down by industry.",
  },
  {
    question: "Will these templates pass Applicant Tracking Systems?",
    answer:
      "Yes. Every template is designed from the ground up to be ATS-compatible. We use standard section headings, clean document structure, and avoid elements that confuse parsers like text boxes, embedded tables, and decorative graphics. We have tested our templates against Greenhouse, Lever, Workday, and Taleo to ensure reliable parsing.",
  },
  {
    question: "Can I switch templates after I start writing my resume?",
    answer:
      "Yes. You can switch between any template at any time without losing your content. Your text, sections, and formatting preferences carry over. Only the visual layout changes, so you can try every option and settle on the one that presents your experience best.",
  },
  {
    question: "What file formats can I export my resume in?",
    answer:
      "You can export your resume as a high-resolution PDF with embedded fonts or as a fully editable DOCX file. Both formats preserve your layout, colors, and spacing exactly as they appear in the editor. PDF is best for online applications and email, while DOCX is useful when a recruiter specifically requests an editable file.",
  },
  {
    question: "Do I need design skills to use these templates?",
    answer:
      "Not at all. The templates handle all design decisions for you. Typography, spacing, alignment, and visual hierarchy are built in. You simply fill in your information and adjust colors or fonts if you want to. The live preview shows you exactly what the final result will look like as you work.",
  },
  {
    question: "How often do you add new templates?",
    answer:
      "We regularly release new templates based on user feedback and evolving hiring trends. When a new template is added, it becomes available to all users immediately, including those on the free plan. You can follow our updates to be notified when new designs launch.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ResumeTemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.div
        className="flex flex-1 flex-col"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ duration: 0.4 }}
      >
        <Navbar />

        {/* 1. Hero */}
        <PageHero
          badge="Resume Templates"
          heading={
            <>
              Professional Resume Templates{" "}
              <span className="text-muted-foreground">That Pass ATS</span>
            </>
          }
          description="Pick from a curated collection of recruiter-approved resume templates. Every design is ATS-friendly, fully customizable, and free to use. Choose a template, add your details, and download a polished resume in minutes."
          ctaLabel="Browse Templates"
          ctaHref="/sign-up"
          secondaryCtaLabel="See how it works"
          secondaryCtaHref="#how-to-choose"
        />

        {/* 2. Template Showcase Grid */}
        <SectionWrapper background="muted" id="templates" ariaLabelledBy="templates-heading">
          <SectionHeader
            id="templates-heading"
            heading="Choose Your Template"
            description="Six professionally designed layouts covering every career stage and industry. Each template is fully editable and ATS-tested."
            badge="Template Gallery"
          />
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {templates.map((template) => (
              <motion.div
                key={template.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md"
                variants={sectionVariants}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-center p-4 pb-0 bg-muted/30">
                  <ScaledResume templateId={template.id} width={260} />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {template.name}
                    </h3>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[template.category]}`}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-10 flex justify-center">
            <InlineCTA signedOutLabel="Start With This Template" signedOutHref="/sign-up" />
          </div>
        </SectionWrapper>

        {/* 3. Why Our Templates Are Different */}
        <SectionWrapper background="default" id="why-different" ariaLabelledBy="why-heading">
          <SectionHeader
            id="why-heading"
            heading="What Makes Our Templates Different"
            description="Plenty of sites offer free resume templates. Here is why job seekers choose ours over generic downloads and overpriced builders."
            badge="Why resumelon"
          />
          <motion.div
            className="mt-12 grid gap-8 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 },
              },
            }}
          >
            {whyDifferent.map((item) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-border bg-white p-6 sm:p-8"
                variants={sectionVariants}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* 4. Template Features Grid */}
        <SectionWrapper background="muted" id="features" ariaLabelledBy="features-heading">
          <SectionHeader
            id="features-heading"
            heading="Every Template Comes Loaded"
            description="Built-in customization controls so you can make any template truly yours without touching a design tool."
            badge="Template Features"
          />
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {templateFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-border bg-white p-6"
                variants={sectionVariants}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <feature.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* 5. Feature Showcase - Alternating Blocks */}
        <SectionWrapper background="default" id="showcase" ariaLabelledBy="showcase-heading">
          <SectionHeader
            id="showcase-heading"
            heading="See the Templates in Action"
            description="A closer look at the tools that make our templates more than static downloads."
          />
          <div className="mt-12">
            <FeatureShowcase features={showcaseFeatures} />
          </div>
        </SectionWrapper>

        {/* 6. How to Choose the Right Template */}
        <SectionWrapper background="muted" id="how-to-choose" ariaLabelledBy="guide-heading">
          <SectionHeader
            id="guide-heading"
            heading="How to Choose the Right Template"
            description="The best template depends on your industry, experience level, and the impression you want to make. Use this guide to narrow it down."
            badge="Template Guide"
          />
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {industryGuide.map((item) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-border bg-white p-6 sm:p-8"
                variants={sectionVariants}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-10 rounded-2xl border border-border bg-white p-6 sm:p-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-foreground">
              General Tips for Any Industry
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Match the company tone.</strong>{" "}
                If the job posting uses formal language, lean toward Professional or Classic. If it reads casually, Modern or Minimal will feel more natural.
              </li>
              <li>
                <strong className="text-foreground">Prioritize readability.</strong>{" "}
                A hiring manager spends an average of six to seven seconds scanning a resume. Use clear section headings, consistent formatting, and enough whitespace to guide the eye quickly.
              </li>
              <li>
                <strong className="text-foreground">Keep it to one page when possible.</strong>{" "}
                Unless you have more than ten years of directly relevant experience, a single page is almost always sufficient. Our spacing controls make it easy to fit more content without shrinking text to an unreadable size.
              </li>
              <li>
                <strong className="text-foreground">Use the live preview.</strong>{" "}
                Every template renders in real time as you type. Use this to catch alignment issues, orphaned headings, and awkward line breaks before you export.
              </li>
            </ul>
          </motion.div>
        </SectionWrapper>

        {/* 7. FAQ */}
        <PageFAQ
          heading="Resume Template FAQs"
          description="Answers to the most common questions about our templates, customization options, and compatibility."
          faqs={faqs}
          id="template-faq"
        />

        {/* 8. CTA Section */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Your Next Resume Is One Template Away
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Pick a template, fill in your details, and download a polished,
              ATS-optimized resume in minutes. No design skills required, no
              hidden fees. Join thousands of job seekers who have already landed
              interviews with <BrandName className="text-primary-foreground" />.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Build Your Resume Now"
              />
            </div>
          </div>
        </SectionWrapper>

        <Footer />
      </motion.div>
    </div>
  );
}
