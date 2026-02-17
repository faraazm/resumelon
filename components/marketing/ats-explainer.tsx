import {
  CheckCircleIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  QueueListIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const atsFeatures = [
  {
    icon: DocumentTextIcon,
    title: "Text-Based PDFs",
    description: "Machine-readable text, not images, so ATS can parse every word",
  },
  {
    icon: QueueListIcon,
    title: "Standard Headings",
    description:
      "Proper section labels like 'Experience' and 'Education' that ATS expects",
  },
  {
    icon: Cog6ToothIcon,
    title: "Clean Structure",
    description: "No tables, columns, or graphics that confuse parsing systems",
  },
  {
    icon: ArrowPathIcon,
    title: "Correct Reading Order",
    description:
      "Content flows logically so your information is extracted accurately",
  },
];

export function ATSExplainer() {
  return (
    <section id="ats" className="bg-muted/30 py-16 sm:py-24" aria-labelledby="ats-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Explanation */}
          <div>
            <h2
              id="ats-heading"
              className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl"
            >
              Why <span className="text-primary">ATS</span> matters
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
              cause your resume to be misread or rejected entirely.
            </p>
            <p className="mt-4 text-muted-foreground">
              <strong className="text-foreground">NiceResume</strong> solves
              this by generating clean, ATS-optimized PDFs that pass through
              these systems perfectly while still looking professional to human
              recruiters.
            </p>
          </div>

          {/* Right side - Features */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              How NiceResume keeps you ATS-friendly
            </h3>
            <div className="space-y-6">
              {atsFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100" aria-hidden="true">
                    <feature.icon className="h-5 w-5 text-green-600" />
                  </div>
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
                with NiceResume is guaranteed to parse correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
