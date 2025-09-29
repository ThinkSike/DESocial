import { useThemeColors } from "@/constants/Colors";
import { formatEngagementNumber, getTimeAgo } from "@/data/mockData";
import { Post } from "@/types/post";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PostGridItemProps {
  post: Post;
  onPress: (postId: string) => void;
}

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 48) / 3; // 3 columns with padding

export const PostGridItem: React.FC<PostGridItemProps> = ({
  post,
  onPress,
}) => {
  const colors = useThemeColors();
  const hasImages = post.content.images && post.content.images.length > 0;
  const displayImage = hasImages ? post.content.images![0] : null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress(post.id)}
    >
      {displayImage ? (
        <Image source={{ uri: displayImage }} style={styles.image} />
      ) : (
        <View style={[styles.textPost, { backgroundColor: colors.border }]}>
          <Text
            style={[styles.postText, { color: colors.textPrimary }]}
            numberOfLines={6}
          >
            {post.content.text}
          </Text>
        </View>
      )}

      {/* Overlay with engagement info */}
      <View style={styles.overlay}>
        <View style={styles.engagementRow}>
          <View style={styles.engagementItem}>
            <Text style={styles.engagementText}>♥</Text>
            <Text style={styles.engagementNumber}>
              {formatEngagementNumber(post.engagement.likes)}
            </Text>
          </View>
          <View style={styles.engagementItem}>
            <Text style={styles.engagementText}>💬</Text>
            <Text style={styles.engagementNumber}>
              {formatEngagementNumber(post.engagement.comments)}
            </Text>
          </View>
        </View>
      </View>

      {/* Multiple images indicator */}
      {hasImages && post.content.images!.length > 1 && (
        <View style={styles.multipleImagesIndicator}>
          <Text style={styles.multipleImagesText}>📷</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface PostSearchResultProps {
  post: Post;
  onPress: (postId: string) => void;
  onUserPress: (userId: string) => void;
}

export const PostSearchResult: React.FC<PostSearchResultProps> = ({
  post,
  onPress,
  onUserPress,
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.listContainer,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => onPress(post.id)}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress(post.user.id)}
        >
          <Image
            source={{
              uri: post.user.avatar || "https://i.pravatar.cc/150?img=1",
            }}
            style={styles.avatar}
          />
          <View>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.textPrimary }]}>
                {post.user.displayName}
              </Text>
              {post.user.verified && (
                <View
                  style={[
                    styles.verifiedBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{post.user.username} • {getTimeAgo(post.timestamp)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {post.content.text && (
        <Text
          style={[styles.postContentText, { color: colors.textPrimary }]}
          numberOfLines={3}
        >
          {post.content.text}
        </Text>
      )}

      {post.content.images && post.content.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.content.images[0] }}
            style={styles.postImage}
          />
          {post.content.images.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>
                +{post.content.images.length - 1}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.engagementFooter}>
        <Text style={[styles.engagementStat, { color: colors.textSecondary }]}>
          {formatEngagementNumber(post.engagement.likes)} likes
        </Text>
        <Text style={[styles.engagementStat, { color: colors.textSecondary }]}>
          {formatEngagementNumber(post.engagement.comments)} comments
        </Text>
        <Text style={[styles.engagementStat, { color: colors.textSecondary }]}>
          {formatEngagementNumber(post.engagement.reposts)} reposts
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid item styles
  container: {
    width: itemWidth,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textPost: {
    width: "100%",
    height: "100%",
    padding: 8,
    justifyContent: "center",
  },
  postText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 6,
  },
  engagementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  engagementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  engagementText: {
    color: "white",
    fontSize: 10,
  },
  engagementNumber: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  multipleImagesIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  multipleImagesText: {
    fontSize: 10,
  },

  // List item styles
  listContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  displayName: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
  username: {
    fontSize: 12,
  },
  postContentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  imageContainer: {
    marginBottom: 8,
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  engagementFooter: {
    flexDirection: "row",
    gap: 16,
  },
  engagementStat: {
    fontSize: 12,
  },
});
