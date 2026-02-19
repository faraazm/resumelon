"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

// Tone prompts for AI rewriting
const TONE_PROMPTS: Record<string, string> = {
  "results-oriented":
    "Rewrite this content to focus on measurable achievements, metrics, and concrete outcomes. Use strong action verbs and quantify results where possible. Keep the same general meaning but emphasize impact and results.",
  innovative:
    "Rewrite this content to emphasize creativity, innovation, and forward-thinking approaches. Highlight unique methods, pioneering work, and cutting-edge techniques. Keep the professional tone.",
  collaborative:
    "Rewrite this content to showcase teamwork, cross-functional collaboration, and leadership skills. Emphasize working with others, mentoring, and building relationships. Maintain professionalism.",
  expert:
    "Rewrite this content to demonstrate deep technical expertise and industry knowledge. Use precise professional terminology and showcase mastery. Keep it accessible but authoritative.",
  enthusiastic:
    "Rewrite this content to convey passion, energy, and genuine excitement. Make it engaging and dynamic while maintaining professionalism. Show authentic enthusiasm for the work.",
  random:
    "Rewrite this content with a professional tone that best fits the subject matter. Improve clarity, impact, and professionalism while preserving the core message.",
};

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

// Generate improved content for a resume field
export const generateImprovedContent = action({
  args: {
    content: v.string(),
    fieldType: v.string(),
    tone: v.string(),
    customPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get the appropriate prompt based on tone
    let instructions: string;
    if (args.tone === "custom" && args.customPrompt) {
      instructions = `You are an expert resume writer. ${args.customPrompt}

IMPORTANT GUIDELINES:
1. Maintain professional resume language
2. Keep the output concise and impactful
3. PRESERVE THE EXACT STRUCTURE of the original content:
   - If the input is bullet points, output bullet points using <ul><li> tags
   - If the input is a paragraph, output a paragraph using <p> tags
   - If the input is numbered list, output numbered list using <ol><li> tags
4. Do NOT use <strong>, <b>, <em>, or <i> tags - keep text plain without bold or italic formatting
5. Do not include any explanations, just the improved content
6. Keep the same number of items/bullets as the original`;
    } else {
      const tonePrompt = TONE_PROMPTS[args.tone] || TONE_PROMPTS["random"];
      instructions = `You are an expert resume writer. ${tonePrompt}

IMPORTANT GUIDELINES:
1. This is for a ${args.fieldType.replace("_", " ")} section of a resume
2. Keep the output concise and impactful
3. PRESERVE THE EXACT STRUCTURE of the original content:
   - If the input is bullet points, output bullet points using <ul><li> tags
   - If the input is a paragraph, output a paragraph using <p> tags
   - If the input is numbered list, output numbered list using <ol><li> tags
4. Do NOT use <strong>, <b>, <em>, or <i> tags - keep text plain without bold or italic formatting
5. Do not include any explanations, just the improved content
6. Keep the same number of items/bullets as the original
7. Preserve the general length unless the content is very short`;
    }

    const userInput = `Please improve the following ${args.fieldType.replace("_", " ")} content:\n\n${args.content}`;

    try {
      // Use the Responses API with gpt-5-nano
      const response = await openai.responses.create({
        model: "gpt-5-nano",
        instructions: instructions,
        input: userInput,
      });

      const improvedContent = response.output_text;
      if (!improvedContent) {
        throw new Error("No response from AI");
      }

      // Clean up the response - remove markdown code blocks if present
      let cleanedContent = improvedContent
        .replace(/```html\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Remove any bold/italic tags that might have slipped through
      cleanedContent = cleanedContent
        .replace(/<\/?strong>/g, "")
        .replace(/<\/?b>/g, "")
        .replace(/<\/?em>/g, "")
        .replace(/<\/?i>/g, "");

      // If it's plain text without HTML tags, wrap in paragraph
      if (!cleanedContent.includes("<") && !cleanedContent.includes(">")) {
        cleanedContent = `<p>${cleanedContent}</p>`;
      }

      return { content: cleanedContent };
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error("Failed to generate improved content. Please try again.");
    }
  },
});

