"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/marketing";
import { SectionWrapper } from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <SectionWrapper background="default" padding="lg">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question, suggestion, or need help? We&apos;d love to hear from
              you.
            </p>
          </motion.div>
        </SectionWrapper>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SectionWrapper background="muted" padding="md">
            <div className="mx-auto max-w-4xl grid gap-12 lg:grid-cols-5">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Get in Touch
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Fill out the form and our team will get back to you within
                    24–48 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <a
                        href="mailto:faraaz.codes@gmail.com"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        faraaz.codes@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Support</p>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 1 business day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        maxLength={200}
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={320}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      maxLength={500}
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      maxLength={5000}
                      rows={5}
                      placeholder="Tell us more..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </SectionWrapper>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
