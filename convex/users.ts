import { v } from "convex/values";
import { mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthenticatedUser, getAuthenticatedUserOrNull } from "./lib/auth";

// Type for onboarding completion update
interface OnboardingCompleteUpdate {
  hasCompletedOnboarding: boolean;
  updatedAt: number;
  primaryResumeId?: Id<"resumes">;
}

export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const clerkId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
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
      clerkId,
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
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedUserOrNull(ctx);
  },
});

// Pro limits to prevent abuse
const PRO_MONTHLY_GENERATION_LIMIT = 500;
const PRO_TOTAL_OPTIMIZATION_LIMIT = 2000;

export const getRemainingGenerations = query({
  args: { currentMonth: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUserOrNull(ctx);

    if (!user) {
      return { remaining: 0, total: 5, used: 0, isPro: false };
    }

    const isCurrentMonth = user.lastGenerationMonth === args.currentMonth;
    const used = isCurrentMonth ? (user.monthlyGenerationCount || 0) : 0;

    if (user.subscriptionStatus === "active") {
      // Pro users have a high limit but not infinite (prevent abuse)
      return {
        remaining: Math.max(0, PRO_MONTHLY_GENERATION_LIMIT - used),
        total: PRO_MONTHLY_GENERATION_LIMIT,
        used,
        isPro: true
      };
    }

    return { remaining: Math.max(0, 5 - used), total: 5, used, isPro: false };
  },
});

export const getRemainingOptimizations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUserOrNull(ctx);

    if (!user) {
      return { remaining: 0, total: 10, used: 0, isPro: false };
    }

    const used = user.optimizationCount || 0;

    if (user.subscriptionStatus === "active") {
      // Pro users have a high limit but not infinite (prevent abuse)
      return {
        remaining: Math.max(0, PRO_TOTAL_OPTIMIZATION_LIMIT - used),
        total: PRO_TOTAL_OPTIMIZATION_LIMIT,
        used,
        isPro: true
      };
    }

    return { remaining: Math.max(0, 10 - used), total: 10, used, isPro: false };
  },
});

export const completeOnboarding = mutation({
  args: {
    primaryResumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const patchData: OnboardingCompleteUpdate = {
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

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    // Delete all resumes and their AI generations
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const resume of resumes) {
      // Delete AI generations for this resume
      const generations = await ctx.db
        .query("aiGenerations")
        .withIndex("by_resume", (q) => q.eq("resumeId", resume._id))
        .collect();
      for (const gen of generations) {
        await ctx.db.delete(gen._id);
      }
      await ctx.db.delete(resume._id);
    }

    // Delete all cover letters
    const coverLetters = await ctx.db
      .query("coverLetters")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const cl of coverLetters) {
      await ctx.db.delete(cl._id);
    }

    // Delete all print tokens
    const printTokens = await ctx.db
      .query("printTokens")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const token of printTokens) {
      await ctx.db.delete(token._id);
    }

    // Delete the user
    await ctx.db.delete(user._id);
  },
});

// --- Internal helpers for server-side AI limit enforcement ---

export const internalCheckOptimizationLimit = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return { allowed: false, reason: "User not found" };

    const used = user.optimizationCount || 0;

    if (user.subscriptionStatus === "active") {
      // Pro users have a high limit but not infinite (prevent abuse)
      if (used >= PRO_TOTAL_OPTIMIZATION_LIMIT) {
        return { allowed: false, reason: `Optimization limit reached (${PRO_TOTAL_OPTIMIZATION_LIMIT}). Contact support if you need more.` };
      }
      return { allowed: true };
    }

    if (used >= 10) {
      return { allowed: false, reason: "Free optimization limit reached (10). Upgrade to Pro for more." };
    }
    return { allowed: true };
  },
});

export const internalCheckGenerationLimit = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return { allowed: false, reason: "User not found" };

    const currentMonth = new Date().toISOString().slice(0, 7);
    const isCurrentMonth = user.lastGenerationMonth === currentMonth;
    const used = isCurrentMonth ? (user.monthlyGenerationCount || 0) : 0;

    if (user.subscriptionStatus === "active") {
      // Pro users have a high limit but not infinite (prevent abuse)
      if (used >= PRO_MONTHLY_GENERATION_LIMIT) {
        return { allowed: false, reason: `Monthly generation limit reached (${PRO_MONTHLY_GENERATION_LIMIT}/month). Limit resets next month.` };
      }
      return { allowed: true };
    }

    if (used >= 5) {
      return { allowed: false, reason: "Free monthly generation limit reached (5/month). Upgrade to Pro for more." };
    }
    return { allowed: true };
  },
});

export const internalIncrementOptimizationCount = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      optimizationCount: (user.optimizationCount || 0) + 1,
      updatedAt: Date.now(),
    });
  },
});

export const internalIncrementGenerationCount = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

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

export const updateSubscriptionStatus = mutation({
  args: {
    clerkId: v.string(),
    subscriptionStatus: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    webhookSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const expectedSecret = process.env.WEBHOOK_SECRET;
    if (!expectedSecret || args.webhookSecret !== expectedSecret) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      console.error(`updateSubscriptionStatus: user not found for clerkId ${args.clerkId}`);
      return;
    }

    await ctx.db.patch(user._id, {
      subscriptionStatus: args.subscriptionStatus,
      ...(args.stripeSubscriptionId ? { stripeSubscriptionId: args.stripeSubscriptionId } : {}),
      updatedAt: Date.now(),
    });
  },
});
