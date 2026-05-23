import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import { formatEngagementNumber, getTimeAgo } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PostProps {
  post: PostType;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onDelete?: (postId: string) => void | Promise<void>;
  /** ID of the currently logged-in user — used to show/hide delete */
  currentUserId?: string;
}

const MAX_CONTENT_WIDTH = 600;

export default function Post({
  post,
  onUserPress,
  onLike,
  onComment,
  onDelete,
  currentUserId,
}: PostProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [menuVisible, setMenuVisible] = useState(false);

  const isOwnPost = !!currentUserId && currentUserId === post.user.id;
  const likedByMe = !!post.likedByMe;
  const hasComments = (post.engagement?.comments ?? 0) > 0;
  const likeColor = likedByMe ? "#E53935" : colors.textSecondary;
  const commentColor = hasComments ? colors.primary : colors.textSecondary;
  const likeCountColor = colors.textSecondary;

  const handleDeletePress = () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete post",
      "This can't be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const result = onDelete?.(post.id);
            if (result instanceof Promise) {
              result.catch(() =>
                Alert.alert("Error", "Could not delete post. Please try again."),
              );
            }
          },
        },
      ]
    );
  };

  const renderImages = () => {
    const raw = post.content.images;
    if (!raw) return null;
    const images = Array.isArray(raw) ? raw : [raw];
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <TouchableOpacity activeOpacity={0.95}>
          <Image
            source={{ uri: images[0] }}
            style={styles.singleImage}
            contentFit="contain"
            transition={200}
          />
        </TouchableOpacity>
      );
    }

    if (images.length === 2) {
      return (
        <View style={styles.imageRow}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.95}
              style={{ flex: 1 }}
            >
              <Image
                source={{ uri: image }}
                style={styles.multiImage}
                contentFit="contain"
                transition={200}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.imageGrid}>
        {images.slice(0, 4).map((image, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.95}
            style={styles.gridItem}
          >
            <Image
              source={{ uri: image }}
              style={styles.gridImage}
              contentFit="contain"
              transition={200}
            />
            {index === 3 && images.length > 4 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>+{images.length - 4}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress?.(post.user.id)}
        >
          <Image
            source={{ uri: post.user.avatar }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.displayName}>{post.user.displayName}</Text>
              {post.user.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <Text style={styles.username}>@{post.user.username}</Text>
          </View>
        </TouchableOpacity>

        {/* Timestamp + three-dot menu */}
        <View style={styles.headerRight}>
          <Text style={styles.timestamp}>{getTimeAgo(post.timestamp)}</Text>
          {isOwnPost && (
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => setMenuVisible(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {post.content.text && (
          <Text style={styles.postText}>{post.content.text}</Text>
        )}
        {renderImages()}
      </View>

      {/* Engagement */}
      <View style={styles.engagement}>
        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => onLike?.(post.id)}
        >
          <Ionicons
            name={likedByMe ? "heart" : "heart-outline"}
            size={18}
            color={likeColor}
          />
          <Text style={[styles.engagementText, { color: likeCountColor }]}>
            {formatEngagementNumber(post.engagement.likes)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => onComment?.(post.id)}
        >
          <Ionicons
            name={hasComments ? "chatbubble" : "chatbubble-outline"}
            size={18}
            color={commentColor}
          />
          <Text style={[styles.engagementText, { color: commentColor }]}>
            {formatEngagementNumber(post.engagement.comments)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Options bottom sheet / modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuVisible(false)}>
          <Pressable style={[styles.menuSheet, { backgroundColor: colors.surface }]}>
            {/* Delete */}
            <TouchableOpacity style={styles.menuItem} onPress={handleDeletePress}>
              <Ionicons name="trash-outline" size={20} color="#E53935" />
              <Text style={[styles.menuItemText, { color: "#E53935" }]}>
                Delete post
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || colors.background,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3.84,
      elevation: 3,
      ...(Platform.OS === "web" && {
        maxWidth: MAX_CONTENT_WIDTH + 32,
        alignSelf: "center",
        width: "100%",
      }),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    userInfo: {
      flexDirection: "row",
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    userDetails: { flex: 1 },
    nameRow: { flexDirection: "row", alignItems: "center" },
    displayName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary || colors.text,
    },
    verifiedIcon: { marginLeft: 4 },
    username: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 1,
    },
    headerRight: {
      alignItems: "flex-end",
      gap: 4,
    },
    timestamp: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    menuBtn: {
      padding: 2,
    },
    content: { marginBottom: 12 },
    postText: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.textPrimary || colors.text,
      marginBottom: 12,
    },
    singleImage: {
      width: "100%",
      height: 300,
      borderRadius: 12,
      backgroundColor: colors.background,
    },
    imageRow: {
      flexDirection: "row",
      gap: 8,
      width: "100%",
    },
    multiImage: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    imageGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      width: "100%",
    },
    gridItem: { width: "48%", position: "relative" },
    gridImage: {
      width: "100%",
      height: 150,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    overlayText: { color: "white", fontSize: 24, fontWeight: "700" },
    engagement: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 8,
      marginTop: 4,
    },
    engagementButton: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      paddingVertical: 6,
    },
    engagementText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    // Modal / sheet
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
    },
    menuSheet: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingVertical: 8,
      paddingBottom: Platform.OS === "ios" ? 32 : 8,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 14,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: "500",
    },
    menuDivider: {
      height: 1,
      marginHorizontal: 16,
    },
  });
