import { useThemeColors } from "@/constants/Colors";
import { formatEngagementNumber, getTimeAgo } from "@/data/mockData";
import { Post as PostType } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PostProps {
  post: PostType;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const imageWidth = screenWidth - 80; // Account for margins and padding

export default function Post({
  post,
  onUserPress,
  onLike,
  onRepost,
  onComment,
  onShare,
}: PostProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const renderImages = () => {
    if (!post.content.images || post.content.images.length === 0) return null;

    const images = post.content.images;

    if (images.length === 1) {
      return (
        <Image
          source={{ uri: images[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    if (images.length === 2) {
      return (
        <View style={styles.imageRow}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.doubleImage}
              resizeMode="cover"
            />
          ))}
        </View>
      );
    }

    if (images.length >= 3) {
      return (
        <View style={styles.multiImageContainer}>
          <Image
            source={{ uri: images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.sideImagesContainer}>
            <Image
              source={{ uri: images[1] }}
              style={styles.sideImage}
              resizeMode="cover"
            />
            {images.length > 2 && (
              <View style={styles.sideImage}>
                <Image
                  source={{ uri: images[2] }}
                  style={styles.sideImage}
                  resizeMode="cover"
                />
                {images.length > 3 && (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>+{images.length - 3}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress?.(post.user.id)}
        >
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
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
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>{getTimeAgo(post.timestamp)}</Text>
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
          onPress={() => onComment?.(post.id)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.engagementText}>
            {formatEngagementNumber(post.engagement.comments)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => onRepost?.(post.id)}
        >
          <Ionicons
            name="repeat-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.engagementText}>
            {formatEngagementNumber(post.engagement.reposts)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => onLike?.(post.id)}
        >
          <Ionicons
            name="heart-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.engagementText}>
            {formatEngagementNumber(post.engagement.likes)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.engagementButton}
          onPress={() => onShare?.(post.id)}
        >
          <Ionicons
            name="share-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.engagementText}>
            {formatEngagementNumber(post.engagement.shares)}
          </Text>
        </TouchableOpacity>
      </View>
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
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
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
    userDetails: {
      flex: 1,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    displayName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    verifiedIcon: {
      marginLeft: 4,
    },
    username: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 1,
    },
    timestampContainer: {
      marginLeft: 8,
    },
    timestamp: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    content: {
      marginBottom: 12,
    },
    postText: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    singleImage: {
      width: imageWidth,
      height: 200,
      borderRadius: 12,
    },
    imageRow: {
      flexDirection: "row",
      gap: 4,
    },
    doubleImage: {
      width: (imageWidth - 4) / 2,
      height: 150,
      borderRadius: 8,
    },
    multiImageContainer: {
      flexDirection: "row",
      gap: 4,
      height: 200,
    },
    mainImage: {
      flex: 2,
      borderRadius: 8,
    },
    sideImagesContainer: {
      flex: 1,
      gap: 4,
    },
    sideImage: {
      flex: 1,
      borderRadius: 8,
      position: "relative",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    overlayText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
    engagement: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    engagementButton: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      paddingVertical: 8,
    },
    engagementText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
    },
  });
