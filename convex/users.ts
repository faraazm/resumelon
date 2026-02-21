import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update user info if changed
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        updatedAt: Date.now(),
      });
      return existingUser;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      hasCompletedOnboarding: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const getRemainingGenerations = query({
  args: { clerkId: v.string(), currentMonth: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return { remaining: 0, total: 5, used: 0 };
    }

    const isCurrentMonth = user.lastGenerationMonth === args.currentMonth;
    const used = isCurrentMonth ? (user.monthlyGenerationCount || 0) : 0;
    return { remaining: Math.max(0, 5 - used), total: 5, used };
  },
});

export const incrementGenerationCount = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const isCurrentMonth = user.lastGenerationMonth === currentMonth;
    const currentCount = isCurrentMonth ? (user.monthlyGenerationCount || 0) : 0;

    await ctx.db.patch(user._id, {
      monthlyGenerationCount: currentCount + 1,
      lastGenerationMonth: currentMonth,
      updatedAt: Date.now(),
    });
  },
});

export const completeOnboarding = mutation({
  args: {
    clerkId: v.string(),
    primaryResumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const patchData: Record<string, any> = {
      hasCompletedOnboarding: true,
      updatedAt: Date.now(),
    };

    if (args.primaryResumeId) {
      patchData.primaryResumeId = args.primaryResumeId;
    }

    await ctx.db.patch(user._id, patchData);

    return user._id;
  },
});
