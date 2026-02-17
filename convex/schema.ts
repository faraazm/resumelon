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
    // Job description for tailoring
    jobDescription: v.optional(v.string()),
    template: v.string(),
    style: v.object({
      font: v.string(),
      headingFont: v.optional(v.string()),
      bodyFont: v.optional(v.string()),
      spacing: v.string(),
      accentColor: v.string(),
      showPhoto: v.optional(v.boolean()),
      showDividers: v.optional(v.boolean()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  coverLetters: defineTable({
    userId: v.id("users"),
    resumeId: v.optional(v.id("resumes")),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
