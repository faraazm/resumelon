"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar, Footer } from "@/components/marketing";
import { SectionWrapper } from "@/components/marketing/section-wrapper";

const lastUpdated = "March 23, 2026";

export function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>

            <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
              <p>
                At resumelon, your privacy is important to us. This Privacy
                Policy explains how we collect, use, store, and protect your
                personal information when you use our website and services.
              </p>

              <h2>1. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Account Information:</strong> When you create an
                  account, we collect your name and email address through our
                  authentication provider.
                </li>
                <li>
                  <strong>Resume and Cover Letter Content:</strong> The
                  information you enter into your resumes and cover letters,
                  including personal details, work experience, education, and
                  skills.
                </li>
                <li>
                  <strong>Payment Information:</strong> If you subscribe to a
                  paid plan, payment processing is handled by Stripe. We do not
                  store your credit card details on our servers.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect anonymous usage
                  data such as pages visited, features used, and session
                  duration to improve our service.
                </li>
                <li>
                  <strong>Contact Form Submissions:</strong> If you contact us
                  through our website, we collect the name, email address, and
                  message content you provide.
                </li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and maintain the resumelon service.</li>
                <li>
                  Generate, customize, and optimize your resumes and cover
                  letters.
                </li>
                <li>Process payments and manage subscriptions.</li>
                <li>Respond to your inquiries and support requests.</li>
                <li>
                  Improve our service based on aggregated, anonymized usage
                  patterns.
                </li>
                <li>
                  Send important service-related communications (e.g., account
                  changes, security alerts).
                </li>
              </ul>

              <h2>3. Data Storage and Security</h2>
              <ul>
                <li>
                  Your data is stored using industry-standard encryption and
                  security practices.
                </li>
                <li>
                  We use trusted third-party services (Clerk for
                  authentication, Convex for database, Stripe for payments)
                  that maintain their own security standards and compliance
                  certifications.
                </li>
                <li>
                  We implement appropriate technical and organizational
                  measures to protect your data against unauthorized access,
                  alteration, or destruction.
                </li>
              </ul>

              <h2>4. Data Sharing</h2>
              <p>
                We do not sell, rent, or trade your personal information to
                third parties. We may share data only in the following
                circumstances:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  services that help us operate our platform (authentication,
                  database, payment processing, email delivery). These
                  providers are contractually obligated to protect your data.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law, court
                  order, or governmental authority, we may disclose your
                  information as necessary.
                </li>
              </ul>

              <h2>5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of the personal data
                  we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct any inaccurate
                  personal information.
                </li>
                <li>
                  <strong>Deletion:</strong> Delete your account and all
                  associated data at any time from your account settings.
                </li>
                <li>
                  <strong>Data Portability:</strong> Export your resume data
                  through our download features.
                </li>
                <li>
                  <strong>Objection:</strong> Object to the processing of your
                  data in certain circumstances.
                </li>
              </ul>

              <h2>6. Cookies</h2>
              <p>
                We use essential cookies to maintain your authentication
                session and provide core functionality. We may also use
                analytics cookies to understand how our service is used. You
                can control cookie preferences through your browser settings.
              </p>

              <h2>7. Children&apos;s Privacy</h2>
              <p>
                resumelon is not intended for use by individuals under the
                age of 16. We do not knowingly collect personal information
                from children. If we become aware that we have collected data
                from a child under 16, we will take steps to delete that
                information.
              </p>

              <h2>8. International Data Transfers</h2>
              <p>
                Your data may be processed in countries other than your country
                of residence. Our service providers maintain appropriate
                safeguards for international data transfers in compliance with
                applicable data protection laws.
              </p>

              <h2>9. Data Retention</h2>
              <p>
                We retain your personal data for as long as your account is
                active or as needed to provide you with our services. If you
                delete your account, we will remove your personal data from our
                systems within a reasonable timeframe, except where retention
                is required by law.
              </p>

              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we
                make changes, we will update the &ldquo;Last updated&rdquo;
                date at the top of this page. We encourage you to review this
                policy periodically. Continued use of the service after changes
                are posted constitutes acceptance of the revised policy.
              </p>

              <h2>11. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy or how we
                handle your data, please{" "}
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
