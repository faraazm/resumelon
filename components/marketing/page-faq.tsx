"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";

export interface FAQItem {
  question: string;
  answer: string;
}

interface PageFAQProps {
  heading?: string;
  description?: string;
  faqs: FAQItem[];
  id?: string;
}

export function PageFAQ({
  heading = "Frequently Asked Questions",
  description,
  faqs,
  id = "faq",
}: PageFAQProps) {
  return (
    <SectionWrapper background="default" id={id} ariaLabelledBy={`${id}-heading`} maxWidth="sm">
      <SectionHeader
        id={`${id}-heading`}
        heading={heading}
        description={description}
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
