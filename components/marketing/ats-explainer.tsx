import {
  CheckCircleIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  QueueListIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { SectionWrapper } from "./section-wrapper";
import { BrandName } from "./logo";

const atsFeatures = [
  {
    icon: DocumentTextIcon,
    title: "Text-Based PDFs",
    description: "Machine-readable text, not images, so ATS can parse every word of your resume accurately",
  },
  {
    icon: QueueListIcon,
    title: "Standard Headings",
    description:
      "Proper section labels like 'Experience' and 'Education' that ATS systems expect and can categorize correctly",
  },
  {
    icon: Cog6ToothIcon,
    title: "Clean Structure",
    description: "No tables, columns, or graphics that confuse parsing systems and cause your resume to be misread",
  },
  {
    icon: ArrowPathIcon,
    title: "Correct Reading Order",
    description:
      "Content flows logically so your information is extracted accurately and presented to recruiters in the right order",
  },
];

export function ATSExplainer() {
  return (
    <SectionWrapper background="muted" id="ats" ariaLabelledBy="ats-heading">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left side - Explanation */}
        <div>
          <h2
            id="ats-heading"
            className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl"
          >
            Why <span className="text-primary">ATS</span> Optimization Matters
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Over 90% of large companies use Applicant Tracking Systems to
            filter resumes before a human ever sees them. If your resume isn't
            ATS-friendly, it might never reach a recruiter—no matter how
            qualified you are.
          </p>
          <p className="mt-4 text-muted-foreground">
            ATS software scans resumes for keywords, formatting, and
            structure. Fancy designs, unusual fonts, or complex layouts can
            cause your resume to be misread or rejected entirely. Most
            applicants never realize their resume was filtered out before
            anyone read it.
          </p>
          <p className="mt-4 text-muted-foreground">
            <BrandName className="text-foreground" />{" "}
            solves this by generating clean, ATS-optimized PDFs that pass through
            these systems perfectly while still looking professional to human
            recruiters. Every template, every export, every time.
          </p>
        </div>

        {/* Right side - Features */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="mb-6 text-lg font-semibold text-foreground inline-flex items-center gap-1.5 flex-wrap">
            How <BrandName /> keeps you ATS-friendly
          </h3>
          <div className="space-y-6">
            {atsFeatures.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <feature.icon className="h-6 w-6 shrink-0 text-green-600 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-medium text-foreground" id={`ats-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-lg bg-green-50 p-4" role="status">
            <CheckCircleIcon className="h-6 w-6 shrink-0 text-green-600" aria-hidden="true" />
            <p className="text-sm text-green-800">
              <strong>100% ATS compatible.</strong> Every resume you create
              with resumeclone is guaranteed to parse correctly through any
              Applicant Tracking System.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
