import { homeStyles } from "@/styles/home.styles";
import { Text, View } from "react-native";

const NoPostsFound = () => {
  return (
    <View style={homeStyles.noPostsFound}>
      <Text style={homeStyles.NoPostsFoundText}>No Post yet!</Text>
    </View>
  );
};
export default NoPostsFound;
