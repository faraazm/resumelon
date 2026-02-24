import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    hasCompletedOnboarding: v.boolean(),
    primaryResumeId: v.optional(v.id("resumes")),
    optimizationCount: v.optional(v.number()),
    monthlyGenerationCount: v.optional(v.number()),
    lastGenerationMonth: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    personalDetails: v.object({
      firstName: v.string(),
      lastName: v.string(),
      jobTitle: v.string(),
      photo: v.optional(v.string()),
      nationality: v.optional(v.string()),
      driverLicense: v.optional(v.string()),
      birthDate: v.optional(v.string()),
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
    // Additional sections
    internships: v.optional(v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        company: v.string(),
        location: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        bullets: v.array(v.string()),
      })
    )),
    courses: v.optional(v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        institution: v.string(),
        date: v.string(),
      })
    )),
    references: v.optional(v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        title: v.string(),
        company: v.string(),
        email: v.string(),
        phone: v.string(),
      })
    )),
    languages: v.optional(v.array(
      v.object({
        id: v.string(),
        language: v.string(),
        proficiency: v.string(),
      })
    )),
    links: v.optional(v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        url: v.string(),
      })
    )),
    hobbies: v.optional(v.string()),
    custom: v.optional(v.object({
      title: v.string(),
      content: v.string(),
    })),
    // How the resume was created: "scratch", "upload", "ai_generated", "optimized"
    source: v.optional(v.string()),
    // Job description for tailoring
    jobDescription: v.optional(v.string()),
    // Primary/Optimized resume fields
    isPrimary: v.optional(v.boolean()),
    parentResumeId: v.optional(v.id("resumes")),
    optimizationData: v.optional(v.object({
      jobTitle: v.string(),
      companyName: v.string(),
      matchScore: v.number(),
      missingSkills: v.array(v.string()),
      presentSkills: v.array(v.string()),
      optimizedAt: v.number(),
    })),
    template: v.string(),
    style: v.object({
      font: v.string(),
      headingFont: v.optional(v.string()),
      bodyFont: v.optional(v.string()),
      spacing: v.string(),
      accentColor: v.string(),
      backgroundColor: v.optional(v.string()),
      showPhoto: v.optional(v.boolean()),
      showDividers: v.optional(v.boolean()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_primary", ["userId", "isPrimary"]),

  coverLetters: defineTable({
    userId: v.id("users"),
    resumeId: v.optional(v.id("resumes")),
    title: v.string(),
    // Personal details (optional for backwards compatibility)
    personalDetails: v.optional(v.object({
      firstName: v.string(),
      lastName: v.string(),
      jobTitle: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
    })),
    // Letter content (optional for backwards compatibility)
    letterContent: v.optional(v.object({
      companyName: v.string(),
      hiringManagerName: v.string(),
      content: v.string(), // Rich text HTML content
    })),
    // Legacy field for backwards compatibility
    content: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_resume", ["resumeId"]),

  // One-time print tokens for secure PDF generation
  printTokens: defineTable({
    jti: v.string(), // Unique token identifier
    resumeId: v.id("resumes"),
    userId: v.id("users"),
    expiresAt: v.number(), // Timestamp when token expires
    usedAt: v.optional(v.number()), // Timestamp when token was consumed (null if unused)
    createdAt: v.number(),
  })
    .index("by_jti", ["jti"])
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"]),

  // AI-generated content versions for resume fields
  aiGenerations: defineTable({
    resumeId: v.id("resumes"),
    fieldType: v.string(), // "summary", "experience_bullets", "internship_bullets", "hobbies", "custom"
    fieldId: v.optional(v.string()), // For experience/internship IDs (e.g., "exp-123")
    originalContent: v.string(), // The user's original content
    generations: v.array(
      v.object({
        content: v.string(), // The AI-generated content (HTML)
        tone: v.string(), // "results-oriented", "innovative", "collaborative", "expert", "enthusiastic", "random", "custom"
        prompt: v.optional(v.string()), // Custom prompt if tone is "custom"
        createdAt: v.number(),
      })
    ),
    hasAutoGenerated: v.boolean(), // Track if auto-gen has happened on first load
    selectedIndex: v.optional(v.number()), // Index into generations[] that the user clicked "Use" on
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_resume_field", ["resumeId", "fieldType", "fieldId"]),
});
