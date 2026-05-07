import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
  isOwnProfile?: boolean;
  onCreatePost?: () => void;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

type ActivityTab = "posts" | "comments";

export default function ProfileActivity({
  posts,
  isOwnProfile = false,
  onCreatePost,
}: ProfileActivityProps) {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<ActivityTab>("posts");
  const [showAll, setShowAll] = useState(false);

  const filterPostsByTab = (tab: ActivityTab) => {
    switch (tab) {
      case "posts":
        return posts;
      case "comments":
        return posts.filter((post) => post.content.text?.includes("@"));
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

      <View style={styles(colors).tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(colors).tabsScrollContent}
        >
          <ActivityTab tab="posts" label="Posts" />
          <ActivityTab tab="comments" label="Comments" />
        </ScrollView>
      </View>

      <View style={styles(colors).contentContainer}>
        {filteredPosts.length > 0 ? (
          <View style={styles(colors).postsContainer}>
            {(showAll ? filteredPosts : filteredPosts.slice(0, 3)).map(
              (post) => (
                <View key={post.id} style={styles(colors).postItem}>
                  {post.content.images?.length > 0 && (
                    <Image
                      source={{ uri: post.content.images[0] }}
                      style={styles(colors).postImage}
                      contentFit="cover" // Added for expo-image
                      transition={200} // Smooth transition for image loading
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
              )
            )}

            {!showAll && filteredPosts.length > 3 && (
              <TouchableOpacity
                style={styles(colors).showAllButton}
                onPress={() => setShowAll(true)}
              >
                <Text style={styles(colors).showAllText}>
                  Show all {activeTab} ({filteredPosts.length})
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
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
    tabsContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
