import ProfileActivity from "@/components/profile/ProfileActivity";
import { useThemeColors } from "@/constants/Colors";
import { getCurrentUserPosts, mockCurrentUser } from "@/data/profileData";
import type { Post } from "@/types/post";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const [user, setUser] = useState(mockCurrentUser);
  const [posts, setPosts] = useState<Post[]>(getCurrentUserPosts());
  const [refreshing, setRefreshing] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      const ImagePicker = await import("expo-image-picker");
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission needed", "Allow photo library access to change profile picture.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        setUser((u) => ({ ...u, avatar: res.assets[0].uri }));
        // TODO: upload to storage and save URL to Firestore
      }
    } catch (e) {
      Alert.alert("Error", "Unable to open image picker.");
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: refetch user's posts from Firestore
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleCreatePost = useCallback(() => {
    Alert.alert("Create Post", "Open create post composer");
  }, []);

  const s = styles(colors);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      {/* spacer so content sits below the top pill bar */}
      <View style={s.headerSpacer} />

      {/* Header card with avatar + settings */}
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={s.headerRow}>
          <Text style={[s.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity
            onPress={() => router.push("/settings" as any)}
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            style={s.iconBtn}
          >
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={s.profileRow}>
          <View>
            <Image
              source={{ uri: user.avatar || "https://i.pravatar.cc/120?img=5" }}
              style={s.avatar}
            />
            <TouchableOpacity style={[s.editBadge, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickImage}>
              <Ionicons name="camera" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={s.infoCol}>
            <Text style={[s.name, { color: colors.text }]} numberOfLines={1}>
              {user.displayName || user.username}
            </Text>
            <Text style={[s.meta, { color: colors.textSecondary }]} numberOfLines={1}>
              PRN: {user.prn ?? "-"}
            </Text>
            <Text style={[s.meta, { color: colors.textSecondary }]} numberOfLines={1}>
              Department: {user.department ?? "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* Activity (posts/comments/images/documents) + create post */}
      <ProfileActivity
        posts={posts}
        isOwnProfile
        onCreatePost={handleCreatePost}
        onUserPress={() => {}}
        onLike={() => {}}
        onRepost={() => {}}
        onComment={() => {}}
        onShare={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    headerSpacer: { height: 56 },
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
    meta: { fontSize: 12 },
  });