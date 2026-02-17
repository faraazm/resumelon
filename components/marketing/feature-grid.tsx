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

const features = [
  {
    icon: DocumentCheckIcon,
    title: "ATS-Safe Templates",
    description:
      "Every template is optimized for Applicant Tracking Systems. Your resume will be parsed correctly, every time.",
  },
  {
    icon: EyeIcon,
    title: "Live Preview",
    description:
      "See your changes in real-time as you type. No more guessing what your final resume will look like.",
  },
  {
    icon: ArrowUpTrayIcon,
    title: "Resume Import",
    description:
      "Upload an existing resume and we'll automatically parse and organize your information for you.",
  },
  {
    icon: SparklesIcon,
    title: "AI Content Rewrites",
    description:
      "Let AI enhance your bullet points and summary to sound more impactful and professional.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Job Tailoring",
    description:
      "Paste a job description and we'll help you tailor your resume to match the requirements.",
  },
  {
    icon: ArrowDownTrayIcon,
    title: "Instant PDF Download",
    description:
      "Download your polished resume as a high-quality PDF with one click. Ready to send.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Privacy & Security",
    description:
      "Your data is encrypted and never shared. We take your privacy seriously.",
  },
  {
    icon: ClockIcon,
    title: "Save Valuable Time",
    description:
      "Stop wrestling with formatting. Create a professional resume in minutes, not hours.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-muted/30 py-16 sm:py-24" aria-labelledby="advantages-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="advantages-heading"
            className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl"
          >
            The advantages of using{" "}
            <span className="text-primary">NiceResume</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to create a winning resume that gets you
            interviews.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
              role="listitem"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20" aria-hidden="true">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
