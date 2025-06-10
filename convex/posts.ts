import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (context) => {
  const identity = await context.auth.getUserIdentity();

  if (!identity) throw new Error("Unauthorized!");

  return context.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized!");

    const currentUser = await context.db
      .query("users")
      .withIndex("by_clerk_id", (query) =>
        query.eq("clerkId", identity.subject)
      )
      .first();

    if (!currentUser) throw new Error("User not found!");

    const imageUrl = await context.storage.getUrl(args.storageId);

    if (!imageUrl) throw new Error("Image not found!");

    const payload = {
      ...args,
      userId: currentUser._id,
      imageUrl,
      likes: 0,
      comments: 0,
    };

    const postId = await context.db.insert("posts", payload);

    await context.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});
