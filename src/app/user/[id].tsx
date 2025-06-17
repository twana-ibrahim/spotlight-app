import Loader from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { profileStyles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const User = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const profile = useQuery(api.users.getUserProfile, { id: id as Id<"users"> });
  const posts = useQuery(api.posts.getPostsByUser, {
    userId: id as Id<"users">,
  });
  const isFollowing = useQuery(api.users.isFollowing, {
    followingId: id as Id<"users">,
  });

  const toggleFollow = useMutation(api.users.toggleFollow);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  const handleToggleFollow = () => {
    toggleFollow({ followingId: id as Id<"users"> });
  };

  if (profile === undefined || posts === undefined || isFollowing === undefined)
    return <Loader />;

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={profileStyles.headerTitle}>{profile.username}</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={profileStyles.profileInfo}>
          <View style={profileStyles.avatarAndStats}>
            <Image
              source={{ uri: profile.image }}
              style={profileStyles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />

            <View style={profileStyles.statsContainer}>
              <View style={profileStyles.statItem}>
                <Text style={profileStyles.statNumber}>{profile.posts}</Text>
                <Text style={profileStyles.statLabel}>Posts</Text>
              </View>
              <View style={profileStyles.statItem}>
                <Text style={profileStyles.statNumber}>
                  {profile.followers}
                </Text>
                <Text style={profileStyles.statLabel}>Followers</Text>
              </View>
              <View style={profileStyles.statItem}>
                <Text style={profileStyles.statNumber}>
                  {profile.following}
                </Text>
                <Text style={profileStyles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={profileStyles.name}>{profile.fullname}</Text>

          {profile.bio && <Text style={profileStyles.bio}>{profile.bio}</Text>}

          <Pressable
            style={[
              profileStyles.followButton,
              isFollowing && profileStyles.followingButton,
            ]}
            onPress={handleToggleFollow}
          >
            <Text
              style={[
                profileStyles.followButtonText,
                isFollowing && profileStyles.followingButtonText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>

        <View style={profileStyles.postsGrid}>
          {posts.length ? (
            <FlatList
              data={posts}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={profileStyles.gridItem}>
                  <Image
                    source={item.imageUrl}
                    style={profileStyles.gridImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <View style={profileStyles.noPostsContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.grey} />
              <Text style={profileStyles.noPostsText}>No posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default User;
