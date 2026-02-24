"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

// Schema for job match analysis structured output
const jobMatchAnalysisSchema = {
  type: "object" as const,
  properties: {
    jobTitle: { type: "string" as const, description: "The job title extracted from the job description" },
    companyName: { type: "string" as const, description: "The company name extracted from the job description" },
    matchScore: { type: "number" as const, description: "A score from 0-100 indicating how well the resume matches the job" },
    missingSkills: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Skills required by the job that are not present in the resume",
    },
    presentSkills: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Skills from the resume that match the job requirements",
    },
    suggestedSummary: { type: "string" as const, description: "A tailored professional summary for this specific job" },
    suggestedBullets: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          experienceId: { type: "string" as const, description: "The ID of the experience entry to modify" },
          originalBullet: { type: "string" as const, description: "The original bullet text" },
          improvedBullet: { type: "string" as const, description: "The improved bullet text tailored for the job" },
        },
        required: ["experienceId", "originalBullet", "improvedBullet"],
        additionalProperties: false,
      },
      description: "Suggested bullet point improvements for experience entries",
    },
  },
  required: ["jobTitle", "companyName", "matchScore", "missingSkills", "presentSkills", "suggestedSummary", "suggestedBullets"],
  additionalProperties: false,
};

// Schema for optimized resume structured output
const optimizedResumeSchema = {
  type: "object" as const,
  properties: {
    personalDetails: {
      type: "object" as const,
      properties: {
        firstName: { type: "string" as const },
        lastName: { type: "string" as const },
        jobTitle: { type: "string" as const, description: "Updated job title to match target role" },
      },
      required: ["firstName", "lastName", "jobTitle"],
      additionalProperties: false,
    },
    contact: {
      type: "object" as const,
      properties: {
        email: { type: "string" as const },
        phone: { type: "string" as const },
        linkedin: { type: "string" as const },
        location: { type: "string" as const },
      },
      required: ["email", "phone", "linkedin", "location"],
      additionalProperties: false,
    },
    summary: { type: "string" as const, description: "Tailored professional summary for the target job" },
    experience: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const },
          title: { type: "string" as const },
          company: { type: "string" as const },
          location: { type: "string" as const },
          startDate: { type: "string" as const },
          endDate: { type: "string" as const },
          current: { type: "boolean" as const },
          bullets: { type: "array" as const, items: { type: "string" as const } },
        },
        required: ["id", "title", "company", "location", "startDate", "endDate", "current", "bullets"],
        additionalProperties: false,
      },
    },
    education: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const },
          degree: { type: "string" as const },
          school: { type: "string" as const },
          startDate: { type: "string" as const },
          endDate: { type: "string" as const },
        },
        required: ["id", "degree", "school", "startDate", "endDate"],
        additionalProperties: false,
      },
    },
    skills: { type: "array" as const, items: { type: "string" as const }, description: "Updated skills list with relevant skills for the target job" },
    matchScore: { type: "number" as const, description: "Estimated match score of the optimized resume (0-100)" },
    missingSkills: { type: "array" as const, items: { type: "string" as const }, description: "Skills still missing after optimization" },
    presentSkills: { type: "array" as const, items: { type: "string" as const }, description: "Skills present that match the job" },
    jobTitle: { type: "string" as const, description: "Extracted job title from description" },
    companyName: { type: "string" as const, description: "Extracted company name from description" },
  },
  required: ["personalDetails", "contact", "summary", "experience", "education", "skills", "matchScore", "missingSkills", "presentSkills", "jobTitle", "companyName"],
  additionalProperties: false,
};

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

// Generate a resume from uploaded documents (multi-file AI synthesis)
export const generateResumeFromDocuments = action({
  args: {
    documentsText: v.string(),
    additionalInfo: v.optional(v.string()),
    generateCoverLetter: v.optional(v.boolean()),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ resumeData: any; coverLetterContent: string | null }> => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert resume writer and career consultant. Your job is to synthesize information from multiple documents (LinkedIn exports, old CVs, portfolios, etc.) into a polished, professional resume.

IMPORTANT GUIDELINES:
1. Combine information from ALL provided documents into a single coherent resume
2. Deduplicate overlapping information — pick the best/most complete version
3. For experience entries: create strong, achievement-oriented bullet points with metrics where possible
4. Write a compelling professional summary that highlights key strengths
5. Extract ALL relevant skills, technologies, and competencies
6. For dates: use format like "Jan 2020" or "2020"
7. For current jobs, set "current" to true and "endDate" to "Present"
8. If information is ambiguous or missing, make reasonable inferences but do NOT fabricate
9. Organize experience in reverse chronological order
10. Clean up formatting issues, typos, and inconsistencies`;

    let userInput = `Please synthesize the following documents into a professional resume:\n\n${args.documentsText}`;

    if (args.additionalInfo) {
      userInput += `\n\nADDITIONAL CONTEXT FROM THE USER:\n${args.additionalInfo}`;
    }

    if (args.jobDescription) {
      userInput += `\n\nTARGET JOB DESCRIPTION (tailor the resume for this role):\n${args.jobDescription}`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "resume",
            strict: true,
            schema: resumeSchema,
          },
        },
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const parsedResume = JSON.parse(content);

      // Add IDs to experience and education entries
      const resumeData = {
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

      // Generate cover letter if requested
      let coverLetterContent: string | null = null;
      if (args.generateCoverLetter && args.jobDescription) {
        try {
          const coverLetterResult = await ctx.runAction(api.ai.generateCoverLetter, {
            resumeData: {
              personalDetails: {
                firstName: resumeData.personalDetails.firstName,
                lastName: resumeData.personalDetails.lastName,
                jobTitle: resumeData.personalDetails.jobTitle,
              },
              contact: {
                email: resumeData.contact.email,
                phone: resumeData.contact.phone,
                location: resumeData.contact.location,
              },
              summary: resumeData.summary,
              experience: resumeData.experience.map((exp: any) => ({
                title: exp.title,
                company: exp.company,
                bullets: exp.bullets,
              })),
              skills: resumeData.skills,
            },
            jobDescription: args.jobDescription,
            companyName: "the company",
            jobTitle: resumeData.personalDetails.jobTitle,
          });
          coverLetterContent = coverLetterResult.content;
        } catch (error) {
          console.error("Cover letter generation failed:", error);
          // Don't fail the whole operation if cover letter fails
        }
      }

      return { resumeData, coverLetterContent };
    } catch (error) {
      console.error("AI resume generation error:", error);
      throw new Error("Failed to generate resume from documents. Please try again.");
    }
  },
});

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

// Analyze how well a resume matches a job description
export const analyzeJobMatch = action({
  args: {
    resumeData: v.object({
      personalDetails: v.object({
        firstName: v.string(),
        lastName: v.string(),
        jobTitle: v.string(),
      }),
      summary: v.string(),
      experience: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          company: v.string(),
          bullets: v.array(v.string()),
        })
      ),
      skills: v.array(v.string()),
    }),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert career consultant and ATS optimization specialist. Analyze how well a resume matches a job description.

GUIDELINES:
1. Calculate a realistic match score (0-100) based on skills overlap, experience relevance, and role alignment
2. Identify specific skills the job requires that are missing from the resume
3. Identify skills from the resume that match what the job is looking for
4. Write a tailored professional summary that highlights relevant experience for this specific job
5. Suggest improved bullet points that better align with the job requirements while staying truthful to the original experience
6. Extract the job title and company name from the job description
7. Be honest in scoring - a 70-80 is a good match, 80-90 is excellent, 90+ is rare`;

    const userInput = `RESUME DATA:
Name: ${args.resumeData.personalDetails.firstName} ${args.resumeData.personalDetails.lastName}
Current Title: ${args.resumeData.personalDetails.jobTitle}
Summary: ${args.resumeData.summary}
Skills: ${args.resumeData.skills.join(", ")}

Experience:
${args.resumeData.experience.map((exp) => `- ${exp.title} at ${exp.company} [ID: ${exp.id}]\n  ${exp.bullets.join("\n  ")}`).join("\n")}

JOB DESCRIPTION:
${args.jobDescription}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "job_match_analysis",
            strict: true,
            schema: jobMatchAnalysisSchema,
          },
        },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("AI job match analysis error:", error);
      throw new Error("Failed to analyze job match. Please try again.");
    }
  },
});

// Generate a fully optimized resume for a specific job
export const generateOptimizedResume = action({
  args: {
    resumeData: v.object({
      personalDetails: v.object({
        firstName: v.string(),
        lastName: v.string(),
        jobTitle: v.string(),
        photo: v.optional(v.string()),
      }),
      contact: v.object({
        email: v.string(),
        phone: v.string(),
        linkedin: v.string(),
        location: v.string(),
      }),
      summary: v.string(),
      experience: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          company: v.string(),
          location: v.string(),
          startDate: v.string(),
          endDate: v.string(),
          current: v.boolean(),
          bullets: v.array(v.string()),
        })
      ),
      education: v.array(
        v.object({
          id: v.string(),
          degree: v.string(),
          school: v.string(),
          location: v.optional(v.string()),
          startDate: v.string(),
          endDate: v.string(),
        })
      ),
      skills: v.array(v.string()),
    }),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. Generate an optimized version of the resume tailored for the given job description.

GUIDELINES:
1. Keep ALL contact information and education exactly as provided - do not modify
2. Update the job title in personalDetails to match the target role
3. Rewrite the summary to highlight relevant experience for this specific job
4. Optimize experience bullets to emphasize skills and achievements relevant to the job
5. Stay truthful - rephrase and emphasize, but don't fabricate experience
6. Reorder and update the skills list to prioritize job-relevant skills
7. Add genuinely applicable skills that the candidate likely has based on their experience
8. Keep the same experience entry IDs, dates, companies, and locations
9. Calculate a realistic match score for the optimized version
10. Identify remaining missing skills and present matching skills`;

    const userInput = `ORIGINAL RESUME:
${JSON.stringify(args.resumeData, null, 2)}

JOB DESCRIPTION:
${args.jobDescription}

Generate an optimized version of this resume tailored for the above job.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "optimized_resume",
            strict: true,
            schema: optimizedResumeSchema,
          },
        },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("AI resume optimization error:", error);
      throw new Error("Failed to generate optimized resume. Please try again.");
    }
  },
});

// Generate a cover letter for an optimized resume
export const generateCoverLetter = action({
  args: {
    resumeData: v.object({
      personalDetails: v.object({
        firstName: v.string(),
        lastName: v.string(),
        jobTitle: v.string(),
      }),
      contact: v.object({
        email: v.string(),
        phone: v.string(),
        location: v.string(),
      }),
      summary: v.string(),
      experience: v.array(
        v.object({
          title: v.string(),
          company: v.string(),
          bullets: v.array(v.string()),
        })
      ),
      skills: v.array(v.string()),
    }),
    jobDescription: v.string(),
    companyName: v.string(),
    jobTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert cover letter writer. Write a compelling, professional cover letter.

GUIDELINES:
1. Address it to the Hiring Manager (unless a specific name is in the job description)
2. Keep it concise - 3-4 paragraphs maximum
3. Reference specific skills and experience from the resume that match the job
4. Show genuine enthusiasm for the role and company
5. Use a professional but personable tone
6. Do not use generic filler or cliches
7. Return ONLY the cover letter text, no subject line or metadata`;

    const userInput = `RESUME:
Name: ${args.resumeData.personalDetails.firstName} ${args.resumeData.personalDetails.lastName}
Title: ${args.resumeData.personalDetails.jobTitle}
Summary: ${args.resumeData.summary}
Skills: ${args.resumeData.skills.join(", ")}
Experience: ${args.resumeData.experience.map((e) => `${e.title} at ${e.company}: ${e.bullets.join("; ")}`).join("\n")}

TARGET JOB: ${args.jobTitle} at ${args.companyName}

JOB DESCRIPTION:
${args.jobDescription}`;

    try {
      const response = await openai.responses.create({
        model: "gpt-5-nano",
        instructions: systemPrompt,
        input: userInput,
      });

      const content = response.output_text;
      if (!content) {
        throw new Error("No response from AI");
      }

      return { content: content.trim() };
    } catch (error) {
      console.error("AI cover letter generation error:", error);
      throw new Error("Failed to generate cover letter. Please try again.");
    }
  },
});

