import { COLORS } from "@/constants/theme";
import { homeStyles } from "@/styles/home.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CommentsModal from "./CommentsModal";

type Props = {
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    };
  };
};

const Post = ({ post }: Props) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.deletePost);

  const handleToggleLike = async () => {
    try {
      const isPostLiked = await toggleLike({ postId: post._id });
      setIsLiked(isPostLiked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const isPostBookmarked = await toggleBookmark({ postId: post._id });
      setIsBookmarked(isPostBookmarked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleCommentsModal = () =>
    setIsCommentsModalOpen((prev) => !prev);

  return (
    <View style={homeStyles.post}>
      <View style={homeStyles.postHeader}>
        <Link
          href={
            currentUser?._id === post.author._id
              ? "/(tabs)/profile"
              : `/user/${post.author._id}`
          }
        >
          <TouchableOpacity style={homeStyles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={homeStyles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />

            <Text style={homeStyles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        {currentUser?._id === post.author._id && (
          <TouchableOpacity onPress={handleDeletePost}>
            <Ionicons name="trash" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      <Image
        source={post.imageUrl}
        style={homeStyles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={homeStyles.postActions}>
        <View style={homeStyles.postActionsLeft}>
          <TouchableOpacity onPress={handleToggleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleCommentsModal}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleToggleBookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <View style={homeStyles.postInfo}>
        <Text style={homeStyles.likesText}>
          {post.likes > 0 ? `${post.likes} likes` : "Be the first to like"}
        </Text>

        {!!post.caption && (
          <View style={homeStyles.captionContainer}>
            <Text style={homeStyles.captionUsername}>
              {post.author.username}
            </Text>
            <Text style={homeStyles.captionText}>{post.caption}</Text>
          </View>
        )}

        {!!post.comments && (
          <TouchableOpacity onPress={handleToggleCommentsModal}>
            <Text style={homeStyles.commentsText}>
              View all {post.comments} comments
            </Text>
          </TouchableOpacity>
        )}

        <Text style={homeStyles.timeAgo}>
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </Text>
      </View>

      <CommentsModal
        postId={post._id}
        open={isCommentsModalOpen}
        onClose={handleToggleCommentsModal}
      />
    </View>
  );
};
export default Post;
