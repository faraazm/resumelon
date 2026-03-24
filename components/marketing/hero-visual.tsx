"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  TemplateRenderer,
  getTemplate,
  ResumeData,
} from "@/lib/templates";

const sampleResumeData: ResumeData = {
  personalDetails: {
    firstName: "Sarah",
    lastName: "Anderson",
    jobTitle: "Senior Product Manager",
  },
  contact: {
    email: "sarah.anderson@email.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/sarahanderson",
    location: "San Francisco, CA",
  },
  summary:
    "Results-driven product manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement by 40% and driving $2M+ in revenue growth through strategic product initiatives. Expert in agile methodologies, data-driven decision making, and stakeholder management.",
  experience: [
    {
      id: "1",
      title: "Senior Product Manager",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Led product strategy for flagship SaaS platform serving 500K+ users across 45 countries",
        "Increased user retention by 35% through data-driven feature prioritization and A/B testing",
        "Managed $3M annual product budget and cross-functional team of 12 engineers and 4 designers",
        "Launched AI-powered recommendation engine resulting in 28% increase in conversion rates",
        "Established product analytics framework tracking 50+ KPIs across the customer journey",
      ],
    },
    {
      id: "2",
      title: "Product Manager",
      company: "Digital Solutions Co.",
      location: "New York, NY",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Launched 3 major product features generating $1.5M in new annual recurring revenue",
        "Collaborated with UX team to redesign mobile app, improving NPS score by 25 points",
        "Built and maintained product roadmap aligned with company OKRs and customer feedback",
        "Conducted 100+ customer interviews to inform product development priorities",
      ],
    },
    {
      id: "3",
      title: "Associate Product Manager",
      company: "StartupXYZ",
      location: "Boston, MA",
      startDate: "2016",
      endDate: "2018",
      current: false,
      bullets: [
        "Supported launch of B2B marketplace connecting 1,000+ vendors with enterprise clients",
        "Wrote detailed product requirements documents and user stories for engineering team",
        "Analyzed user behavior data to identify opportunities for product improvements",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "MBA, Product Management",
      school: "Stanford Graduate School of Business",
      startDate: "2016",
      endDate: "2018",
    },
    {
      id: "2",
      degree: "B.S. Computer Science",
      school: "University of California, Berkeley",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  skills: [
    "Product Strategy",
    "Agile/Scrum",
    "Data Analysis",
    "User Research",
    "Roadmapping",
    "A/B Testing",
    "SQL",
    "Figma",
    "Jira",
    "Python",
    "Tableau",
    "Stakeholder Management",
  ],
};

const leftBadges = [
  {
    icon: DocumentTextIcon,
    text: "Write and format easily",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    text: "Tailor to any job",
  },
  {
    icon: ShieldCheckIcon,
    text: "Pass AI screening",
  },
];

export function HeroVisual() {
  const template = getTemplate("bold-modern");

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center pl-6 sm:pl-8 lg:pl-10 pr-4 sm:pr-0">
      {/* Wrapper for positioning badges relative to container */}
      <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] aspect-square">
        {/* Main container with pastel background - clips the resume */}
        <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 shadow-sm overflow-hidden">
          {/* Resume - tilted and positioned within container */}
          <motion.div
            className="absolute top-[4%] sm:top-[6%] left-[10%] sm:left-[12%] z-0"
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.18))",
            }}
          >
            {/* Mobile size */}
            <div className="block sm:hidden">
              <div
                className="bg-white rounded-lg overflow-hidden border border-gray-200/80"
                style={{ width: "320px", height: "414px" }}
              >
                <div
                  className="origin-top-left"
                  style={{
                    width: "816px",
                    height: "1056px",
                    transform: "scale(0.392)",
                  }}
                >
                  <TemplateRenderer
                    data={sampleResumeData}
                    template={template}
                    headingFontId="montserrat"
                    bodyFontId="opensans"
                  />
                </div>
              </div>
            </div>
            {/* Tablet size */}
            <div className="hidden sm:block lg:hidden">
              <div
                className="bg-white rounded-lg overflow-hidden border border-gray-200/80"
                style={{ width: "400px", height: "518px" }}
              >
                <div
                  className="origin-top-left"
                  style={{
                    width: "816px",
                    height: "1056px",
                    transform: "scale(0.49)",
                  }}
                >
                  <TemplateRenderer
                    data={sampleResumeData}
                    template={template}
                    headingFontId="montserrat"
                    bodyFontId="opensans"
                  />
                </div>
              </div>
            </div>
            {/* Desktop size */}
            <div className="hidden lg:block">
              <div
                className="bg-white rounded-lg overflow-hidden border border-gray-200/80"
                style={{ width: "480px", height: "621px" }}
              >
                <div
                  className="origin-top-left"
                  style={{
                    width: "816px",
                    height: "1056px",
                    transform: "scale(0.588)",
                  }}
                >
                  <TemplateRenderer
                    data={sampleResumeData}
                    template={template}
                    headingFontId="montserrat"
                    bodyFontId="opensans"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Left floating badges - outside overflow container */}
        <div className="absolute -left-6 sm:-left-8 lg:-left-12 top-4 sm:top-6 lg:top-8 flex flex-col gap-1.5 sm:gap-2 z-20">
          {leftBadges.map((badge, index) => (
            <motion.div
              key={badge.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white whitespace-nowrap"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <badge.icon className="w-4 h-4 shrink-0 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                {badge.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Highlighted badge - outside overflow container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="absolute -left-4 sm:-left-6 lg:-left-8 -bottom-3 sm:-bottom-4 lg:-bottom-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 whitespace-nowrap z-20"
          style={{
            boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15), 0 2px 8px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <DocumentTextIcon className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            Get 3x more interviews
          </span>
        </motion.div>

        {/* Right floating badges - outside overflow container */}
        <div className="absolute -right-4 sm:-right-6 lg:-right-10 bottom-12 sm:bottom-16 lg:bottom-20 flex flex-col gap-1.5 sm:gap-2 z-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white whitespace-nowrap"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <span className="text-xs font-medium text-gray-700">
              ATS-ready format
            </span>
            <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white whitespace-nowrap"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <span className="text-xs font-medium text-gray-700">
              Tailor to jobs with AI
            </span>
            <CheckCircleIcon className="w-4 h-4 text-violet-500 shrink-0" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
