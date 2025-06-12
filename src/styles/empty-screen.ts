import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const emptyScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 20, color: COLORS.primary },
});
