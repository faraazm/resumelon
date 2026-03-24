"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar, Footer } from "@/components/marketing";
import { SectionWrapper } from "@/components/marketing/section-wrapper";

const lastUpdated = "March 23, 2026";

export function TermsPage() {
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
        <SectionWrapper background="default" padding="lg" maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>

            <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
              <p>
                Welcome to resumelon. By accessing or using our website and
                services, you agree to be bound by these Terms of Service. If
                you do not agree to these terms, please do not use our
                services.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By creating an account or using any part of the resumelon
                platform, you acknowledge that you have read, understood, and
                agree to be bound by these Terms of Service and our{" "}
                <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  Privacy Policy
                </Link>
                .
              </p>

              <h2>2. Description of Service</h2>
              <p>
                resumelon provides an AI-powered resume and cover letter
                builder that helps users create, customize, and optimize
                professional documents for job applications. Our services
                include resume creation, AI-assisted content generation,
                template selection, and document export.
              </p>

              <h2>3. User Accounts</h2>
              <ul>
                <li>
                  You must provide accurate and complete information when
                  creating an account.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </li>
                <li>
                  You are responsible for all activities that occur under your
                  account.
                </li>
                <li>
                  You must be at least 16 years of age to use our services.
                </li>
              </ul>

              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use the service for any unlawful purpose or in violation of
                  any applicable laws or regulations.
                </li>
                <li>
                  Submit false, misleading, or fraudulent information in your
                  resumes or cover letters.
                </li>
                <li>
                  Attempt to gain unauthorized access to any part of the
                  service, other accounts, or related systems.
                </li>
                <li>
                  Use automated tools, bots, or scrapers to access or interact
                  with the service without our written consent.
                </li>
                <li>
                  Reproduce, redistribute, or resell any part of the service
                  without authorization.
                </li>
              </ul>

              <h2>5. Intellectual Property</h2>
              <p>
                The resumelon platform, including its design, code, templates,
                and branding, is owned by resumelon and protected by
                intellectual property laws. You retain ownership of the content
                you create using our service (your resume text, personal
                information, etc.). By using our templates and AI features, you
                are granted a personal, non-exclusive license to use the
                generated output for your own job applications.
              </p>

              <h2>6. Subscriptions and Payments</h2>
              <ul>
                <li>
                  Free accounts have access to limited features as described on
                  our pricing page.
                </li>
                <li>
                  Paid subscriptions are billed on a recurring basis (monthly or
                  yearly) and auto-renew unless cancelled.
                </li>
                <li>
                  You may cancel your subscription at any time through your
                  account settings. Cancellation takes effect at the end of
                  your current billing period.
                </li>
                <li>
                  Refunds are handled on a case-by-case basis. Please{" "}
                  <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    contact us
                  </Link>{" "}
                  if you have a billing concern.
                </li>
              </ul>

              <h2>7. AI-Generated Content</h2>
              <p>
                resumelon uses artificial intelligence to assist in generating
                resume and cover letter content. While we strive for high
                quality, AI-generated content may contain errors or
                inaccuracies. You are responsible for reviewing and verifying
                all content before using it in job applications. resumelon
                does not guarantee that AI-generated content will result in
                employment outcomes.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                resumelon is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, either express
                or implied. We do not guarantee that the service will be
                uninterrupted, error-free, or that it will meet your specific
                requirements. To the fullest extent permitted by law,
                resumelon shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your
                use of the service.
              </p>

              <h2>9. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at
                any time if you violate these terms or engage in activity that
                is harmful to the service or other users. You may delete your
                account at any time, which will remove your data from our
                systems.
              </p>

              <h2>10. Changes to These Terms</h2>
              <p>
                We may update these Terms of Service from time to time. When we
                make changes, we will update the &ldquo;Last updated&rdquo;
                date at the top of this page. Continued use of the service
                after changes are posted constitutes acceptance of the revised
                terms.
              </p>

              <h2>11. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  contact us
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}
