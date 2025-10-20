import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import { UserProfile } from "@/types/profile";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import ProfileAbout from "./ProfileAbout";
import ProfileActivity from "./ProfileActivity";
import ProfileAnalytics from "./ProfileAnalytics";
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

  // Mock analytics data - in a real app, this would come from props or API
  const analyticsData = {
    profileViews: 186,
    postImpressions: 163,
    searchAppearances: 23,
  };

  const handleCreatePost = () => {
    // Navigate to create post screen or show modal
    console.log("Create post");
  };

  const handleEditAbout = () => {
    // Navigate to edit about section
    console.log("Edit about");
  };

  const handleViewAllAnalytics = () => {
    // Navigate to full analytics page
    console.log("View all analytics");
  };

  return (
    <ScrollView 
      style={styles(colors).container}
      contentContainerStyle={styles(colors).contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onEditProfile={onEditProfile}
        onSettingsPress={onSettingsPress}
        onPostsPress={onPostsPress}
        onFollowersPress={onFollowersPress}
        onFollowingPress={onFollowingPress}
      />

      {/* Analytics Section - Only show for own profile */}
      {isOwnProfile && (
        <ProfileAnalytics
          analytics={analyticsData}
          onViewAll={handleViewAllAnalytics}
        />
      )}

      {/* About Section */}
      <ProfileAbout
        user={user}
        isOwnProfile={isOwnProfile}
        onEdit={handleEditAbout}
      />

      {/* Activity Section */}
      <ProfileActivity
        posts={posts}
        followersCount={user.stats.followersCount}
        isOwnProfile={isOwnProfile}
        onCreatePost={handleCreatePost}
        onUserPress={onUserPress}
        onLike={onLike}
        onRepost={onRepost}
        onComment={onComment}
        onShare={onShare}
      />
    </ScrollView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: 0,
      paddingBottom: 20,
    },
  });
