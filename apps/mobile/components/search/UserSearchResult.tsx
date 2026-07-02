import { useThemeColors } from "@/constants/Colors";
import { UserProfile } from "@/types/profile";
import { formatEngagementNumber } from "@/utils/format";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserSearchResultProps {
  user: UserProfile;
  onPress: (userId: string) => void;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({
  user,
  onPress,
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => onPress(user.id)}
    >
      <View style={styles.leftSection}>
        <Image
          source={{ uri: user.avatar || "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.displayName, { color: colors.textPrimary }]}>
              {user.displayName}
            </Text>
            {user.verified && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{user.username}
          </Text>
          {user.bio && (
            <Text
              style={[styles.bio, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {user.bio}
            </Text>
          )}
          <View style={styles.statsRow}>
            <Text style={[styles.stat, { color: colors.textSecondary }]}>
              {formatEngagementNumber(user.stats.followers)} followers
            </Text>
            <Text style={[styles.stat, { color: colors.textSecondary }]}>
              {formatEngagementNumber(user.stats.following)} following
            </Text>
          </View>
          <Text style={[styles.stat, { color: colors.textSecondary }]}>
            {formatEngagementNumber(user.stats.posts)} posts
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "flex-start",
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    fontSize: 12,
  },
});
