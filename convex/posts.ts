import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import getAuthenticatedUser from "./users";

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
    const currentUser = await getAuthenticatedUser(context);

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

export const getPosts = query({
  handler: async (context) => {
    const currentUser = await getAuthenticatedUser(context);

    const posts = await context.db.query("posts").order("desc").collect();

    if (!posts.length) return [];

    const postsWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await context.db.get(post.userId))!;

        const like = await context.db
          .query("likes")
          .withIndex("by_user_and_post", (query) =>
            query.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        const bookmark = await context.db
          .query("bookmarks")
          .withIndex("by_user_and_post", (query) =>
            query.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image,
          },
          isLiked: !!like,
          isBookmarked: !!bookmark,
        };
      })
    );

    return postsWithInfo;
  },
});
