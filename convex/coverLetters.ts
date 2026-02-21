import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCoverLetter = mutation({
  args: {
    clerkId: v.string(),
    resumeId: v.id("resumes"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify resume ownership
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== user._id) {
      throw new Error("Resume not found");
    }

    const id = await ctx.db.insert("coverLetters", {
      userId: user._id,
      resumeId: args.resumeId,
      title: args.title,
      content: args.content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return id;
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
