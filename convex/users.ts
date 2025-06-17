import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

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

export const updateUser = mutation({
  args: { fullname: v.string(), bio: v.string() },
  handler: async (context, args) => {
    const currentUser = await getAuthenticatedUser(context);

    await context.db.patch(currentUser._id, args);
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (context, { clerkId }) => {
    const user = await context.db
      .query("users")
      .withIndex("by_clerk_id", (query) => query.eq("clerkId", clerkId))
      .unique();

    return user;
  },
});

export const getUserProfile = query({
  args: { id: v.id("users") },
  handler: async (context, { id }) => {
    const user = await context.db.get(id);

    if (!user) throw new Error("User not found!");

    return user;
  },
});

export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (context, { followingId }) => {
    const currentUser = await getAuthenticatedUser(context);

    const follow = await context.db
      .query("follows")
      .withIndex("by_both", (query) =>
        query.eq("followerId", currentUser._id).eq("followingId", followingId)
      )
      .first();

    return !!follow;
  },
});

export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (context, { followingId }) => {
    const currentUser = await getAuthenticatedUser(context);

    const existing = await context.db
      .query("follows")
      .withIndex("by_both", (query) =>
        query.eq("followerId", currentUser._id).eq("followingId", followingId)
      )
      .first();

    if (existing) {
      await context.db.delete(existing._id);

      await updateFollowCount(context, currentUser._id, followingId, false);
    } else {
      await context.db.insert("follows", {
        followerId: currentUser._id,
        followingId,
      });

      await updateFollowCount(context, currentUser._id, followingId, true);

      await context.db.insert("notifications", {
        receiverId: followingId,
        senderId: currentUser._id,
        type: "follow",
      });
    }
  },
});

const updateFollowCount = async (
  context: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) => {
  const follower = await context.db.get(followerId);
  const following = await context.db.get(followingId);

  if (follower && following) {
    await context.db.patch(followerId, {
      following: follower.following + (isFollow ? 1 : -1),
    });

    await context.db.patch(followingId, {
      followers: following.followers + (isFollow ? 1 : -1),
    });
  }
};

const getAuthenticatedUser = async (context: QueryCtx | MutationCtx) => {
  const identity = await context.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized!");

  const currentUser = await context.db
    .query("users")
    .withIndex("by_clerk_id", (query) => query.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not found!");

  return currentUser;
};

export default getAuthenticatedUser;
