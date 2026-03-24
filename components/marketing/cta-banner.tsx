"use client";

import { SectionWrapper } from "./section-wrapper";
import { InlineCTA } from "./inline-cta";

export function CTABanner() {
  return (
    <SectionWrapper background="primary" padding="md">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tighter text-primary-foreground sm:text-4xl">
          Stop Rewriting Resumes. Start Getting Interviews.
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/80">
          Join thousands of job seekers who have landed their dream jobs with
          resumelon. Every day you wait is another missed opportunity.
        </p>
        <div className="mt-8 flex justify-center">
          <InlineCTA
            variant="secondary"
            signedOutLabel="Generate Your First Resume Now"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
