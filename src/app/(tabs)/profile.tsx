import EditProfileModal from "@/components/EditProfileModal";
import EmptyScreen from "@/components/EmptyScreen";
import Loader from "@/components/Loader";
import ViewPostModal from "@/components/ViewPostModal";
import { COLORS } from "@/constants/theme";
import { profileStyles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { Doc } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { signOut, userId } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);

  const posts = useQuery(api.posts.getPostsByUser, {});

  const handleToggleEditModal = () => setIsEditModalOpen((prev) => !prev);
  const handleCloseViewPostModal = () => setSelectedPost(null);

  if (!currentUser || !posts) return <Loader />;

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <View style={profileStyles.headerLeft}>
          <Text style={profileStyles.username}>{currentUser.username}</Text>
        </View>

        <View style={profileStyles.headerRight}>
          <TouchableOpacity
            style={profileStyles.headerIcon}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={profileStyles.profileInfo}>
          <View style={profileStyles.avatarAndStats}>
            <View style={profileStyles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={profileStyles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={profileStyles.statsContainer}>
              <View style={profileStyles.statItem}>
                <Text style={profileStyles.statNumber}>
                  {currentUser.posts}
                </Text>
                <Text style={profileStyles.statLabel}>Posts</Text>
              </View>

              <View style={profileStyles.statItem}>
                <Text style={profileStyles.statNumber}>
                  {currentUser.followers}
                </Text>
                <Text style={profileStyles.statLabel}>Followers</Text>
              </View>

              <View style={profileStyles.statItem}>
                <Text style={profileStyles.statNumber}>
                  {currentUser.following}
                </Text>
                <Text style={profileStyles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={profileStyles.name}>{currentUser.fullname}</Text>

          {currentUser.bio && (
            <Text style={profileStyles.bio}>{currentUser.bio}</Text>
          )}

          <View style={profileStyles.actionButtons}>
            <TouchableOpacity
              style={profileStyles.editButton}
              onPress={handleToggleEditModal}
            >
              <Text style={profileStyles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={profileStyles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {posts.length ? (
          <FlatList
            data={posts}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={profileStyles.gridItem}
                onPress={() => setSelectedPost(item)}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={profileStyles.gridImage}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <EmptyScreen text="post" />
        )}
      </ScrollView>

      <ViewPostModal
        open={!!selectedPost}
        post={{ imageUrl: selectedPost?.imageUrl, _id: selectedPost?._id }}
        onClose={handleCloseViewPostModal}
      />

      <EditProfileModal
        open={isEditModalOpen}
        user={{
          _id: currentUser._id,
          fullname: currentUser.fullname,
          bio: currentUser.bio,
        }}
        onClose={handleToggleEditModal}
      />
    </View>
  );
};
export default Profile;
