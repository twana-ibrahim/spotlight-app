import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Signout</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Home;
