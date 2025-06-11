import { STORIES } from "@/constants/mock-data";
import { homeStyles } from "@/styles/home.styles";
import { FlatList } from "react-native";
import Story from "./Story";

const StoriesSection = () => {
  return (
    <FlatList
      data={STORIES}
      renderItem={({ item }) => <Story {...item} />}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={homeStyles.storiesContainer}
    />
  );
};
export default StoriesSection;
