import { useThemeColors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Profile components
import ProfileFeed from "@/components/profile/ProfileFeed";

// Data
import { getCurrentUserPosts, mockCurrentUser } from "@/data/profileData";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(getCurrentUserPosts());
  const [userProfile, setUserProfile] = useState(mockCurrentUser);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would fetch updated profile and posts from Firebase here
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push("/settings" as any);
  }, [router]);

  const handleEditProfile = useCallback(() => {
    // Navigate to edit profile screen
    Alert.alert("Edit Profile", "Navigate to edit profile screen");
  }, []);

  const handlePostsPress = useCallback(() => {
    // Scroll to posts or show posts modal
    Alert.alert("Posts", "Show all posts");
  }, []);

  const handleFollowersPress = useCallback(() => {
    // Navigate to followers screen
    Alert.alert("Followers", "Navigate to followers list");
  }, []);

  const handleFollowingPress = useCallback(() => {
    // Navigate to following screen
    Alert.alert("Following", "Navigate to following list");
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    // Navigate to user profile
    Alert.alert("User Profile", `Navigate to profile for user: ${userId}`);
  }, []);

  const handleLike = useCallback((postId: string) => {
    // Update like count in Firebase
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                likes: post.engagement.likes + 1,
              },
            }
          : post
      )
    );
  }, []);

  const handleRepost = useCallback((postId: string) => {
    // Handle reposting in Firebase
    Alert.alert("Repost", `Repost functionality for post: ${postId}`);
  }, []);

  const handleComment = useCallback((postId: string) => {
    // Navigate to comments screen
    Alert.alert("Comments", `Navigate to comments for post: ${postId}`);
  }, []);

  const handleShare = useCallback((postId: string) => {
    // Handle sharing functionality
    Alert.alert("Share", `Share functionality for post: ${postId}`);
  }, []);

  return (
    <SafeAreaView style={styles(colors).container}>
      <ProfileFeed
        user={userProfile}
        posts={posts}
        isOwnProfile={true}
        onEditProfile={handleEditProfile}
        onSettingsPress={handleSettingsPress}
        onUserPress={handleUserPress}
        onLike={handleLike}
        onRepost={handleRepost}
        onComment={handleComment}
        onShare={handleShare}
        onRefresh={handleRefresh}
        onPostsPress={handlePostsPress}
        onFollowersPress={handleFollowersPress}
        onFollowingPress={handleFollowingPress}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
