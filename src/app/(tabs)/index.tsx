import EmptyScreen from "@/components/EmptyScreen";
import Loader from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/StoriesSection";
import { COLORS } from "@/constants/theme";
import { homeStyles } from "@/styles/home.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { signOut } = useAuth();

  const posts = useQuery(api.posts.getPosts);

  if (!posts) return <Loader />;

  if (!posts.length) return <EmptyScreen text="post" />;

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>Spotlight</Text>

        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<StoriesSection />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
export default Home;
