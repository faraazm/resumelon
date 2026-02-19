import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const TOKEN_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Generate a cryptographically random token ID
 */
function generateJti(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a one-time print token for a resume (requires authenticated user)
 */
export const createPrintToken = mutation({
  args: {
    resumeId: v.id("resumes"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify resume exists and user owns it
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    if (resume.userId !== user._id) {
      throw new Error("Access denied: You do not own this resume");
    }

    // Generate unique token ID
    const jti = generateJti();
    const now = Date.now();

    // Store token in database
    await ctx.db.insert("printTokens", {
      jti,
      resumeId: args.resumeId,
      userId: user._id,
      expiresAt: now + TOKEN_EXPIRY_MS,
      createdAt: now,
    });

    // Return the token (jti is the token itself - no signature needed since we verify in DB)
    return { token: jti, resumeId: args.resumeId };
  },
});

/**
 * Get resume data for printing using a valid token
 * This is a query that can be called without authentication
 * but requires a valid, unexpired, unused token
 */
export const getResumeForPrint = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the token
    const tokenRecord = await ctx.db
      .query("printTokens")
      .withIndex("by_jti", (q) => q.eq("jti", args.token))
      .first();

    if (!tokenRecord) {
      return { error: "Invalid token", resume: null };
    }

    // Check if already used
    if (tokenRecord.usedAt) {
      return { error: "Token already used", resume: null };
    }

    // Check if expired
    if (Date.now() > tokenRecord.expiresAt) {
      return { error: "Token expired", resume: null };
    }

    // Get the resume
    const resume = await ctx.db.get(tokenRecord.resumeId);
    if (!resume) {
      return { error: "Resume not found", resume: null };
    }

    // Resolve photo URL if photo exists
    let photoUrl: string | null = null;
    if (resume.personalDetails?.photo) {
      try {
        photoUrl = await ctx.storage.getUrl(resume.personalDetails.photo as Id<"_storage">);
      } catch {
        // Photo may have been deleted, continue without it
      }
    }

    return { error: null, resume, resumeId: tokenRecord.resumeId, photoUrl };
  },
});

/**
 * Mark a token as used (call this after successful PDF generation)
 */
export const consumePrintToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const tokenRecord = await ctx.db
      .query("printTokens")
      .withIndex("by_jti", (q) => q.eq("jti", args.token))
      .first();

    if (!tokenRecord) {
      return { success: false, error: "Token not found" };
    }

    if (tokenRecord.usedAt) {
      return { success: false, error: "Token already used" };
    }

    // Mark as used
    await ctx.db.patch(tokenRecord._id, {
      usedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Clean up expired tokens (can be called periodically)
 */
export const cleanupExpiredTokens = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredTokens = await ctx.db
      .query("printTokens")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
    }

    return { deleted: expiredTokens.length };
  },
});
