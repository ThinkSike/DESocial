import PostList from "@/components/PostList";
import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileHeader from "./ProfileHeader";

interface ProfileFeedProps {
  user: UserProfile;
  posts: PostType[];
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onSettingsPress?: () => void;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onRefresh?: () => void;
  onPostsPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  refreshing?: boolean;
}

type FeedType = "posts" | "replies" | "media" | "likes";

export default function ProfileFeed({
  user,
  posts,
  isOwnProfile = false,
  onEditProfile,
  onSettingsPress,
  onUserPress,
  onLike,
  onRepost,
  onComment,
  onShare,
  onRefresh,
  onPostsPress,
  onFollowersPress,
  onFollowingPress,
  refreshing = false,
}: ProfileFeedProps) {
  const colors = useThemeColors();
  const [selectedFeed, setSelectedFeed] = useState<FeedType>("posts");

  const filterPosts = () => {
    switch (selectedFeed) {
      case "posts":
        return posts;
      case "replies":
        // In a real app, you'd filter posts that are replies
        return posts.filter((post) => post.content.text?.includes("@"));
      case "media":
        return posts.filter(
          (post) => post.content.images && post.content.images.length > 0
        );
      case "likes":
        // In a real app, you'd fetch liked posts
        return posts.slice(0, 3);
      default:
        return posts;
    }
  };

  const FeedTab = ({
    type,
    icon,
    label,
  }: {
    type: FeedType;
    icon: string;
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles(colors).tab,
        selectedFeed === type && styles(colors).activeTab,
      ]}
      onPress={() => setSelectedFeed(type)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={selectedFeed === type ? colors.primary : colors.textSecondary}
      />
      <Text
        style={[
          styles(colors).tabLabel,
          selectedFeed === type && styles(colors).activeTabLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredPosts = filterPosts();

  // Custom header component that includes profile header and tabs
  const ListHeaderComponent = () => (
    <View>
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onEditProfile={onEditProfile}
        onSettingsPress={onSettingsPress}
        onPostsPress={onPostsPress}
        onFollowersPress={onFollowersPress}
        onFollowingPress={onFollowingPress}
      />

      {/* Feed tabs */}
      <View style={styles(colors).tabContainer}>
        <FeedTab type="posts" icon="grid-outline" label="Posts" />
        <FeedTab type="replies" icon="chatbubble-outline" label="Replies" />
        <FeedTab type="media" icon="image-outline" label="Media" />
        <FeedTab type="likes" icon="heart-outline" label="Likes" />
      </View>
    </View>
  );

  return (
    <View style={styles(colors).container}>
      <PostList
        posts={filteredPosts}
        onUserPress={onUserPress}
        onLike={onLike}
        onRepost={onRepost}
        onComment={onComment}
        onShare={onShare}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      gap: 8,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeTabLabel: {
      color: colors.primary,
      fontWeight: "600",
    },
  });
