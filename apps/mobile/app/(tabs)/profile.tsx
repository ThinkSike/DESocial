import ProfileActivity from "@/components/profile/ProfileActivity";
import ProfileAnalytics from "@/components/profile/ProfileAnalytics";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useThemeColors } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { bottom } = require("react-native-safe-area-context").useSafeAreaInsets();
  const router = useRouter();
  const { userId: routeUserId } = useLocalSearchParams<{ userId?: string | string[] }>();
  const { user: authUser, hydrate } = useAuthStore();
  const viewedUserId = useMemo(() => {
    if (typeof routeUserId === "string") return routeUserId;
    return undefined;
  }, [routeUserId]);
  const targetUserId = viewedUserId || authUser?.id;
  const isOwnProfile = !viewedUserId || viewedUserId === authUser?.id;
  const { profile, loading: profileLoading, updateAvatar } = useUserProfile(targetUserId);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [followingActionLoading, setFollowingActionLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerDelta, setFollowerDelta] = useState(0);
  const isWaitingForOwnProfile = !viewedUserId && !authUser?.id;

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || "");
    setUsername(profile.username || "");
    setBio(profile.bio || "");
    setIsFollowing(Boolean((profile as any).isFollowing));
    setFollowerDelta(0);
  }, [profile]);

  const displayedProfile = useMemo(() => {
    if (!profile) return null;

    return {
      ...profile,
      stats: {
        ...profile.stats,
        followers: Math.max(0, profile.stats.followers + followerDelta),
      },
    };
  }, [followerDelta, profile]);

  const fetchUserPosts = useCallback(async () => {
    if (!targetUserId) return;
    try {
      setLoading(true);
      const [posts, comments] = await Promise.all([
        api.get<Post[]>(`/api/users/${targetUserId}/posts`),
        api.get<any[]>(`/api/users/${targetUserId}/comments`),
      ]);
      setUserPosts(posts);
      setUserComments(comments);
    } catch (error) {
      Alert.alert("Error", "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleFollowToggle = useCallback(async () => {
    if (!targetUserId || isOwnProfile) return;

    try {
      setFollowingActionLoading(true);
      if (isFollowing) {
        await api.delete(`/api/users/${targetUserId}/follow`);
        setIsFollowing(false);
        setFollowerDelta((prev) => prev - 1);
      } else {
        await api.post(`/api/users/${targetUserId}/follow`);
        setIsFollowing(true);
        setFollowerDelta((prev) => prev + 1);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Could not update follow status");
    } finally {
      setFollowingActionLoading(false);
    }
  }, [isFollowing, isOwnProfile, targetUserId]);

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
        await hydrate();
        Alert.alert("Done", "Profile picture updated!");
      }
    } catch {
      Alert.alert("Error", "Could not update profile picture");
    }
  }, [authUser?.id, hydrate, updateAvatar]);

  const saveProfile = useCallback(async () => {
    if (!profile) return;

    const nextDisplayName = displayName.trim();
    const nextUsername = username.trim();
    const nextBio = bio.trim();

    if (!nextDisplayName || !nextUsername) {
      Alert.alert("Missing info", "Display name and username are required.");
      return;
    }

    try {
      setSavingProfile(true);
      await api.patch(`/api/users/${profile.id}`, {
        displayName: nextDisplayName,
        username: nextUsername,
        bio: nextBio,
      });
      await hydrate();
      await fetchUserPosts();
      setEditVisible(false);
      Alert.alert("Saved", "Profile updated successfully.");
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }, [bio, displayName, fetchUserPosts, hydrate, profile, username]);

  const s = styles(colors);

  if (profileLoading || loading || isWaitingForOwnProfile) {
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
        <View style={s.contentWrapper}>
          {/* Rich profile header with cover photo + centered avatar */}
          <ProfileHeader
            user={displayedProfile}
            isOwnProfile={isOwnProfile}
            onEditProfile={isOwnProfile ? () => setEditVisible(true) : undefined}
            onFollowToggle={isOwnProfile ? undefined : handleFollowToggle}
            onAvatarPress={pickImage}
            onSettingsPress={isOwnProfile ? () => router.push("/settings" as any) : undefined}
            isFollowing={isFollowing}
            isFollowLoading={followingActionLoading}
          />

          {/* Analytics card */}
          <ProfileAnalytics
            analytics={{
              profileViews: displayedProfile?.stats.profileViews ?? 0,
              followers: displayedProfile?.stats.followers ?? 0,
              following: displayedProfile?.stats.following ?? 0,
            }}
          />

          {/* Activity / posts */}
          <ProfileActivity
            posts={userPosts}
            comments={userComments}
            isOwnProfile={isOwnProfile}
          />
        </View>
      </ScrollView>

      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <TouchableOpacity
          style={s.modalBackdrop}
          activeOpacity={1}
          onPress={() => setEditVisible(false)}
        />
        <KeyboardAvoidingView
          behavior="padding"
          style={[s.modalSheet, { paddingBottom: bottom + 16, backgroundColor: colors.surface }]}
        >
          <View style={s.modalHandle} />
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: colors.text }]}>Edit profile</Text>
            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>Display name</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>Username</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="username"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>Bio</Text>
            <TextInput
              style={[s.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio"
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[s.saveButton, { backgroundColor: savingProfile ? colors.border : colors.primary }]}
            onPress={saveProfile}
            disabled={savingProfile}
          >
            <Text style={s.saveButtonText}>
              {savingProfile ? "Saving..." : "Save changes"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    scroll: {
      paddingVertical: 16,
    },
    contentWrapper: {
      paddingHorizontal: 16,
      alignItems: "center",
      width: "100%",
    },
    retryBtn: {
      marginTop: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: { color: "#fff", fontWeight: "600" },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    modalSheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingTop: 10,
      marginTop: "auto",
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: "center",
      backgroundColor: colors.border,
      marginBottom: 14,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    fieldGroup: {
      marginBottom: 14,
    },
    fieldLabel: {
      fontSize: 13,
      marginBottom: 6,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
    },
    textArea: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      minHeight: 96,
      textAlignVertical: "top",
    },
    saveButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 4,
    },
    saveButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 15,
    },
  });
