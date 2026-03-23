"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";

const faqs = [
  {
    question: "What is resumeclone?",
    answer:
      "resumeclone is an AI-powered resume builder that helps you create, tailor, and optimize resumes and cover letters for every job you apply to. Upload your base resume once, paste job descriptions, and instantly generate ATS-friendly, customized applications at scale.",
  },
  {
    question: "How does resumeclone work?",
    answer:
      "It's simple: upload your base resume or fill in your details, paste job descriptions you're interested in, and resumeclone's AI generates tailored resumes and cover letters optimized for each role. Every resume is formatted to pass ATS filters and ready to download as PDF or DOCX.",
  },
  {
    question: "Are resumeclone templates ATS-friendly?",
    answer:
      "Yes, 100%. Every resumeclone template is designed from the ground up to be ATS-compatible. We use clean formatting, standard fonts, proper heading structures, and text-based PDFs that parse correctly through any Applicant Tracking System used by employers.",
  },
  {
    question: "Can I customize my resumes after they're generated?",
    answer:
      "Absolutely. While every generated resume is ready to send immediately, you have full control to edit any section, adjust wording, reorder content, or customize the design. Think of the AI output as a strong first draft that you can refine to your liking.",
  },
  {
    question: "Does resumeclone generate cover letters?",
    answer:
      "Yes. resumeclone Pro generates personalized cover letters for every application. Each cover letter is tailored to the job description and pulls relevant details from your resume, so it reads naturally and complements your application.",
  },
  {
    question: "How many resumes can I create?",
    answer:
      "Free users can create 1 resume with basic templates and PDF download. Pro users get unlimited resumes, all premium templates, AI suggestions, cover letters, and DOCX export—everything you need to mass apply at scale.",
  },
  {
    question: "Is resumeclone suitable for students and new graduates?",
    answer:
      "Yes. resumeclone is built for all job seekers—students applying to internships, new graduates entering the job market, career switchers, and experienced professionals. The AI adapts to your experience level and helps you present your background in the strongest way possible.",
  },
  {
    question: "Does resumeclone work for all industries?",
    answer:
      "Yes. Our templates and AI optimization work across all industries—tech, finance, healthcare, marketing, education, and more. The AI tailors your resume based on the specific job description, so it's always relevant to the role and industry you're targeting.",
  },
  {
    question: "Is the resumeclone resume builder really free?",
    answer:
      "Yes! You can create one resume, choose from basic templates, and download it as a PDF completely free. No credit card required. Our Pro plan ($19.99/month or $99.99/year) unlocks unlimited resumes, all premium templates, AI writing assistance, cover letters, and more.",
  },
  {
    question: "Is resumeclone a secure and trustworthy platform?",
    answer:
      "Yes. We use industry-standard encryption to protect your data, never share your information with third parties, and comply with GDPR and other privacy regulations. You can delete your account and all associated data at any time.",
  },
];

export function FAQ() {
  return (
    <SectionWrapper background="default" id="faq" ariaLabelledBy="faq-heading" maxWidth="sm">
      <SectionHeader
        id="faq-heading"
        heading="Frequently Asked Questions"
        description="Everything you need to know about resumeclone and how it can transform your job search."
      />

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
    </SectionWrapper>
  );
}
