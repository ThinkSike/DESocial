import { useThemeColors } from "@/constants/Colors";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import React from "react";
import { StyleSheet } from "react-native";

type ProfileFeedProps = {
  user: UserProfile;
  posts: Post[];
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onSettingsPress?: () => void;
  onUserPress: (userId: string) => void;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onRefresh: () => void;
  onPostsPress?: () => void;
  refreshing: boolean;
};

export default function ProfileFeed(props: ProfileFeedProps) {
  const {
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
    refreshing = false,
  } = props;

  const colors = useThemeColors();

  const handleCreatePost = () => {
    // Navigate to create post screen or show modal
    console.log("Create post");
  };

  const handleEditAbout = () => {
    // Navigate to edit about section
    console.log("Edit about");
  };

  return (
    <>
      GitHub Copilot

      Do you want to:
      1) remove the followersCount prop/logic from the ProfileActivity type/component (so it is no longer required), or
      2) keep the prop but stop showing followers count in the UI?

      Tell me which and I’ll provide the exact code change (or the updated $SELECTION_PLACEHOLDER$).
    </>
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
