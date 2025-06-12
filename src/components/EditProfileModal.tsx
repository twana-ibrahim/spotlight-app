import { COLORS } from "@/constants/theme";
import { profileStyles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    _id: Id<"users">;
    fullname: string;
    bio?: string;
  };
};

const EditProfileModal = (props: Props) => {
  const { onClose, open, user } = props;

  const [fields, setFields] = useState({
    fullname: user.fullname ?? "",
    bio: user.bio ?? "",
  });

  const updateUser = useMutation(api.users.updateUser);

  const handleChangeText = (field: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(fields);
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={profileStyles.modalContainer}
        >
          <View style={profileStyles.modalContent}>
            <View style={profileStyles.modalHeader}>
              <Text style={profileStyles.modalTitle}>Edit Profile</Text>

              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Name</Text>
              <TextInput
                style={profileStyles.input}
                value={fields.fullname}
                onChangeText={(text) => handleChangeText("fullname", text)}
                placeholderTextColor={COLORS.grey}
                placeholder="Fullname"
              />
            </View>
            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Bio</Text>
              <TextInput
                style={[profileStyles.input, profileStyles.bioInput]}
                value={fields.bio}
                onChangeText={(text) => handleChangeText("bio", text)}
                placeholderTextColor={COLORS.grey}
                multiline
                numberOfLines={4}
                placeholder="Bio"
              />
            </View>

            <TouchableOpacity
              style={profileStyles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={profileStyles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export default EditProfileModal;
