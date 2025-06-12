import { COLORS } from "@/constants/theme";
import { profileStyles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "convex/_generated/dataModel";
import { Image } from "expo-image";
import { Modal, TouchableOpacity, View } from "react-native";

type Props = {
  open: boolean;
  onClose: () => void;
  post: {
    _id?: Id<"posts">;
    imageUrl?: string;
  };
};

const ViewPostModal = (props: Props) => {
  const { onClose, open, post } = props;

  return (
    <Modal
      visible={open}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      <View style={profileStyles.modalBackdrop}>
        <View style={profileStyles.postDetailContainer}>
          <View style={profileStyles.postDetailHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Image
            source={post.imageUrl}
            cachePolicy="memory-disk"
            style={profileStyles.postDetailImage}
          />
        </View>
      </View>
    </Modal>
  );
};
export default ViewPostModal;
