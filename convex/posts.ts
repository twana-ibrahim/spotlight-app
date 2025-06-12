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

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (context, { postId }) => {
    const currentUser = await getAuthenticatedUser(context);

    const post = await context.db.get(postId);
    if (!post) throw new Error("Post not found!");

    if (post.userId !== currentUser._id)
      throw new Error("Not authorized to delete this post!");

    const likes = await context.db
      .query("likes")
      .withIndex("by_post", (query) => query.eq("postId", postId))
      .collect();
    for (const like of likes) await context.db.delete(like._id);

    const comments = await context.db
      .query("comments")
      .withIndex("by_post", (query) => query.eq("postId", postId))
      .collect();
    for (const comment of comments) await context.db.delete(comment._id);

    const notifications = await context.db
      .query("notifications")
      .withIndex("by_post", (query) => query.eq("postId", postId))
      .collect();
    for (const notification of notifications)
      await context.db.delete(notification._id);

    await context.storage.delete(post.storageId);

    await context.db.delete(postId);

    await context.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1),
    });
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (context, { postId }) => {
    const currentUser = await getAuthenticatedUser(context);

    const post = await context.db.get(postId);

    if (!post) throw new Error("Post not found!");

    const existingLike = await context.db
      .query("likes")
      .withIndex("by_user_and_post", (query) =>
        query.eq("userId", currentUser._id).eq("postId", postId)
      )
      .first();

    if (existingLike) {
      await context.db.delete(existingLike._id);
      await context.db.patch(postId, { likes: post.likes - 1 });
      return false;
    } else {
      await context.db.insert("likes", { postId, userId: currentUser._id });
      await context.db.patch(postId, { likes: post.likes + 1 });

      if (currentUser._id !== post.userId) {
        await context.db.insert("notifications", {
          senderId: currentUser._id,
          receiverId: post.userId,
          type: "like",
          postId,
        });
      }

      return true;
    }
  },
});
