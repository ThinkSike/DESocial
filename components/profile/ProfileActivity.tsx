import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileActivityProps {
  posts: PostType[];
  followersCount: number;
  isOwnProfile?: boolean;
  onCreatePost?: () => void;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

type ActivityTab = "posts" | "comments" | "images" | "documents";

export default function ProfileActivity({
  posts,
  followersCount,
  isOwnProfile = false,
  onCreatePost,
  onUserPress,
  onLike,
  onRepost,
  onComment,
  onShare,
}: ProfileActivityProps) {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<ActivityTab>("posts");

  const filterPostsByTab = (tab: ActivityTab) => {
    switch (tab) {
      case "posts":
        return posts;
      case "comments":
        // Filter posts that are replies/comments
        return posts.filter((post) => post.content.text?.includes("@"));
      case "images":
        return posts.filter(
          (post) => post.content.images && post.content.images.length > 0,
        );
      case "documents":
        // In a real app, you'd filter for document attachments
        return posts.slice(0, 2);
      default:
        return posts;
    }
  };

  const getTabIcon = (tab: ActivityTab) => {
    switch (tab) {
      case "posts":
        return "document-text";
      case "comments":
        return "chatbubble";
      case "images":
        return "image";
      case "documents":
        return "document";
      default:
        return "document-text";
    }
  };

  const getTabCount = (tab: ActivityTab) => {
    return filterPostsByTab(tab).length;
  };

  const ActivityTab = ({ tab, label }: { tab: ActivityTab; label: string }) => (
    <TouchableOpacity
      style={[
        styles(colors).tab,
        activeTab === tab && styles(colors).activeTab,
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={getTabIcon(tab) as any}
        size={18}
        color={activeTab === tab ? colors.primary : colors.textSecondary}
      />
      <Text
        style={[
          styles(colors).tabLabel,
          activeTab === tab && styles(colors).activeTabLabel,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles(colors).tabCount,
          activeTab === tab && styles(colors).activeTabCount,
        ]}
      >
        {getTabCount(tab)}
      </Text>
    </TouchableOpacity>
  );

  const filteredPosts = filterPostsByTab(activeTab);

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Text style={styles(colors).title}>Activity</Text>
        <Text style={styles(colors).subtitle}>
          {followersCount.toLocaleString()} followers
        </Text>
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

      <View style={styles(colors).tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(colors).tabsScrollContent}
        >
          <ActivityTab tab="posts" label="Posts" />
          <ActivityTab tab="comments" label="Comments" />
          <ActivityTab tab="images" label="Images" />
          <ActivityTab tab="documents" label="Documents" />
        </ScrollView>
      </View>

      <View style={styles(colors).contentContainer}>
        {filteredPosts.length > 0 ? (
          <View style={styles(colors).postsContainer}>
            {filteredPosts.slice(0, 3).map((post) => (
              <View key={post.id} style={styles(colors).postItem}>
                <Text style={styles(colors).postText} numberOfLines={3}>
                  {post.content.text}
                </Text>
                <View style={styles(colors).postMeta}>
                  <Text style={styles(colors).postDate}>
                    {post.timestamp.toLocaleDateString()}
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

            <TouchableOpacity style={styles(colors).showAllButton}>
              <Text style={styles(colors).showAllText}>
                Show all {activeTab} ({filteredPosts.length})
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles(colors).emptyState}>
            <Ionicons
              name={getTabIcon(activeTab) as any}
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles(colors).emptyStateText}>
              No {activeTab} yet
            </Text>
            {isOwnProfile && activeTab === "posts" && (
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
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || colors.background,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
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
      borderBottomColor: colors.border || "#E1E8ED",
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
    tabsContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    tabsScrollContent: {
      paddingHorizontal: 16,
    },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginRight: 8,
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
      marginRight: 4,
    },
    activeTabLabel: {
      color: colors.primary,
      fontWeight: "500",
    },
    tabCount: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    activeTabCount: {
      color: colors.primary,
      fontWeight: "500",
    },
    contentContainer: {
      padding: 16,
    },
    postsContainer: {
      gap: 16,
    },
    postItem: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
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
