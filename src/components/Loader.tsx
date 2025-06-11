import { COLORS } from "@/constants/theme";
import { homeStyles } from "@/styles/home.styles";
import { ActivityIndicator, View } from "react-native";

const Loader = () => {
  return (
    <View style={homeStyles.loader}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};
export default Loader;
