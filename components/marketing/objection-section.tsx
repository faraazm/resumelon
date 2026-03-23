import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const objections = [
  {
    question: "Will this actually work?",
    answer:
      "Yes. Every resume is optimized for the ATS systems used by most Fortune 500 companies, mid-size firms, and startups. Our formatting passes the same parsers recruiters rely on.",
  },
  {
    question: "Will my resumes sound generic?",
    answer:
      "No. Each resume is tailored to the specific job description you provide. Keywords, skills, and phrasing are customized so every application reads like it was written for that exact role.",
  },
  {
    question: "Do I need to manually edit everything?",
    answer:
      "Not at all. Your resumes are generated ready to send. You can make edits if you want to, but you don't have to. Most users download and apply immediately.",
  },
  {
    question: "Is this just another generic AI tool?",
    answer:
      "No. resumeclone is purpose-built for job applications at scale. Unlike general AI writing tools, every feature is designed specifically to help you get past ATS filters and land more interviews.",
  },
];

export function ObjectionSection() {
  return (
    <SectionWrapper background="default" id="objections" ariaLabelledBy="objections-heading">
      <SectionHeader
        id="objections-heading"
        heading="Still Thinking About It?"
        description="We get it. Here are answers to the most common concerns."
      />

      <div className="mt-12 mx-auto max-w-3xl space-y-6">
        {objections.map((objection) => (
          <div
            key={objection.question}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="h-6 w-6 shrink-0 text-emerald-500 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground">
                  &ldquo;{objection.question}&rdquo;
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {objection.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
