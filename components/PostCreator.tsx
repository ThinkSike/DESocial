import { useThemeColors } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { PostContent } from "@/types/post";
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
  const { profile } = useUserProfile();
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [uploading, setUploading] = useState(false);

  const styles = getStyles(colors);

  const selectImages = async (fromCamera = false) => {
    const request = fromCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await request();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant access");
      return;
    }

    const picker = fromCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await picker({
      mediaTypes: "images",
      allowsMultipleSelection: !fromCamera,
      selectionLimit: 4,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = fromCamera
        ? [result.assets[0].uri]
        : result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris].slice(0, 4));
      setFocused(true);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !images.length)
      return Alert.alert("Empty post", "Add text or images");

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
    } catch {
      Alert.alert("Error", "Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const showOptions = () => {
    if (Platform.OS === "web") return selectImages(false);
    Alert.alert("Add Photo", "", [
      { text: "Camera", onPress: () => selectImages(true) },
      { text: "Gallery", onPress: () => selectImages(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const canPost = (text.trim() || images.length) && !uploading;

  return (
    <View style={styles.container}>
      {/* Input section */}
      <View style={styles.row}>
        <Image source={{ uri: profile?.avatar }} style={styles.avatar} />
        <View style={styles.inputWrap}>
          {!focused && !images.length ? (
            <TouchableOpacity onPress={() => setFocused(true)}>
              <Text style={styles.placeholder}>Start a post</Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus={focused}
              onBlur={() => !text && !images.length && setFocused(false)}
              maxLength={280}
            />
          )}
        </View>
      </View>

      {/* Image previews */}
      {images.length > 0 && (
        <ScrollView horizontal style={styles.imageScroll}>
          {images.map((uri, i) => (
            <View key={i} style={styles.imageBox}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <Ionicons name="close-circle" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={showOptions}
          style={styles.actionBtn}
          disabled={images.length >= 4}
        >
          <Ionicons
            name="image"
            size={20}
            color={images.length >= 4 ? colors.textSecondary : "#378FE9"}
          />
          <Text style={styles.actionText}>
            Photo {images.length > 0 && `(${images.length}/4)`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      {(focused || images.length > 0) && (
        <View style={styles.footer}>
          <Text style={styles.charCount}>{text.length}/280</Text>
          <TouchableOpacity
            style={[styles.postBtn, !canPost && styles.disabled]}
            disabled={!canPost}
            onPress={handleSubmit}
          >
            {uploading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.postText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const getStyles = (c: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.surface,
      borderRadius: 12,
      margin: 16,
      paddingBottom: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    row: { flexDirection: "row", padding: 16 },
    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    inputWrap: {
      flex: 1,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 24,
      paddingHorizontal: 16,
      justifyContent: "center",
    },
    placeholder: { color: c.textSecondary, fontSize: 16 },
    input: { color: c.text, fontSize: 16, minHeight: 40 },
    imageScroll: { paddingHorizontal: 16, marginBottom: 8 },
    imageBox: { marginRight: 8, position: "relative" },
    image: { width: 100, height: 100, borderRadius: 8 },
    removeBtn: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 12,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderColor: c.border,
    },
    actionBtn: { flexDirection: "row", alignItems: "center", padding: 8 },
    actionText: { color: c.textSecondary, marginLeft: 6 },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    charCount: { color: c.textSecondary, fontSize: 12 },
    postBtn: {
      backgroundColor: c.primary,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    disabled: { opacity: 0.5 },
    postText: { color: "#FFF", fontWeight: "600" },
  });
