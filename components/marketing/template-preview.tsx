"use client";

import {
  TemplateRenderer,
  getTemplate,
  type ResumeData,
} from "@/lib/templates";
import {
  CoverLetterRenderer,
  type CoverLetterData,
} from "@/lib/cover-letter/CoverLetterRenderer";

// ── Rich sample data ──────────────────────────────────────────────────────────

export const sampleResumeData: ResumeData = {
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
    "Results-driven product manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement by 40% and driving $2M+ in revenue growth through strategic product initiatives. Expert in agile methodologies, data-driven decision making, and stakeholder management across global organizations.",
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
        "Spearheaded migration to microservices architecture, reducing deployment time by 60%",
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
        "Reduced customer churn by 18% through targeted feature improvements and onboarding optimization",
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
        "Coordinated beta testing programs with 200+ early adopters and synthesized feedback into actionable roadmap items",
      ],
    },
    {
      id: "4",
      title: "Business Analyst Intern",
      company: "Global Consulting Group",
      location: "Chicago, IL",
      startDate: "2015",
      endDate: "2016",
      current: false,
      bullets: [
        "Supported due diligence for 3 M&A transactions totaling $450M in deal value",
        "Built financial models and market sizing analyses for Fortune 500 clients",
        "Presented strategic recommendations to C-suite executives at quarterly business reviews",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "MBA, Product Management & Strategy",
      school: "Stanford Graduate School of Business",
      startDate: "2016",
      endDate: "2018",
    },
    {
      id: "2",
      degree: "B.S. Computer Science, Minor in Economics",
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
    "Python",
    "Figma",
    "Jira",
    "Tableau",
    "Stakeholder Management",
    "Market Analysis",
    "OKRs",
    "Growth Strategy",
  ],
};

export const sampleCoverLetterData: CoverLetterData = {
  personalDetails: {
    firstName: "Sarah",
    lastName: "Anderson",
    jobTitle: "Senior Product Manager",
    email: "sarah.anderson@email.com",
    phone: "(555) 123-4567",
    address: "San Francisco, CA",
  },
  letterContent: {
    companyName: "Tech Corp",
    hiringManagerName: "Hiring Manager",
    content:
      "<p>Dear Hiring Manager,</p><p>I am writing to express my strong interest in the Senior Product Manager position at Tech Corp. With over 8 years of experience driving product strategy and leading cross-functional teams at companies like Tech Innovations Inc. and Digital Solutions Co., I am confident in my ability to make a significant and immediate impact on your product organization.</p><p>In my current role at Tech Innovations Inc., I lead the product strategy for a flagship SaaS platform serving over 500,000 users across 45 countries. Through data-driven feature prioritization and rigorous A/B testing, I increased user retention by 35% while managing a $3M annual budget. Most recently, I spearheaded the launch of an AI-powered recommendation engine that boosted conversion rates by 28%, directly contributing to $2M in incremental revenue.</p><p>Prior to this, at Digital Solutions Co., I launched three major product features that generated $1.5M in new annual recurring revenue and collaborated closely with the UX team to redesign the mobile application, which improved our Net Promoter Score by 25 points. I also reduced customer churn by 18% through targeted feature improvements and a reimagined onboarding experience.</p><p>What excites me most about this opportunity at Tech Corp is your commitment to building AI-first products that solve real customer problems at scale. My background in both technical product management and strategic business analysis positions me uniquely to drive your product vision forward while maintaining a strong customer focus.</p><p>I would welcome the opportunity to discuss how my experience leading high-impact product initiatives and my passion for building exceptional user experiences can contribute to Tech Corp's continued growth and success.</p><p>Sincerely,<br/>Sarah Anderson</p>",
  },
};

// ── Reusable scaled renderers ─────────────────────────────────────────────────

export function ScaledResume({
  templateId,
  width,
  data,
  headingFontId,
  bodyFontId,
}: {
  templateId: string;
  width: number;
  data?: ResumeData;
  headingFontId?: string;
  bodyFontId?: string;
}) {
  const template = getTemplate(templateId);
  const scale = width / 816;
  const height = Math.round(1056 * scale);
  const hFont = headingFontId || template.typography.headingFont;
  const bFont = bodyFontId || template.typography.bodyFont;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-200/80"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="origin-top-left"
        style={{
          width: "816px",
          height: "1056px",
          transform: `scale(${scale})`,
        }}
      >
        <TemplateRenderer
          data={data || sampleResumeData}
          template={template}
          headingFontId={hFont}
          bodyFontId={bFont}
        />
      </div>
    </div>
  );
}

export function ScaledCoverLetter({
  templateId,
  width,
}: {
  templateId: string;
  width: number;
}) {
  const template = getTemplate(templateId);
  const scale = width / 816;
  const height = Math.round(1056 * scale);

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-200/80"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="origin-top-left"
        style={{
          width: "816px",
          height: "1056px",
          transform: `scale(${scale})`,
        }}
      >
        <CoverLetterRenderer
          data={sampleCoverLetterData}
          template={template}
          headingFontId={template.typography.headingFont}
          bodyFontId={template.typography.bodyFont}
        />
      </div>
    </div>
  );
}
