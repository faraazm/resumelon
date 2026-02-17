"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

// Define the resume schema for structured outputs
const resumeSchema = {
  type: "object" as const,
  properties: {
    personalDetails: {
      type: "object" as const,
      properties: {
        firstName: { type: "string" as const, description: "First name of the person" },
        lastName: { type: "string" as const, description: "Last name of the person" },
        jobTitle: { type: "string" as const, description: "Current or target job title/role" },
      },
      required: ["firstName", "lastName", "jobTitle"],
      additionalProperties: false,
    },
    contact: {
      type: "object" as const,
      properties: {
        email: { type: "string" as const, description: "Email address" },
        phone: { type: "string" as const, description: "Phone number" },
        linkedin: { type: "string" as const, description: "LinkedIn profile URL" },
        location: { type: "string" as const, description: "City, State or full address" },
      },
      required: ["email", "phone", "linkedin", "location"],
      additionalProperties: false,
    },
    summary: {
      type: "string" as const,
      description: "Professional summary or objective statement",
    },
    experience: {
      type: "array" as const,
      description: "Work experience entries",
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const, description: "Job title" },
          company: { type: "string" as const, description: "Company name" },
          location: { type: "string" as const, description: "Job location" },
          startDate: { type: "string" as const, description: "Start date (e.g., 'Jan 2020' or '2020')" },
          endDate: { type: "string" as const, description: "End date (e.g., 'Dec 2023' or 'Present')" },
          current: { type: "boolean" as const, description: "Whether this is the current job" },
          bullets: {
            type: "array" as const,
            items: { type: "string" as const },
            description: "Achievement bullets or responsibilities. Each bullet should be a complete sentence describing an accomplishment or responsibility.",
          },
        },
        required: ["title", "company", "location", "startDate", "endDate", "current", "bullets"],
        additionalProperties: false,
      },
    },
    education: {
      type: "array" as const,
      description: "Education entries",
      items: {
        type: "object" as const,
        properties: {
          degree: { type: "string" as const, description: "Degree name (e.g., 'Bachelor of Science in Computer Science')" },
          school: { type: "string" as const, description: "School or university name" },
          startDate: { type: "string" as const, description: "Start date or year" },
          endDate: { type: "string" as const, description: "End date, graduation year, or 'Present'" },
        },
        required: ["degree", "school", "startDate", "endDate"],
        additionalProperties: false,
      },
    },
    skills: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "List of skills, technologies, and competencies",
    },
  },
  required: ["personalDetails", "contact", "summary", "experience", "education", "skills"],
  additionalProperties: false,
};

export const parseResumeWithAI = action({
  args: {
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert resume parser. Your job is to extract structured information from resume text.

IMPORTANT GUIDELINES:
1. Extract ALL information accurately - do not miss any details
2. For bullet points: Each bullet should be a complete, meaningful sentence describing an accomplishment or responsibility. Combine broken lines that belong together.
3. For dates: Preserve the original format (e.g., "Jan 2020", "2020", "01/2020")
4. For skills: Extract all technical skills, soft skills, tools, and technologies mentioned anywhere in the resume
5. If a field is not present or unclear, use an empty string "" or empty array []
6. For current jobs, set "current" to true and "endDate" to "Present"
7. Preserve the professional tone and language used in the original resume
8. Do NOT add information that isn't in the source text
9. Clean up formatting issues like extra spaces, weird characters, or broken words

The extracted text may have formatting issues from PDF extraction - intelligently reconstruct the original meaning.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Please parse the following resume text and extract all information into the structured format:\n\n${args.extractedText}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "resume",
            strict: true,
            schema: resumeSchema,
          },
        },
        temperature: 0.1, // Low temperature for more consistent extraction
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const parsedResume = JSON.parse(content);

      // Add IDs to experience and education entries
      const result = {
        ...parsedResume,
        experience: parsedResume.experience.map((exp: any, index: number) => ({
          ...exp,
          id: `exp-${Date.now()}-${index}`,
        })),
        education: parsedResume.education.map((edu: any, index: number) => ({
          ...edu,
          id: `edu-${Date.now()}-${index}`,
        })),
      };

      return result;
    } catch (error) {
      console.error("AI parsing error:", error);
      throw new Error("Failed to parse resume with AI. Please try again.");
    }
  },
});
