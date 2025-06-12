import { query } from "./_generated/server";
import getAuthenticatedUser from "./users";

export const getNotifications = query({
  handler: async (context) => {
    const currentUser = await getAuthenticatedUser(context);

    const notifications = await context.db
      .query("notifications")
      .withIndex("by_receiver", (query) =>
        query.eq("receiverId", currentUser._id)
      )
      .order("desc")
      .collect();

    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notification) => {
        const sender = (await context.db.get(notification.senderId))!;

        let post = null;
        let comment = null;

        if (notification.postId) {
          post = await context.db.get(notification.postId);
        }

        if (notification.type === "comment" && notification.commentId) {
          comment = await context.db.get(notification.commentId);
        }

        return {
          ...notification,
          sender: {
            _id: sender?._id,
            username: sender?.username,
            image: sender?.image,
          },
          post: post!,
          comment: comment?.content!,
        };
      })
    );

    return notificationsWithInfo;
  },
});
