import ProfileActivity from "@/components/profile/ProfileActivity";
import ProfileAnalytics from "@/components/profile/ProfileAnalytics";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useThemeColors } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { profile, loading: profileLoading, updateAvatar } = useUserProfile();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    if (!authUser?.id) return;
    try {
      setLoading(true);
      const [posts, comments] = await Promise.all([
        api.get<Post[]>(`/api/users/${authUser.id}/posts`),
        api.get<any[]>(`/api/users/${authUser.id}/comments`),
      ]);
      setUserPosts(posts);
      setUserComments(comments);
    } catch (error) {
      Alert.alert("Error", "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const pickImage = useCallback(async () => {
    if (!authUser?.id) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    try {
      const ImagePicker = await import("expo-image-picker");
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (perm.status !== "granted") {
        Alert.alert("Permission", "Allow photo access to change your picture");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (!res.canceled && res.assets?.[0]?.uri) {
        Alert.alert("Updating", "Uploading your new picture...");
        await updateAvatar(res.assets[0].uri);
        Alert.alert("Done", "Profile picture updated!");
      }
    } catch {
      Alert.alert("Error", "Could not update profile picture");
    }
  }, [authUser?.id, updateAvatar]);

  const s = styles(colors);

  if (profileLoading || loading) {
    return (
      <SafeAreaView style={[s.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={[s.center, { backgroundColor: colors.background }]}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.textSecondary}
        />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Failed to load profile
        </Text>
        <TouchableOpacity
          style={[s.retryBtn, { backgroundColor: colors.primary }]}
          onPress={fetchUserPosts}
        >
          <Text style={s.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchUserPosts();
              setRefreshing(false);
            }}
          />
        }
      >
        {/* Rich profile header with cover photo + centered avatar */}
        <ProfileHeader
          user={profile}
          isOwnProfile
          onAvatarPress={pickImage}
          onSettingsPress={() => router.push("/settings" as any)}
        />

        {/* Analytics card */}
        <ProfileAnalytics />

        {/* Activity / posts */}
        <ProfileActivity posts={userPosts} comments={userComments} isOwnProfile />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    scroll: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    retryBtn: {
      marginTop: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: { color: "#fff", fontWeight: "600" },
  });
