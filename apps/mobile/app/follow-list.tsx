import Avatar from "@/components/Avatar";
import { useThemeColors } from "@/constants/Colors";
import { api } from "@/lib/api";
import type { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ListType = "followers" | "following";

export default function FollowListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string; type?: string; name?: string }>();

  const userId = params.userId ?? "";
  const type: ListType = (params.type as ListType) === "following" ? "following" : "followers";
  const displayName = params.name ?? "User";

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = type === "following" ? `${displayName} follows` : `${displayName}'s followers`;

  const fetchList = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<UserProfile[]>(`/api/users/${userId}/${type}`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load list");
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const renderUser = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      onPress={() => router.push(`/profile?userId=${item.id}` as any)}
      activeOpacity={0.75}
    >
      <Avatar uri={item.avatar} name={item.displayName} size={48} verified={item.verified} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.displayName, { color: colors.text }]} numberOfLines={1}>
            {item.displayName}
          </Text>
          {item.verified && (
            <Ionicons name="checkmark-circle" size={15} color={colors.primary} style={{ marginLeft: 4 }} />
          )}
        </View>
        <Text style={[styles.username, { color: colors.textSecondary }]} numberOfLines={1}>
          @{item.username}
        </Text>
        {item.bio ? (
          <Text style={[styles.bio, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.bio}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={fetchList}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name={type === "followers" ? "people-outline" : "person-add-outline"}
            size={52}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {type === "followers" ? "No followers yet" : "Not following anyone yet"}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {type === "followers"
              ? "When people follow this account they'll appear here."
              : "When this account follows people they'll appear here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 76 }} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  info: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  displayName: { fontSize: 15, fontWeight: "600" },
  username: { fontSize: 13, marginTop: 1 },
  bio: { fontSize: 13, marginTop: 3 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  loadingText: { fontSize: 14, marginTop: 8 },
  errorText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 4 },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 4 },
  retryText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
