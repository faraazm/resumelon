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
  PricingPreview,
  FannedDocuments,
  StackedDocuments,
  SingleDocument,
} from "@/components/marketing";
import type { FAQItem } from "@/components/marketing";
import {
  AcademicCapIcon,
  BeakerIcon,
  BriefcaseIcon,
  HeartIcon,
  SparklesIcon,
  TrophyIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

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

const resumeSections = [
  {
    icon: AcademicCapIcon,
    title: "Relevant Coursework",
    description:
      "Highlight classes that align with the role you are targeting. If you completed a data analytics course and you are applying for an analyst internship, that coursework is directly relevant experience. Include course projects with measurable outcomes whenever possible, such as datasets analyzed or presentations delivered.",
  },
  {
    icon: BeakerIcon,
    title: "Academic & Personal Projects",
    description:
      "Class projects, capstone work, hackathon submissions, and personal side projects all demonstrate initiative and practical skills. Describe what you built, the tools you used, and the result. A portfolio project can be just as compelling as professional experience when it is presented with clear context and outcomes.",
  },
  {
    icon: BriefcaseIcon,
    title: "Internships & Part-Time Work",
    description:
      "Even short internships and part-time jobs show employers that you can operate in a professional environment. Focus on transferable skills like communication, time management, and problem-solving. Quantify your contributions wherever you can, such as the number of customers served, reports completed, or processes improved.",
  },
  {
    icon: HeartIcon,
    title: "Volunteer Experience",
    description:
      "Volunteering demonstrates leadership, empathy, and commitment. If you organized a fundraiser, mentored younger students, or coordinated logistics for a community event, those are real accomplishments that belong on your resume. Treat volunteer roles the same way you would treat paid positions by focusing on what you achieved.",
  },
  {
    icon: SparklesIcon,
    title: "Skills & Certifications",
    description:
      "List technical skills like programming languages, design tools, and software platforms alongside soft skills that are relevant to the job. Include any certifications you have earned, such as Google Analytics, HubSpot Inbound Marketing, or AWS Cloud Practitioner. Certifications show initiative and validate your knowledge.",
  },
  {
    icon: TrophyIcon,
    title: "Extracurricular Activities",
    description:
      "Club leadership, varsity athletics, student government, and other extracurriculars reveal character traits that employers value. A student who captained a debate team has demonstrated public speaking, teamwork, and competitive drive. Frame your extracurriculars around the skills and qualities they developed.",
  },
];

const howItWorksSteps = [
  {
    icon: DocumentTextIcon,
    title: "Choose a Student-Friendly Template",
    description:
      "Browse our library of ATS-optimized templates designed specifically for students and recent graduates. Every layout emphasizes education, skills, and projects so your strongest qualifications are front and center, even without years of professional experience. Pick a template that matches the tone of your target industry.",
  },
  {
    icon: PencilSquareIcon,
    title: "Add Your Experience and Education",
    description:
      "Fill in your education details, coursework, projects, internships, volunteer work, and skills using our guided editor. The builder walks you through each section step by step so you never stare at a blank page. You can also import an existing resume or LinkedIn profile to get a head start.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Let AI Polish Your Content",
    description:
      "Our AI reviews your bullet points and suggests improvements that highlight your accomplishments more effectively. It helps you rewrite vague descriptions into concrete, achievement-focused statements that resonate with hiring managers. You stay in control of every word while the AI does the heavy lifting on phrasing and structure.",
  },
  {
    icon: ArrowDownTrayIcon,
    title: "Download and Apply with Confidence",
    description:
      "Export your finished resume as a clean, ATS-compatible PDF and start submitting applications immediately. Every resume passes through our formatting checker to ensure it will be read correctly by automated screening systems. You can also create multiple tailored versions for different roles without starting from scratch.",
  },
];

const showcaseFeatures = [
  {
    title: "AI That Understands Limited Experience",
    description:
      "The biggest challenge students face is not a lack of experience but rather not knowing how to present the experience they already have. Our AI is specifically trained to help students and recent graduates transform everyday activities into compelling resume content. It analyzes your coursework, projects, part-time jobs, and extracurriculars, then generates professional bullet points that emphasize transferable skills and measurable outcomes. Instead of writing that you worked at a retail store, the AI helps you articulate that you managed inventory for 200 products and resolved an average of 30 customer inquiries per shift.",
    bullets: [
      "Transforms academic projects into professional accomplishments",
      "Suggests action verbs and quantifiable metrics for every bullet",
      "Adapts tone and language to match your target industry",
      "Rewrites vague descriptions into specific, results-oriented statements",
    ],
    visual: (
      <FannedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
        cards={[
          { templateId: "minimal-clean", rotate: -6, x: -35, y: 10, delay: 0.1 },
          { templateId: "bold-modern", rotate: 3, x: 10, y: 0, delay: 0.24 },
        ]}
        badges={[
          { icon: SparklesIcon, label: "AI-Enhanced", position: "top-left", delay: 0.6, variant: "accent" },
          { icon: CheckCircleIcon, label: "Student Optimized", position: "bottom-right", delay: 0.8, variant: "success" },
        ]}
      />
    ),
  },
  {
    title: "ATS-Friendly Formatting Built In",
    description:
      "You should not have to worry about whether your resume will be read correctly by an Applicant Tracking System. Every template in our library has been tested against the most widely used ATS platforms including Workday, Greenhouse, Lever, and iCIMS. The formatting is clean, the section headings are standard, and the output is a machine-readable PDF that passes automated screening every time. This means you can focus entirely on your content while we handle the technical requirements that determine whether your resume even reaches a human reviewer.",
    bullets: [
      "Tested against Workday, Greenhouse, Lever, and iCIMS",
      "Clean single-column layouts with proper reading order",
      "Standard section headings recognized by every major ATS",
      "Machine-readable PDF output with selectable text",
    ],
    visual: (
      <StackedDocuments
        type="resume"
        gradient="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
        sparkleColor="text-emerald-500"
        cards={[
          { templateId: "ats-classic", rotate: -4, x: -20, y: 8, delay: 0.1 },
          { templateId: "executive-navy", rotate: 2, x: 15, y: -4, delay: 0.25 },
        ]}
        badges={[
          { icon: ShieldCheckIcon, label: "100% ATS Safe", position: "top-right", delay: 0.6, variant: "success" },
          { icon: ChartBarIcon, label: "Parse Rate: 99%", position: "bottom-left", delay: 0.8, variant: "teal" },
        ]}
      />
    ),
  },
  {
    title: "Professional Templates for Every Field",
    description:
      "Whether you are applying for a software engineering internship, a marketing assistant role, a research position, or your first job after graduation, we have a template that fits. Our designs are intentionally clean and professional so they work across industries without looking generic. You can customize colors, fonts, and spacing to add a personal touch while maintaining the structure and readability that recruiters expect. Every template puts your education section prominently at the top, which is exactly where it should be when you are a student or recent graduate.",
    bullets: [
      "Templates optimized for students across all industries",
      "Education section prominently positioned for early-career candidates",
      "Customizable colors, fonts, and spacing for personalization",
      "Professional designs that look polished without being over-designed",
    ],
    visual: (
      <SingleDocument
        type="resume"
        templateId="creative-bold"
        gradient="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50"
        rotate={-3}
        badges={[
          { icon: StarIcon, label: "Student Favorite", position: "top-right", delay: 0.6, variant: "blue" },
          { icon: AcademicCapIcon, label: "Education First", position: "bottom-left", delay: 0.8, variant: "accent" },
        ]}
      />
    ),
  },
];

const useCases = [
  {
    icon: BriefcaseIcon,
    title: "Internship Applications",
    description:
      "Land your first internship by presenting coursework, projects, and skills in a format that hiring managers at competitive companies actually want to see. Our templates put your strongest qualifications front and center, even when your work history is limited. Tailor each application with role-specific keywords to maximize your chances of getting past automated screening.",
  },
  {
    icon: BuildingOfficeIcon,
    title: "First Full-Time Job",
    description:
      "Transition from student to professional with a resume that highlights the real-world skills you developed during college. Our AI helps you translate academic achievements, part-time work, and campus involvement into the professional language that employers use in job descriptions. Present yourself as a capable, job-ready candidate from day one.",
  },
  {
    icon: BookOpenIcon,
    title: "Graduate School Applications",
    description:
      "Academic CVs and graduate school resumes follow different conventions than industry resumes. Emphasize research experience, publications, teaching assistantships, and relevant coursework in a structured format that admissions committees expect. Our builder helps you organize your academic accomplishments clearly and comprehensively.",
  },
  {
    icon: UserGroupIcon,
    title: "Career Fairs & Networking Events",
    description:
      "Walk into your next career fair with a polished, printed resume that makes a strong first impression. A clean, well-organized resume signals professionalism and preparation to recruiters who review hundreds of candidates in a single day. Stand out from the crowd with a document that is easy to scan and impossible to ignore.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "What should I put on my resume if I have no work experience?",
    answer:
      "Focus on your education, coursework, academic projects, volunteer work, extracurricular activities, and any skills or certifications you have earned. Employers hiring students and recent graduates understand that you may not have extensive professional experience. They are looking for evidence of initiative, problem-solving ability, and relevant skills. A well-structured resume that highlights these elements can be just as effective as one with years of work history.",
  },
  {
    question: "How long should a student resume be?",
    answer:
      "One page is the standard for students and recent graduates. Hiring managers and recruiters reviewing entry-level candidates expect a single page that is concise, well-organized, and relevant to the position. If you are applying to graduate school or an academic research position, a longer CV format may be appropriate, but for internships and entry-level jobs, keep it to one page.",
  },
  {
    question: "Should I include my GPA on my resume?",
    answer:
      "Include your GPA if it is 3.0 or higher on a 4.0 scale. If your major GPA is significantly higher than your cumulative GPA, you can list your major GPA instead or list both. If your GPA is below 3.0, it is generally better to leave it off your resume entirely. Some employers in competitive industries like finance and consulting specifically look for a strong GPA, so check the job description for any stated requirements.",
  },
  {
    question: "How do I make my resume stand out as a student?",
    answer:
      "Tailor your resume to each specific role by matching your skills and experience to the job description. Use strong action verbs and include quantifiable results wherever possible. Even small numbers make a difference. Instead of writing that you helped organize events, write that you coordinated logistics for 5 campus events with over 200 attendees each. Specificity and relevance are what make a student resume memorable.",
  },
  {
    question: "Is the resume builder actually free for students?",
    answer:
      "Yes. You can create your first resume completely free with access to basic templates, ATS-optimized formatting, and PDF downloads. The free plan is designed to give students everything they need to build a strong, professional resume without any cost. If you want access to all premium templates, AI content suggestions, unlimited resumes, and cover letter generation, you can upgrade to our Pro plan at any time.",
  },
  {
    question: "What resume format is best for students?",
    answer:
      "A reverse-chronological format with your education section listed first is the most effective layout for students and recent graduates. This format puts your most recent and relevant qualifications at the top of the page where recruiters will see them immediately. Within each section, list items from most recent to oldest. Our student-optimized templates automatically use this structure.",
  },
  {
    question: "Can I use this resume builder for internship applications?",
    answer:
      "Absolutely. Our builder is specifically designed to help students create resumes for internship applications, entry-level positions, graduate school, and career fairs. The templates emphasize education, projects, and skills, which are exactly the sections that matter most for internship roles. You can also create multiple versions of your resume tailored to different companies or industries without starting over each time.",
  },
  {
    question: "How does the AI help me write better bullet points?",
    answer:
      "The AI analyzes your existing bullet points and suggests rewrites that are more specific, action-oriented, and results-focused. For example, if you write that you were responsible for social media, the AI might suggest that you created and scheduled 15 posts per week across three platforms, increasing follower engagement by 25 percent. It draws on best practices for resume writing and adapts its suggestions to match the industry and role you are targeting.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ResumeBuilderForStudentsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---- Hero ---- */}
        <PageHero
          badge="Student Resume Builder"
          heading={
            <>
              Build a Professional Resume{" "}
              <span className="text-muted-foreground">
                Even Without Work Experience
              </span>
            </>
          }
          description="Creating your first resume feels overwhelming when you don't have years of professional experience to draw from. Our AI-powered resume builder helps students and recent graduates highlight coursework, projects, internships, and skills in a format that actually gets interviews."
          ctaLabel="Build My Student Resume"
          ctaHref="/sign-up"
          secondaryCtaLabel="See what to include"
          secondaryCtaHref="#what-to-include"
        />

        {/* ---- The Student Challenge ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="student-challenge"
            ariaLabelledBy="student-challenge-heading"
          >
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                id="student-challenge-heading"
                badge="The Challenge"
                heading="Why Building a Resume as a Student Feels Impossible"
                description="You are not alone. Most students face the same frustrating cycle when they start applying for internships and jobs."
              />
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Every job posting asks for experience, but you need a job to get
                  experience. It is the most common catch-22 in the job market, and
                  it hits students and recent graduates the hardest. You open a blank
                  document, stare at the empty page, and wonder what you could
                  possibly write that would compete with candidates who have years of
                  professional work behind them.
                </p>
                <p>
                  The truth is that you already have more relevant experience than
                  you think. The coursework you completed, the group projects you
                  led, the part-time jobs where you developed real skills, the
                  volunteer work that taught you leadership and responsibility, and
                  the extracurricular activities that shaped your character all
                  belong on your resume. The challenge is not a lack of content. It
                  is knowing how to present what you have done in a way that
                  resonates with employers.
                </p>
                <p>
                  <BrandName /> was built to solve exactly this problem. Our
                  student-focused resume builder guides you through every section,
                  helps you identify and articulate your strengths, and produces a
                  polished, ATS-optimized document that positions you as a serious
                  candidate, regardless of where you are in your career journey.
                </p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- What to Include (6 cards) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="default"
            id="what-to-include"
            ariaLabelledBy="what-to-include-heading"
          >
            <SectionHeader
              id="what-to-include-heading"
              badge="Resume Content"
              heading="What to Put on Your Resume as a Student"
              description="You have more to work with than you think. Here are six categories of experience that employers actively look for on student resumes."
            />
            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {resumeSections.map((section, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <section.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {section.description}
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
              badge="How It Works"
              heading="From Blank Page to Finished Resume in Minutes"
              description="Our guided builder walks you through every step so you never have to figure out what goes where or how to phrase it."
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
              heading="Tools Designed for Student Success"
              description="Go beyond a basic template with intelligent features that help you compete for the roles you actually want."
            />
            <div className="mt-14">
              <FeatureShowcase features={showcaseFeatures} />
            </div>
          </SectionWrapper>
        </motion.div>

        {/* ---- Use Cases (4 cards) ---- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper
            background="muted"
            id="use-cases"
            ariaLabelledBy="use-cases-heading"
          >
            <SectionHeader
              id="use-cases-heading"
              badge="Use Cases"
              heading="One Builder, Every Student Scenario"
              description="Whether you are chasing an internship, preparing for graduation, or heading to a career fair, we have you covered."
            />
            <motion.div
              className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-6"
                  variants={staggerItem}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <useCase.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {useCase.description}
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
          heading="Student Resume Builder FAQ"
          description="Answers to the most common questions students and recent graduates have about building their first resume."
          faqs={faqs}
          id="student-faq"
        />

        {/* ---- CTA Banner ---- */}
        <SectionWrapper background="primary" padding="md">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
              Your Experience Is Enough. Let Us Help You Prove It.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Thousands of students have used <BrandName /> to land internships,
              first jobs, and graduate school acceptances. Stop staring at a blank
              page and start building a resume that opens doors.
            </p>
            <div className="mt-8 flex justify-center">
              <InlineCTA
                variant="secondary"
                signedOutLabel="Build My Student Resume Now"
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
