import { emptyScreenStyles } from "@/styles/empty-screen";
import { Text, View } from "react-native";

type Props = {
  text: string;
};

const EmptyScreen = ({ text }: Props) => {
  return (
    <View style={emptyScreenStyles.container}>
      <Text style={emptyScreenStyles.text}>No {text} yet!</Text>
    </View>
  );
};
export default EmptyScreen;
