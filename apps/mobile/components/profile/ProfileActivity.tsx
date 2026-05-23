import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface ProfileActivityProps {
  posts: PostType[];
  comments?: ProfileComment[];
  isOwnProfile?: boolean;
  onCreatePost?: () => void;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

interface ProfileComment {
  id: number;
  text: string;
  createdAt: string | Date;
  post: {
    id: number | string;
    text?: string | null;
    images?: string[] | null;
    createdAt?: string | Date;
    user?: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string | null;
      verified?: boolean;
    } | null;
  } | null;
}

export default function ProfileActivity({
  posts,
  comments = [],
  isOwnProfile = false,
  onCreatePost,
}: ProfileActivityProps) {
  const colors = useThemeColors();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const safeDate = (value: any) => {
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Text style={styles(colors).title}>Activity</Text>
        <Text style={styles(colors).subtitle}>Your recent activity</Text>
      </View>

      {isOwnProfile && (
        <View style={styles(colors).createPostSection}>
          <TouchableOpacity
            style={styles(colors).createPostButton}
            onPress={onCreatePost}
          >
            <Text style={styles(colors).createPostText}>Create a post</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles(colors).contentContainer}>
        <View style={styles(colors).sectionHeader}>
          <Text style={styles(colors).sectionTitle}>Posts</Text>
          <Text style={styles(colors).sectionCount}>{posts.length}</Text>
        </View>

        {posts.length > 0 ? (
          <View style={styles(colors).postsContainer}>
            {(showAllPosts ? posts : posts.slice(0, 3)).map((post) => (
              <View key={post.id} style={styles(colors).postItem}>
                {post.content.images?.length > 0 && (
                  <Image
                    source={{ uri: post.content.images[0] }}
                    style={styles(colors).postImage}
                    contentFit="cover"
                    transition={200}
                  />
                )}
                <Text style={styles(colors).postText} numberOfLines={3}>
                  {post.content.text}
                </Text>
                <View style={styles(colors).postMeta}>
                  <Text style={styles(colors).postDate}>
                    {safeDate(post.timestamp)}
                  </Text>
                  <View style={styles(colors).postStats}>
                    <Text style={styles(colors).postStat}>
                      {post.engagement.likes} likes
                    </Text>
                    <Text style={styles(colors).postStat}>
                      {post.engagement.comments} comments
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {posts.length > 3 && (
              <TouchableOpacity
                style={styles(colors).showAllButton}
                onPress={() => setShowAllPosts((prev) => !prev)}
              >
                <Text style={styles(colors).showAllText}>
                  {showAllPosts
                    ? "Show less"
                    : `Show more (${posts.length})`}
                </Text>
                <Ionicons
                  name={showAllPosts ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles(colors).emptyState}>
            <Ionicons name="document-text" size={48} color={colors.textSecondary} />
            <Text style={styles(colors).emptyStateText}>No posts yet</Text>
            {isOwnProfile && (
              <TouchableOpacity
                style={styles(colors).emptyStateButton}
                onPress={onCreatePost}
              >
                <Text style={styles(colors).emptyStateButtonText}>
                  Create your first post
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles(colors).sectionHeader}>
          <Text style={styles(colors).sectionTitle}>Comments</Text>
          <Text style={styles(colors).sectionCount}>{comments.length}</Text>
        </View>

        {comments.length > 0 ? (
          <View style={styles(colors).postsContainer}>
            {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
              <View key={comment.id} style={styles(colors).postItem}>
                <Text style={styles(colors).postText} numberOfLines={3}>
                  {comment.text}
                </Text>
                {comment.post?.text && (
                  <Text style={styles(colors).commentPostText} numberOfLines={2}>
                    On: {comment.post.text}
                  </Text>
                )}
                <View style={styles(colors).postMeta}>
                  <Text style={styles(colors).postDate}>
                    {safeDate(comment.createdAt)}
                  </Text>
                </View>
              </View>
            ))}

            {comments.length > 3 && (
              <TouchableOpacity
                style={styles(colors).showAllButton}
                onPress={() => setShowAllComments((prev) => !prev)}
              >
                <Text style={styles(colors).showAllText}>
                  {showAllComments
                    ? "Show less"
                    : `Show more (${comments.length})`}
                </Text>
                <Ionicons
                  name={showAllComments ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles(colors).emptyState}>
            <Ionicons name="chatbubble" size={48} color={colors.textSecondary} />
            <Text style={styles(colors).emptyStateText}>No comments yet</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 700,
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 16,
      backgroundColor: colors.surface || colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    createPostSection: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    createPostButton: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 24,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    createPostText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    contentContainer: {
      padding: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    sectionCount: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    postsContainer: {
      gap: 16,
    },
    postItem: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    postImage: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 8,
    },
    postText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginBottom: 8,
    },
    postMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    commentPostText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    postDate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    postStats: {
      flexDirection: "row",
      gap: 12,
    },
    postStat: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    showAllButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      gap: 8,
    },
    showAllText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 32,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 12,
      marginBottom: 16,
    },
    emptyStateButton: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    emptyStateButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.background,
    },
  });
