import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const tabsStyles = StyleSheet.create({
  tabBar: {
    height: 40,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
    borderTopWidth: 0,
    position: "absolute",
    elevation: 0,
  },
});
