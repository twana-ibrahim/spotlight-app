import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import getAuthenticatedUser from "./users";

export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (context, { postId }) => {
    const currentUser = await getAuthenticatedUser(context);

    const post = await context.db.get(postId);

    if (!post) throw new Error("Post not found");

    const existingBookmark = await context.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (query) =>
        query.eq("userId", currentUser._id).eq("postId", postId)
      )
      .first();

    if (existingBookmark) {
      await context.db.delete(existingBookmark._id);
      return false;
    } else {
      await context.db.insert("bookmarks", { postId, userId: currentUser._id });
      return true;
    }
  },
});

export const getBookmarks = query({
  handler: async (context) => {
    const currentUser = await getAuthenticatedUser(context);

    const bookmarks = await context.db
      .query("bookmarks")
      .withIndex("by_user", (query) => query.eq("userId", currentUser._id))
      .order("desc")
      .collect();

    const bookmarksWithInfo = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await context.db.get(bookmark.postId);
        return post;
      })
    );

    return bookmarksWithInfo;
  },
});
