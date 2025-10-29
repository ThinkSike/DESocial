import { useThemeColors } from "@/constants/Colors";
import { PostContent } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";

interface PostCreatorProps {
  user?: {
    name: string;
    avatar: string;
  };
  onCreatePost?: (content: PostContent) => void;
}

export default function PostCreator({
  user = {
    name: "User",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  onCreatePost,
}: PostCreatorProps) {
  const colors = useThemeColors();
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to upload images.",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true,
        selectionLimit: 4,
        quality: 0.8,
        // Force export to JPEG/PNG instead of HEIC on iOS
        allowsEditing: false,
        exif: false,
      });

      if (!result.canceled && result.assets) {
        const imageUris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...imageUris].slice(0, 4)); // Max 4 images
        setIsFocused(true);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera permissions to take photos.",
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages((prev) =>
          [...prev, result.assets[0].uri].slice(0, 4),
        );
        setIsFocused(true);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    // On web, directly open the image picker (browser will show its own file picker)
    if (Platform.OS === "web") {
      pickImage();
      return;
    }

    // On mobile, show options for Camera or Photo Library
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handlePostSubmit = async () => {
    if (!postText.trim() && selectedImages.length === 0) {
      Alert.alert("Empty Post", "Please add some text or images to your post.");
      return;
    }

    setIsUploading(true);

    try {
      const postContent: PostContent = {
        text: postText.trim() || undefined,
        images: selectedImages.length > 0 ? selectedImages : undefined,
      };

      await onCreatePost?.(postContent);

      // Reset form
      setPostText("");
      setSelectedImages([]);
      setIsFocused(false);
      Alert.alert("Success", "Your post has been created!");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaAction = (type: string) => {
    if (type === "Photo") {
      showImageOptions();
    } else {
      Alert.alert(type, `${type} functionality would be implemented here`);
    }
  };

  const canPost =
    (postText.trim().length > 0 || selectedImages.length > 0) && !isUploading;

  return (
    <View style={styles(colors).container}>
      {/* Post Input Section */}
      <View style={styles(colors).inputSection}>
        <Image source={{ uri: user.avatar }} style={styles(colors).avatar} />
        <TouchableOpacity
          style={styles(colors).inputContainer}
          onPress={() => setIsFocused(true)}
        >
          {!isFocused && selectedImages.length === 0 ? (
            <Text style={styles(colors).placeholder}>Start a post</Text>
          ) : (
            <TextInput
              style={styles(colors).textInput}
              placeholder="What do you want to talk about?"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={postText}
              onChangeText={setPostText}
              autoFocus={isFocused}
              onBlur={() =>
                !postText && selectedImages.length === 0 && setIsFocused(false)
              }
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <ScrollView
          horizontal
          style={styles(colors).imagePreviewContainer}
          showsHorizontalScrollIndicator={false}
        >
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles(colors).imagePreview}>
              <Image source={{ uri }} style={styles(colors).previewImage} />
              <TouchableOpacity
                style={styles(colors).removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={styles(colors).actionsSection}>
        <TouchableOpacity
          style={styles(colors).actionButton}
          onPress={() => handleMediaAction("Video")}
        >
          <Ionicons name="videocam" size={20} color="#5F9B41" />
          <Text style={styles(colors).actionText}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(colors).actionButton}
          onPress={() => handleMediaAction("Photo")}
          disabled={selectedImages.length >= 4}
        >
          <Ionicons
            name="image"
            size={20}
            color={
              selectedImages.length >= 4 ? colors.textSecondary : "#378FE9"
            }
          />
          <Text
            style={[
              styles(colors).actionText,
              selectedImages.length >= 4 && { opacity: 0.5 },
            ]}
          >
            Photo {selectedImages.length > 0 && `(${selectedImages.length}/4)`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(colors).actionButton}
          onPress={() => handleMediaAction("Article")}
        >
          <Ionicons name="document-text" size={20} color="#C37D16" />
          <Text style={styles(colors).actionText}>Write article</Text>
        </TouchableOpacity>
      </View>

      {/* Post Button (shown when typing or images selected) */}
      {(isFocused || selectedImages.length > 0) && (
        <View style={styles(colors).postButtonSection}>
          <View style={styles(colors).postOptions}>
            <Text style={styles(colors).charCount}>{postText.length}/280</Text>
          </View>

          <TouchableOpacity
            style={[
              styles(colors).postButton,
              !canPost && styles(colors).postButtonDisabled,
            ]}
            onPress={handlePostSubmit}
            disabled={!canPost}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text
                style={[
                  styles(colors).postButtonText,
                  !canPost && styles(colors).postButtonTextDisabled,
                ]}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Options */}
      <View style={styles(colors).sortSection}>
        <View style={styles(colors).sortLeft}>
          <Text style={styles(colors).sortText}>Sort by: </Text>
          <TouchableOpacity>
            <Text style={styles(colors).sortOption}>Top</Text>
          </TouchableOpacity>
          <Ionicons
            name="chevron-down"
            size={14}
            color={colors.textSecondary}
            style={styles(colors).sortIcon}
          />
        </View>
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || "#FFFFFF",
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputSection: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      paddingBottom: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    inputContainer: {
      flex: 1,
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border || "#E1E8ED",
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: "center",
    },
    placeholder: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    textInput: {
      fontSize: 16,
      color: colors.text,
      minHeight: 24,
      maxHeight: 120,
    },
    imagePreviewContainer: {
      paddingHorizontal: 16,
      marginBottom: 12,
      maxHeight: 120,
    },
    imagePreview: {
      position: "relative",
      marginRight: 8,
    },
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeImageButton: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: 12,
    },
    actionsSection: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 16,
      borderRadius: 6,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 6,
    },
    postButtonSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    postOptions: {
      flexDirection: "row",
      alignItems: "center",
    },
    charCount: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    postButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 70,
      alignItems: "center",
    },
    postButtonDisabled: {
      backgroundColor: colors.textSecondary + "40",
    },
    postButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    postButtonTextDisabled: {
      color: colors.textSecondary,
    },
    sortSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sortLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    sortText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sortOption: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    sortIcon: {
      marginLeft: 4,
    },
  });
