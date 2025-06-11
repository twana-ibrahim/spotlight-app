import { homeStyles } from "@/styles/home.styles";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

const Story = ({ avatar, hasStory, username }: Props) => {
  return (
    <TouchableOpacity style={homeStyles.storyWrapper}>
      <View style={[homeStyles.storyRing, !hasStory && homeStyles.noStory]}>
        <Image source={{ uri: avatar }} style={homeStyles.storyAvatar} />
      </View>

      <Text style={homeStyles.storyUsername}>{username}</Text>
    </TouchableOpacity>
  );
};
export default Story;
