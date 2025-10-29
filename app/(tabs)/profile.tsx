import ProfileActivity from "@/components/profile/ProfileActivity";
import { useThemeColors } from "@/constants/Colors";
import { usePosts } from "@/hooks/usePosts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/auth";
import type { Post } from "@/types/post";
import { getUserPosts } from "@/utils/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user: authUser } = useAuthStore();

  const { profile, loading: profileLoading, updateAvatar } = useUserProfile();
  const { handleCreatePost } = usePosts();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's posts
  const fetchUserPosts = useCallback(async () => {
    if (!authUser?.uid) return;

    try {
      setPostsLoading(true);
      const posts = await getUserPosts(authUser.uid);
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      Alert.alert("Error", "Failed to load your posts");
    } finally {
      setPostsLoading(false);
    }
  }, [authUser?.uid]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const pickImage = useCallback(async () => {
    if (!authUser?.uid) {
      Alert.alert(
        "Error",
        "You must be logged in to change your profile picture"
      );
      return;
    }

    try {
      const ImagePicker = await import("expo-image-picker");
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (perm.status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Allow photo library access to change profile picture."
        );
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!res.canceled && res.assets?.[0]?.uri) {
        // Show loading indicator
        Alert.alert("Uploading", "Updating your profile picture...");

        // Upload to Firebase Storage and update Firestore
        await updateAvatar(res.assets[0].uri);

        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    }
  }, [authUser?.uid, updateAvatar]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserPosts();
    setRefreshing(false);
  }, [fetchUserPosts]);

  const handleCreatePostAction = useCallback(async () => {
    try {
      // You can open a modal or navigate to a post creation screen
      // For now, we'll just show an alert
      Alert.alert(
        "Create Post",
        "Post creation modal will be implemented here"
      );
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post");
    }
  }, []);

  const handleLike = useCallback(async (postId: string) => {
    // Implement like functionality
    console.log("Like post:", postId);
  }, []);

  const handleComment = useCallback((postId: string) => {
    // Navigate to post detail or open comment modal
    console.log("Comment on post:", postId);
  }, []);

  const handleRepost = useCallback((postId: string) => {
    console.log("Repost:", postId);
  }, []);

  const handleShare = useCallback((postId: string) => {
    console.log("Share post:", postId);
  }, []);

  const s = styles(colors);

  // Show loading state
  if (profileLoading || postsLoading) {
    return (
      <SafeAreaView
        style={[s.container, { backgroundColor: colors.background }]}
      >
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.loadingText, { color: colors.textSecondary }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no profile
  if (!profile) {
    return (
      <SafeAreaView
        style={[s.container, { backgroundColor: colors.background }]}
      >
        <View style={s.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={[s.errorText, { color: colors.text }]}>
            Failed to load profile
          </Text>
          <TouchableOpacity
            style={[s.retryButton, { backgroundColor: colors.primary }]}
            onPress={fetchUserPosts}
          >
            <Text style={s.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.headerSpacer} />

      {/* Center page content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.pageContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        <View style={s.pageColumn}>
          {/* Header card */}
          <View
            style={[
              s.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={s.headerRow}>
              <Text style={[s.headerTitle, { color: colors.text }]}>
                Profile
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/settings" as any)}
                accessibilityRole="button"
                accessibilityLabel="Open Settings"
                style={s.iconBtn}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={s.profileRow}>
              <View>
                <Image
                  source={{
                    uri: profile.avatar || "https://i.pravatar.cc/120?img=5",
                  }}
                  style={s.avatar}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  style={[
                    s.editBadge,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={14} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={s.infoCol}>
                <Text
                  style={[s.name, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {profile.displayName || profile.username || "User"}
                </Text>
                <Text
                  style={[s.meta, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  @{profile.username || "username"}
                </Text>
                {profile.prn && (
                  <Text
                    style={[s.meta, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    PRN: {profile.prn}
                  </Text>
                )}
                {profile.department && (
                  <Text
                    style={[s.meta, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    Department: {profile.department}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Activity card */}
          <ProfileActivity
            posts={userPosts}
            isOwnProfile
            onCreatePost={handleCreatePostAction}
            onUserPress={() => {}}
            onLike={handleLike}
            onRepost={handleRepost}
            onComment={handleComment}
            onShare={handleShare}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PAGE_MAX_WIDTH = 700;

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    headerSpacer: { height: 56 },
    pageContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      alignItems: "center",
    },
    pageColumn: {
      width: "100%",
      maxWidth: PAGE_MAX_WIDTH,
      alignSelf: "center",
      gap: 16,
    },
    card: {
      alignSelf: "center",
      width: "100%",
      maxWidth: 720,
      marginHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    headerTitle: { fontSize: 18, fontWeight: "700" },
    iconBtn: { padding: 6, borderRadius: 8 },
    profileRow: { flexDirection: "row", gap: 12, alignItems: "center" },
    avatar: { width: 84, height: 84, borderRadius: 42 },
    editBadge: {
      position: "absolute",
      right: -6,
      bottom: -6,
      padding: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    infoCol: { flex: 1, minWidth: 0 },
    name: { fontSize: 18, fontWeight: "700" },
    meta: { fontSize: 12, marginTop: 2 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      paddingHorizontal: 32,
    },
    errorText: {
      fontSize: 16,
      fontWeight: "600",
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    retryButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });
