import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCoverLetter = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    personalDetails: v.object({
      firstName: v.string(),
      lastName: v.string(),
      jobTitle: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
    }),
    letterContent: v.object({
      companyName: v.string(),
      hiringManagerName: v.string(),
      content: v.string(),
    }),
    resumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // If resumeId provided, verify ownership
    if (args.resumeId) {
      const resume = await ctx.db.get(args.resumeId);
      if (!resume || resume.userId !== user._id) {
        throw new Error("Resume not found");
      }
    }

    const id = await ctx.db.insert("coverLetters", {
      userId: user._id,
      resumeId: args.resumeId,
      title: args.title,
      personalDetails: args.personalDetails,
      letterContent: args.letterContent,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const getCoverLetter = query({
  args: { id: v.id("coverLetters"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    const coverLetter = await ctx.db.get(args.id);
    if (!coverLetter || coverLetter.userId !== user._id) {
      return null;
    }

    return coverLetter;
  },
});

export const getCoverLetterByResume = query({
  args: { resumeId: v.id("resumes"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("coverLetters")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .first();
  },
});

export const getCoverLettersByUser = query({
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
      .query("coverLetters")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const updateCoverLetter = mutation({
  args: {
    id: v.id("coverLetters"),
    clerkId: v.string(),
    updates: v.object({
      title: v.optional(v.string()),
      personalDetails: v.optional(v.object({
        firstName: v.string(),
        lastName: v.string(),
        jobTitle: v.string(),
        email: v.string(),
        phone: v.string(),
        address: v.string(),
      })),
      letterContent: v.optional(v.object({
        companyName: v.string(),
        hiringManagerName: v.string(),
        content: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const coverLetter = await ctx.db.get(args.id);
    if (!coverLetter || coverLetter.userId !== user._id) {
      throw new Error("Cover letter not found");
    }

    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteCoverLetter = mutation({
  args: { id: v.id("coverLetters"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const coverLetter = await ctx.db.get(args.id);
    if (!coverLetter || coverLetter.userId !== user._id) {
      throw new Error("Cover letter not found");
    }

    await ctx.db.delete(args.id);
  },
});
