import { useThemeColors } from "@/constants/Colors";
import { formatEngagementNumber } from "@/data/mockData";
import { ProfileStats as ProfileStatsType } from "@/types/profile";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileStatsProps {
  stats: ProfileStatsType;
  onPostsPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export default function ProfileStats({
  stats,
  onPostsPress,
  onFollowersPress,
  onFollowingPress,
}: ProfileStatsProps) {
  const colors = useThemeColors();

  const StatItem = ({
    count,
    label,
    onPress,
  }: {
    count: number;
    label: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles(colors).statItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles(colors).statNumber}>
        {formatEngagementNumber(count)}
      </Text>
      <Text style={styles(colors).statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles(colors).container}>
      <StatItem count={stats.postsCount} label="Posts" onPress={onPostsPress} />
      <StatItem
        count={stats.followersCount}
        label="Followers"
        onPress={onFollowersPress}
      />
      <StatItem
        count={stats.followingCount}
        label="Following"
        onPress={onFollowingPress}
      />
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      textTransform: "capitalize",
    },
  });
