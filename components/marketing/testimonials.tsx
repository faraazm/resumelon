"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";
import { StarIcon } from "@heroicons/react/24/solid";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I applied to 120 jobs in 2 days and got 8 interviews. resumeclone completely changed my job search.",
    name: "Sarah M.",
    role: "Software Engineer",
    rating: 5,
  },
  {
    quote:
      "As a new grad, I had no idea how to tailor my resume. resumeclone made it effortless—I landed my first role in 3 weeks.",
    name: "James L.",
    role: "Recent Graduate",
    rating: 5,
  },
  {
    quote:
      "resumeclone saved me during recruiting season. I went from zero callbacks to multiple offers.",
    name: "Priya K.",
    role: "Product Manager",
    rating: 5,
  },
  {
    quote:
      "I was spending entire weekends rewriting resumes. Now I generate a tailored resume in under 2 minutes. Game changer.",
    name: "Marcus D.",
    role: "Marketing Manager",
    rating: 5,
  },
  {
    quote:
      "The ATS optimization actually works. I started getting recruiter calls within a week of switching to resumeclone.",
    name: "Emily R.",
    role: "Data Analyst",
    rating: 5,
  },
  {
    quote:
      "Switching careers felt impossible until I found resumeclone. It helped me reframe my experience perfectly for a new industry.",
    name: "David T.",
    role: "Career Switcher",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.article
      className="rounded-xl border border-border bg-card p-6 flex flex-col"
      variants={itemVariants}
    >
      <div className="flex gap-0.5 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <StarIcon key={i} className="h-4 w-4 text-amber-400" aria-hidden="true" />
        ))}
      </div>
      <blockquote className="flex-1 text-foreground leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </motion.article>
  );
}

export function Testimonials() {
  return (
    <SectionWrapper background="default" id="testimonials" ariaLabelledBy="testimonials-heading">
      <SectionHeader
        id="testimonials-heading"
        heading="Real Results from Real Job Seekers"
        description="Thousands of job seekers have landed interviews faster with resumeclone. Here's what they have to say."
      />

      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
