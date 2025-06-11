import Loader from "@/components/Loader";
import NoPostsFound from "@/components/NoPostsFound";
import Post from "@/components/Post";
import Story from "@/components/Story";
import { STORIES } from "@/constants/mock-data";
import { COLORS } from "@/constants/theme";
import { homeStyles } from "@/styles/home.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { signOut } = useAuth();

  const posts = useQuery(api.posts.getPosts);

  if (!posts) return <Loader />;

  if (!posts.length) return <NoPostsFound />;

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>Spotlight</Text>

        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={homeStyles.storiesContainer}
        >
          {STORIES.map((story) => (
            <Story key={story.id} {...story} />
          ))}
        </ScrollView>

        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
};
export default Home;
