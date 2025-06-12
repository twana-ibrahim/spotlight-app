import EmptyScreen from "@/components/EmptyScreen";
import Loader from "@/components/Loader";
import { homeStyles } from "@/styles/home.styles";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { ScrollView, Text, View } from "react-native";

const Bookmarks = () => {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarks);

  if (!bookmarkedPosts) return <Loader />;

  if (!bookmarkedPosts.length)
    return <EmptyScreen text="bookmarked post ost" />;

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>Bookmarks</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;

          return (
            <View key={post._id} style={{ width: "33.33%", padding: 1 }}>
              <Image
                source={post.imageUrl}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default Bookmarks;
