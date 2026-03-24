import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
  capture_exceptions: true,
  session_recording: {
    maskAllInputs: false,
    maskInputOptions: {
      password: true,
    },
  },
  debug: process.env.NODE_ENV === "development",
});
