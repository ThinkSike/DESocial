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
} from "react-native";

interface CreatePostProps {
  onCreatePost: (content: PostContent) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const colors = useThemeColors();
  const [text, setText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 4,
      });

      if (!result.canceled && result.assets) {
        const imageUris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...imageUris].slice(0, 4));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera permissions to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages((prev) =>
          [...prev, result.assets[0].uri].slice(0, 4)
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handlePost = async () => {
    if (!text.trim() && selectedImages.length === 0) {
      Alert.alert("Empty Post", "Please add some text or images to your post.");
      return;
    }

    setIsPosting(true);

    // Simulate posting delay
    setTimeout(() => {
      const postContent: PostContent = {
        text: text.trim() || undefined,
        images: selectedImages.length > 0 ? selectedImages : undefined,
      };

      onCreatePost(postContent);
      setText("");
      setSelectedImages([]);
      setIsPosting(false);
      Alert.alert("Success", "Your post has been created!");
    }, 1000);
  };

  const canPost =
    (text.trim().length > 0 || selectedImages.length > 0) && !isPosting;

  const postButtonStyle = StyleSheet.flatten([
    styles(colors).postButton,
    {
      backgroundColor: canPost ? colors.primary : "transparent",
      borderColor: canPost ? colors.primary : colors.border,
    },
  ]);

  const postButtonTextStyle = StyleSheet.flatten([
    styles(colors).postButtonText,
    {
      color: canPost ? colors.background : colors.textSecondary,
    },
  ]);

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).inputContainer}>
        <TextInput
          style={styles(colors).textInput}
          placeholder="What's happening?"
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={280}
          scrollEnabled={false}
        />

        <View style={styles(colors).rightControls}>
          <TouchableOpacity
            style={styles(colors).imageButton}
            onPress={showImageOptions}
            disabled={selectedImages.length >= 4}
          >
            <Ionicons
              name="image-outline"
              size={20}
              color={
                selectedImages.length >= 4
                  ? colors.textSecondary
                  : colors.primary
              }
            />
          </TouchableOpacity>
        </View>
      </View>

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
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.surface}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles(colors).bottomRow}>
        <Text style={styles(colors).characterCount}>{text.length}/280</Text>

        <TouchableOpacity
          style={postButtonStyle}
          onPress={handlePost}
          disabled={!canPost}
        >
          <Text style={postButtonTextStyle}>
            {isPosting ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      maxHeight: 120,
    },
    rightControls: {
      flexDirection: "column",
      alignItems: "center",
      marginLeft: 12,
    },
    imageButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    imagePreviewContainer: {
      marginTop: 12,
      maxHeight: 100,
    },
    imagePreview: {
      position: "relative",
      marginRight: 8,
    },
    previewImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    removeImageButton: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: colors.textSecondary,
      borderRadius: 10,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    characterCount: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    postButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    postButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
  });
