import { internalMutation } from "./_generated/server";

// One-time migration: Mark existing resumes as primary.
// For each user, the most recently updated resume becomes the primary.
// Run this once after deploying the schema changes.
export const migrateToPrimaryResumes = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();

    let migratedUsers = 0;
    let migratedResumes = 0;

    for (const user of users) {
      const resumes = await ctx.db
        .query("resumes")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      if (resumes.length === 0) continue;

      // Sort by updatedAt desc and pick the most recent as primary
      const sorted = resumes.sort((a, b) => b.updatedAt - a.updatedAt);
      const primaryResume = sorted[0];

      // Mark primary
      await ctx.db.patch(primaryResume._id, { isPrimary: true });
      migratedResumes++;

      // Mark the rest as non-primary
      for (let i = 1; i < sorted.length; i++) {
        await ctx.db.patch(sorted[i]._id, { isPrimary: false });
        migratedResumes++;
      }

      // Set primaryResumeId on user
      await ctx.db.patch(user._id, {
        primaryResumeId: primaryResume._id,
        updatedAt: Date.now(),
      });

      migratedUsers++;
    }

    return { migratedUsers, migratedResumes };
  },
});
