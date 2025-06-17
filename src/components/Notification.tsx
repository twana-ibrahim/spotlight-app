import { COLORS } from "@/constants/theme";
import { notificationStyles } from "@/styles/notification.styles";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  notification: {
    receiverId: Id<"users">;
    senderId: Id<"users">;
    type: "like" | "comment" | "follow";
    postId?: Id<"posts">;
    commentId?: Id<"comments">;
    comment: string;
    _creationTime: number;
    sender: {
      _id: Id<"users">;
      username: string;
      image: string;
    };
    post: {
      _id: Id<"posts">;
      imageUrl: string;
      caption?: string;
      likes: number;
      comments: number;
      _creationTime: number;
    };
  };
};

const Notification = ({ notification }: Props) => {
  const { icon, label } = useMemo(() => {
    if (notification.type === "follow") {
      return {
        icon: <Ionicons name="person-add" size={14} color="#8b5cf6" />,
        label: "started following you",
      };
    } else if (notification.type === "comment") {
      return {
        icon: <Ionicons name="chatbubble" size={14} color="#3b82f6" />,
        label: `commented: ${notification.comment}`,
      };
    } else {
      return {
        icon: <Ionicons name="heart" size={14} color={COLORS.primary} />,
        label: "liked your post",
      };
    }
  }, [notification.comment, notification.type]);

  return (
    <View style={notificationStyles.notificationItem}>
      <View style={notificationStyles.notificationContent}>
        <Link href={`/user/${notification.senderId}`} asChild>
          <TouchableOpacity style={notificationStyles.avatarContainer}>
            <Image
              source={{ uri: notification.sender.image }}
              style={notificationStyles.avatar}
              contentFit="cover"
              transition={200}
            />

            <View style={notificationStyles.iconBadge}>{icon}</View>
          </TouchableOpacity>
        </Link>

        <View style={notificationStyles.notificationInfo}>
          <Link href={`/user/${notification.senderId}`} asChild>
            <TouchableOpacity>
              <Text style={notificationStyles.username}>
                {notification.sender.username}
              </Text>
            </TouchableOpacity>
          </Link>

          <Text style={notificationStyles.action}>{label}</Text>
          <Text style={notificationStyles.timeAgo}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Notification;
