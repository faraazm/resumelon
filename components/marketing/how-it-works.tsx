import {
  ClipboardDocumentListIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    step: "1",
    icon: ClipboardDocumentListIcon,
    title: "Add your information",
    description:
      "Fill in your details using our guided form, or import an existing resume. We'll organize everything perfectly.",
  },
  {
    step: "2",
    icon: SparklesIcon,
    title: "Improve & tailor",
    description:
      "Choose a professional template. Our AI suggests improvements and helps tailor your resume for specific jobs.",
  },
  {
    step: "3",
    icon: ArrowDownTrayIcon,
    title: 'Click "Download"',
    description:
      "Export your ATS-optimized resume as a PDF. You're ready to apply and land that interview.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create your resume in 3 easy steps{" "}
            <span className="text-primary">now with AI</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No complicated software. No design skills needed. Just a few minutes
            to a professional resume.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-4xl font-bold text-muted-foreground/20">
                  {item.step}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
