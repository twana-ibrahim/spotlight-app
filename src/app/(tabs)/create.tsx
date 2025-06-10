import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";
import { createStyles } from "@/styles/create.styles";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";

const Create = () => {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const isIOS = Platform.OS === "ios";

  const handleBack = () => router.back();

  const handleClose = () => {
    setSelectedImage(null);
    setCaption("");
  };

  const handlePickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleShare = async () => {
    if (!selectedImage) return;

    try {
      setIsSharing(true);

      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        }
      );

      if (uploadResult.status !== 200) throw new Error("Upload failed!");

      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({ storageId, caption });

      router.push("/(tabs)");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectedImage) {
    return (
      <View style={createStyles.container}>
        <View style={createStyles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={createStyles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity
          style={createStyles.emptyImageContainer}
          onPress={handlePickImage}
        >
          <Ionicons name="image-outline" size={48} color={COLORS.grey} />
          <Text style={createStyles.emptyImageText}>
            Tap to select an image
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? "padding" : "height"}
      style={createStyles.container}
      keyboardVerticalOffset={isIOS ? 100 : 0}
    >
      <View style={createStyles.contentContainer}>
        <View style={createStyles.header}>
          <TouchableOpacity onPress={handleClose} disabled={isSharing}>
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            />
          </TouchableOpacity>

          <Text style={createStyles.headerTitle}>New Post</Text>

          <TouchableOpacity
            onPress={handleShare}
            disabled={isSharing || !selectedImage}
            style={[
              createStyles.shareButton,
              isSharing && createStyles.shareButtonDisabled,
            ]}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={createStyles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={createStyles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              createStyles.content,
              isSharing && createStyles.contentDisabled,
            ]}
          >
            <View style={createStyles.imageSection}>
              <Image
                source={selectedImage}
                style={createStyles.previewImage}
                contentFit="cover"
                transition={200}
              />

              <TouchableOpacity
                style={createStyles.changeImageButton}
                disabled={isSharing}
                onPress={handlePickImage}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                <Text style={createStyles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={createStyles.inputSection}>
              <View style={createStyles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={createStyles.userAvatar}
                  contentFit="cover"
                  transition={200}
                />

                <TextInput
                  style={createStyles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
export default Create;
