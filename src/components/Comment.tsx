import { homeStyles } from "@/styles/home.styles";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Text, View } from "react-native";

type Props = {
  comment: {
    content: string;
    _creationTime: number;
    user: {
      fullname: string;
      image: string;
    };
  };
};

const Comment = ({ comment }: Props) => {
  return (
    <View style={homeStyles.commentContainer}>
      <Image
        source={{ uri: comment.user.image }}
        style={homeStyles.commentAvatar}
      />
      <View style={homeStyles.commentContent}>
        <Text style={homeStyles.commentUsername}>{comment.user.fullname}</Text>
        <Text style={homeStyles.commentText}>{comment.content}</Text>
        <Text style={homeStyles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
};
export default Comment;
