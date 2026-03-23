"use client";

import { SectionWrapper } from "./section-wrapper";
import { InlineCTA } from "./inline-cta";

export function UrgencyCTA() {
  return (
    <SectionWrapper background="primary" padding="sm">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tighter text-primary-foreground sm:text-3xl">
          Your Next Interview Is One Click Away
        </h2>
        <p className="mt-3 text-primary-foreground/80">
          Every day you delay is another missed opportunity. Start applying smarter today.
        </p>
        <div className="mt-6 flex justify-center">
          <InlineCTA
            variant="secondary"
            signedOutLabel="Start Applying Smarter Today"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
