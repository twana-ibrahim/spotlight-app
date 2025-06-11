import { COLORS } from "@/constants/theme";
import { homeStyles } from "@/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "convex/_generated/dataModel";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View style={homeStyles.post}>
      <View style={homeStyles.postHeader}>
        <Link href="/(tabs)/notifications">
          <TouchableOpacity style={homeStyles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={homeStyles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </TouchableOpacity>

          <Text style={homeStyles.postUsername}>{post.author.username}</Text>
        </Link>

        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity>
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
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={homeStyles.postInfo}>
        <Text style={homeStyles.likesText}>
          {post.likes ?? "Be the first to like"}
        </Text>

        {post.caption && (
          <View style={homeStyles.captionContainer}>
            <Text style={homeStyles.captionUsername}>
              {post.author.username}
            </Text>
            <Text style={homeStyles.captionText}>{post.caption}</Text>
          </View>
        )}

        <TouchableOpacity>
          <Text style={homeStyles.commentsText}>
            View all {post.likes} likes
          </Text>
        </TouchableOpacity>

        <Text style={homeStyles.timeAgo}>2 hours ago</Text>
      </View>
    </View>
  );
};
export default Post;
