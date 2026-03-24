import {
  DocumentCheckIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { BrandName } from "./logo";

const features = [
  {
    icon: DocumentCheckIcon,
    title: "ATS-Safe Formatting",
    description:
      "Every resume is structured to pass Applicant Tracking Systems. Your application will be parsed correctly and ranked higher, every time.",
  },
  {
    icon: EyeIcon,
    title: "Live Preview",
    description:
      "See your changes in real-time as you type. No more guessing what your final resume will look like before downloading.",
  },
  {
    icon: ArrowUpTrayIcon,
    title: "Resume Import",
    description:
      "Upload an existing resume and we'll automatically parse and organize your information. Start tailoring in seconds, not hours.",
  },
  {
    icon: SparklesIcon,
    title: "AI Keyword Matching",
    description:
      "Our AI analyzes each job description and optimizes your resume with the right keywords, skills, and phrasing to match.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Job-Specific Tailoring",
    description:
      "Paste a job description and generate a resume customized for that exact role. Every application is unique and targeted.",
  },
  {
    icon: ArrowDownTrayIcon,
    title: "PDF & DOCX Export",
    description:
      "Download your polished resume as a high-quality PDF or DOCX with one click. No watermarks, no limitations. Ready to send.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Privacy & Security",
    description:
      "Your data is encrypted and never shared with third parties. We take your privacy as seriously as you take your career.",
  },
  {
    icon: ClockIcon,
    title: "Version Management",
    description:
      "Keep track of every resume version. Duplicate, edit, and manage all your tailored resumes from one organized dashboard.",
  },
];

export function FeatureGrid() {
  return (
    <SectionWrapper background="muted" id="feature-grid" ariaLabelledBy="feature-grid-heading">
      <SectionHeader
        id="feature-grid-heading"
        heading={
          <>
            The advantages of using <BrandName className="text-primary" />
          </>
        }
        description="Everything you need to create winning resumes that get you more interviews."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
            role="listitem"
          >
            <feature.icon className="mb-4 h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mb-2 font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
