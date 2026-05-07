import ProfileActivity from "@/components/profile/ProfileActivity";
import { useThemeColors } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { profile, loading: profileLoading, updateAvatar } = useUserProfile();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    if (!authUser?.id) return;
    try {
      setLoading(true);
      const posts = await api.get<Post[]>(`/api/users/${authUser.id}/posts`);
      setUserPosts(posts);
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
        {/* Header */}
        <View style={[s.card, { backgroundColor: colors.surface }]}>
          <View style={s.header}>
            <Text style={[s.title, { color: colors.text }]}>Profile</Text>
            <TouchableOpacity onPress={() => router.push("/settings" as any)}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View style={s.profileRow}>
            <View>
              <Image
                source={{
                  uri: profile.avatar || "https://i.pravatar.cc/120?img=5",
                }}
                style={s.avatar}
              />
              <TouchableOpacity style={s.editBadge} onPress={pickImage}>
                <Ionicons name="camera" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={s.info}>
              <Text style={[s.name, { color: colors.text }]}>
                {profile.displayName || "User"}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                @{profile.username || "username"}
              </Text>
              {profile.prn && (
                <Text style={{ color: colors.textSecondary }}>
                  PRN: {profile.prn}
                </Text>
              )}
              {profile.department && (
                <Text style={{ color: colors.textSecondary }}>
                  Dept: {profile.department}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Activity */}
        <ProfileActivity posts={userPosts} isOwnProfile />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    scroll: { padding: 16, alignItems: "center" },
    card: {
      width: "100%",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors?.border,
      padding: 16,
      marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: { fontSize: 18, fontWeight: "700" },
    profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatar: { width: 84, height: 84, borderRadius: 42 },
    editBadge: {
      position: "absolute",
      right: -6,
      bottom: -6,
      padding: 6,
      backgroundColor: colors?.surface,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors?.border,
    },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: "700" },
    retryBtn: {
      marginTop: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: { color: "#fff", fontWeight: "600" },
  });
