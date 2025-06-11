import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import getAuthenticatedUser from "./users";

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (context, args) => {
    const currentUser = await getAuthenticatedUser(context);

    const post = await context.db.get(args.postId);
    if (!post) throw new Error("Post not found!");

    const commentId = await context.db.insert("comments", {
      ...args,
      userId: currentUser._id,
    });

    await context.db.patch(args.postId, { comments: post.comments + 1 });

    await context.db.insert("notifications", {
      senderId: currentUser._id,
      receiverId: post.userId,
      type: "comment",
      commentId,
      postId: args.postId,
    });

    return commentId;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (context, { postId }) => {
    const comments = await context.db
      .query("comments")
      .withIndex("by_post", (query) => query.eq("postId", postId))
      .collect();

    const commentsWithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = (await context.db.get(comment.userId))!;

        return {
          ...comment,
          user: {
            fullname: user.fullname,
            image: user.image,
          },
        };
      })
    );

    return commentsWithInfo;
  },
});
