import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const defaultResumeData = {
  personalDetails: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    photo: undefined,
  },
  contact: {
    email: "",
    phone: "",
    linkedin: "",
    location: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  template: "modern",
  style: {
    font: "inter",
    spacing: "normal",
    accentColor: "#3b82f6",
  },
};

export const createResume = mutation({
  args: {
    clerkId: v.string(),
    title: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    initialData: v.optional(
      v.object({
        personalDetails: v.optional(
          v.object({
            firstName: v.string(),
            lastName: v.string(),
            jobTitle: v.string(),
            photo: v.optional(v.string()),
          })
        ),
        contact: v.optional(
          v.object({
            email: v.string(),
            phone: v.string(),
            linkedin: v.string(),
            location: v.string(),
          })
        ),
        summary: v.optional(v.string()),
        experience: v.optional(
          v.array(
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
          )
        ),
        education: v.optional(
          v.array(
            v.object({
              id: v.string(),
              degree: v.string(),
              school: v.string(),
              startDate: v.string(),
              endDate: v.string(),
            })
          )
        ),
        skills: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      title: args.title || "Untitled Resume",
      personalDetails: args.initialData?.personalDetails || defaultResumeData.personalDetails,
      contact: args.initialData?.contact || defaultResumeData.contact,
      summary: args.initialData?.summary || defaultResumeData.summary,
      experience: args.initialData?.experience || defaultResumeData.experience,
      education: args.initialData?.education || defaultResumeData.education,
      skills: args.initialData?.skills || defaultResumeData.skills,
      jobDescription: args.jobDescription,
      template: defaultResumeData.template,
      style: defaultResumeData.style,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return resumeId;
  },
});

export const getResume = query({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getResumesByUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const updateResume = mutation({
  args: {
    id: v.id("resumes"),
    updates: v.object({
      title: v.optional(v.string()),
      personalDetails: v.optional(
        v.object({
          firstName: v.string(),
          lastName: v.string(),
          jobTitle: v.string(),
          photo: v.optional(v.string()),
          nationality: v.optional(v.string()),
          driverLicense: v.optional(v.string()),
          birthDate: v.optional(v.string()),
        })
      ),
      contact: v.optional(
        v.object({
          email: v.string(),
          phone: v.string(),
          linkedin: v.string(),
          location: v.string(),
        })
      ),
      summary: v.optional(v.string()),
      experience: v.optional(
        v.array(
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
        )
      ),
      education: v.optional(
        v.array(
          v.object({
            id: v.string(),
            degree: v.string(),
            school: v.string(),
            startDate: v.string(),
            endDate: v.string(),
          })
        )
      ),
      skills: v.optional(v.array(v.string())),
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
      jobDescription: v.optional(v.string()),
      template: v.optional(v.string()),
      style: v.optional(
        v.object({
          font: v.string(),
          headingFont: v.optional(v.string()),
          bodyFont: v.optional(v.string()),
          spacing: v.string(),
          accentColor: v.string(),
          showPhoto: v.optional(v.boolean()),
          showDividers: v.optional(v.boolean()),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { id, updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const deleteResume = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
