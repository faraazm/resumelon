"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing";
import { Footer } from "@/components/marketing";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { SectionHeader } from "@/components/marketing/section-header";
import {
  RocketLaunchIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const values = [
  {
    icon: RocketLaunchIcon,
    title: "Speed at Scale",
    description:
      "Job searching is a numbers game. We build tools that let you apply to more roles, faster, without cutting corners on quality.",
  },
  {
    icon: UserGroupIcon,
    title: "Built for Everyone",
    description:
      "Whether you're a student, career switcher, or seasoned professional — resumeclone adapts to your experience level and goals.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Privacy First",
    description:
      "Your data is yours. We use industry-standard encryption, never sell your information, and you can delete everything at any time.",
  },
  {
    icon: HeartIcon,
    title: "Genuinely Helpful",
    description:
      "We're job seekers too. Every feature we build comes from real frustration with the hiring process — and a desire to fix it.",
  },
];

export function AboutPage() {
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
        {/* Hero */}
        <SectionWrapper background="default" padding="lg">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
              About resumeclone
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We started resumeclone because applying to jobs shouldn't be
              harder than the job itself. The traditional process — rewriting
              resumes for every listing, guessing at ATS keywords, crafting
              cover letters from scratch — is broken. We're here to fix it.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* Mission */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper background="muted">
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                heading="Our Mission"
                description="To eliminate the busywork of job applications so you can focus on what actually matters — preparing for interviews and finding the right role."
              />
              <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every year, millions of qualified candidates get filtered out
                  by Applicant Tracking Systems before a human ever reads their
                  resume. Meanwhile, job seekers spend 2–3 hours per application
                  tweaking formatting and rewriting bullet points — only to hear
                  nothing back.
                </p>
                <p>
                  resumeclone uses AI to generate tailored, ATS-optimized
                  resumes and cover letters for every job description you
                  target. Upload your base resume once, paste the job listings
                  you care about, and get customized applications ready to send
                  in seconds.
                </p>
                <p>
                  We believe the playing field should be level. Whether you're a
                  first-generation college student or a senior executive,
                  everyone deserves tools that make their application as strong
                  as possible.
                </p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>

        {/* Values */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper background="default">
            <SectionHeader
              heading="What We Stand For"
              description="The principles that guide every feature we build."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <value.icon className="mb-4 h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </motion.div>

        {/* Stats / Social Proof */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.4 }}
        >
          <SectionWrapper background="muted" padding="md">
            <div className="mx-auto max-w-4xl grid gap-8 sm:grid-cols-3 text-center">
              <div>
                <p className="text-4xl font-bold text-foreground">10,000+</p>
                <p className="mt-1 text-sm text-muted-foreground">Job seekers served</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground">50,000+</p>
                <p className="mt-1 text-sm text-muted-foreground">Resumes generated</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground">100%</p>
                <p className="mt-1 text-sm text-muted-foreground">ATS compatible</p>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
