import { COLORS } from "@/constants/theme";
import { homeStyles } from "@/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Comment from "./Comment";
import Loader from "./Loader";

type Props = {
  postId: Id<"posts">;
  open: boolean;
  onClose: () => void;
};

const CommentsModal = (props: Props) => {
  const { onClose, open, postId } = props;

  const [newComment, setNewComment] = useState("");

  const addComment = useMutation(api.comments.addComment);
  const comments = useQuery(api.comments.getComments, { postId });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({ content: newComment, postId: postId });
      setNewComment("");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={homeStyles.modalContainer}
      >
        <View style={homeStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={homeStyles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            contentContainerStyle={homeStyles.commentsList}
            renderItem={({ item }) => <Comment comment={item} />}
            style={homeStyles.commentsList}
          />
        )}

        <View style={homeStyles.commentInput}>
          <TextInput
            style={homeStyles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text
              style={[
                homeStyles.postButton,
                !newComment.trim() && homeStyles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default CommentsModal;
