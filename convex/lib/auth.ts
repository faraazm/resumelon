import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

/**
 * Get the authenticated user's document from the database.
 * Throws if not authenticated or user not found.
 * Use in queries and mutations.
 */
export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const clerkId = identity.subject;
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first();
  if (!user || user.deletedAt) {
    throw new Error("User not found");
  }
  return user;
}

/**
 * Get the authenticated user if they exist, or null if not yet created.
 * Throws if not authenticated. Use for queries that should gracefully
 * handle users who haven't been synced yet.
 */
export async function getAuthenticatedUserOrNull(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const clerkId = identity.subject;
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first();
  if (user?.deletedAt) return null;
  return user;
}

/**
 * Get the authenticated Clerk user ID from the JWT.
 * Throws if not authenticated.
 * Use in actions (which don't have direct db access).
 */
export async function getAuthenticatedClerkId(
  ctx: ActionCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
}
