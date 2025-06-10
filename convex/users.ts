import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (context, args) => {
    const isUserExisted = await context.db
      .query("users")
      .withIndex("by_clerk_id", (query) => query.eq("clerkId", args.clerkId))
      .unique();

    if (isUserExisted) return;

    await context.db.insert("users", {
      ...args,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});
