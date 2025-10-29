import { useThemeColors } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";
import { PostContent } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PostCreatorProps {
  user?: { name: string; avatar: string };
  onCreatePost?: (content: PostContent) => void;
}

export default function PostCreator({ user, onCreatePost }: PostCreatorProps) {
  const colors = useThemeColors();
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { profile } = useUserProfile();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant photo library access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages((prev) =>
        [...prev, ...result.assets.map((a) => a.uri)].slice(0, 4)
      );
      setFocused(true);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera access");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, 4));
      setFocused(true);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !images.length) {
      Alert.alert("Empty post", "Add text or images");
      return;
    }

    setUploading(true);
    try {
      await onCreatePost?.({
        text: text.trim() || undefined,
        images: images.length ? images : undefined,
      });

      setText("");
      setImages([]);
      setFocused(false);
      Alert.alert("Success", "Post created!");
    } catch (error) {
      Alert.alert("Error", "Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === "web") {
      pickImage();
    } else {
      Alert.alert("Add Photo", "Choose option", [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const canPost = (text.trim() || images.length) && !uploading;

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).inputSection}>
        <Image
          source={{
            uri: profile?.avatar,
          }}
          style={styles(colors).avatar}
        />
        <TouchableOpacity
          style={styles(colors).inputContainer}
          onPress={() => setFocused(true)}
        >
          {!focused && !images.length ? (
            <Text style={styles(colors).placeholder}>Start a post</Text>
          ) : (
            <TextInput
              style={styles(colors).input}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus={focused}
              onBlur={() => !text && !images.length && setFocused(false)}
            />
          )}
        </TouchableOpacity>
      </View>

      {images.length > 0 && (
        <ScrollView horizontal style={styles(colors).imageScroll}>
          {images.map((uri, i) => (
            <View key={i} style={styles(colors).imagePreview}>
              <Image source={{ uri }} style={styles(colors).image} />
              <TouchableOpacity
                style={styles(colors).removeBtn}
                onPress={() =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <Ionicons name="close-circle" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles(colors).actions}>
        <TouchableOpacity
          style={styles(colors).actionBtn}
          onPress={showImageOptions}
          disabled={images.length >= 4}
        >
          <Ionicons
            name="image"
            size={20}
            color={images.length >= 4 ? colors.textSecondary : "#378FE9"}
          />
          <Text style={styles(colors).actionText}>
            Photo {images.length > 0 && `(${images.length}/4)`}
          </Text>
        </TouchableOpacity>
      </View>

      {(focused || images.length > 0) && (
        <View style={styles(colors).footer}>
          <Text style={styles(colors).charCount}>{text.length}/280</Text>
          <TouchableOpacity
            style={[
              styles(colors).postBtn,
              !canPost && styles(colors).postBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canPost}
          >
            {uploading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles(colors).postBtnText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || "#FFF",
      borderRadius: 12,
      margin: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    inputSection: {
      flexDirection: "row",
      padding: 16,
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
    input: {
      fontSize: 16,
      color: colors.text,
      minHeight: 24,
      maxHeight: 120,
    },
    imageScroll: {
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    imagePreview: {
      marginRight: 8,
      position: "relative",
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeBtn: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 12,
    },
    actions: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    actionText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    charCount: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    postBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 70,
      alignItems: "center",
    },
    postBtnDisabled: {
      opacity: 0.5,
    },
    postBtnText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });
