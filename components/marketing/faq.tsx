"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Why should I use an online resume builder?",
    answer:
      "An online resume builder like niceresume saves you hours of formatting headaches. You get professional, ATS-optimized templates, real-time previews, and AI-powered suggestions—all without needing design skills. Plus, your resume is stored in the cloud so you can access and update it from anywhere.",
  },
  {
    question: "Why is niceresume the best free online resume builder?",
    answer:
      "niceresume combines professional templates, ATS optimization, and an intuitive interface—all available for free. Unlike other builders that lock basic features behind paywalls, we let you create and download one complete resume at no cost. Our Pro plan adds unlimited resumes, premium templates, and AI features for power users.",
  },
  {
    question: "Do I need a different resume for every new job application?",
    answer:
      "While you don't need a completely different resume for each job, tailoring your resume to match each job description significantly increases your chances. Highlight relevant skills and experience that match what the employer is looking for. niceresume Pro makes this easy with our job tailoring feature.",
  },
  {
    question: "Are niceresume templates ATS-friendly?",
    answer:
      "Yes, 100%. Every niceresume template is designed from the ground up to be ATS-compatible. We use clean formatting, standard fonts, proper heading structures, and text-based PDFs that parse correctly through any Applicant Tracking System.",
  },
  {
    question: "Is the niceresume resume builder really free?",
    answer:
      "Yes! You can create one resume, choose from our basic templates, and download it as a PDF completely free. No credit card required. Our Pro plan ($19.99/month or $99.99/year) unlocks unlimited resumes, all premium templates, AI writing assistance, and more.",
  },
  {
    question: "Can I download my resume in different formats?",
    answer:
      "Free users can download their resume as a PDF. Pro users can also download in DOCX format for easy editing in Microsoft Word or Google Docs. All downloads maintain the formatting and ATS compatibility of your resume.",
  },
  {
    question: "How do I choose the right resume template?",
    answer:
      "Consider your industry and experience level. Creative fields can use more modern designs, while traditional industries (finance, law) benefit from classic layouts. When in doubt, choose a clean, minimal template—they work universally and are always ATS-safe.",
  },
  {
    question: "What's the difference between a resume and a CV?",
    answer:
      "A resume is a concise 1-2 page summary of your relevant experience, tailored to each job. A CV (Curriculum Vitae) is a comprehensive document listing your entire academic and professional history. In the US, resumes are standard for most jobs; CVs are used primarily in academia and research.",
  },
  {
    question: "Can I use your resume templates in non-US regions?",
    answer:
      "Absolutely! While our templates follow US resume conventions, they work well internationally. Many countries have similar expectations for professional resumes. If you need a CV format or region-specific features, our Pro plan offers templates optimized for different markets.",
  },
  {
    question: "Is niceresume a secure and trustworthy platform?",
    answer:
      "Yes. We use industry-standard encryption to protect your data, never share your information with third parties, and comply with GDPR and other privacy regulations. You can delete your account and all associated data at any time.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-16 sm:py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="faq-heading"
            className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about NiceResume
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
