import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AnalyticsData {
  profileViews: number;
  followers: number;
  following: number;
}

interface ProfileAnalyticsProps {
  analytics?: AnalyticsData;
  onViewAll?: () => void;
}

const PLACEHOLDER_ANALYTICS: AnalyticsData = {
  profileViews: 128,
  followers: 42,
  following: 18,
};

export default function ProfileAnalytics({
  analytics = PLACEHOLDER_ANALYTICS,
  onViewAll,
}: ProfileAnalyticsProps) {
  const colors = useThemeColors();
  const s = styles(colors);

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.titleSection}>
          <Ionicons name="analytics" size={20} color={colors.text} />
          <Text style={s.title}>Analytics</Text>
        </View>
        <Text style={s.subtitle}>Private to you</Text>
      </View>

      <View style={s.metricsContainer}>
        <View style={s.metric}>
          <View style={s.metricHeader}>
            <Ionicons name="eye" size={16} color={colors.textSecondary} />
            <Text style={s.metricValue}>
              {formatNumber(analytics.profileViews)}
            </Text>
          </View>
          <Text style={s.metricLabel}>profile views</Text>
          <Text style={s.metricSubtext}>Discover who viewed your profile</Text>
        </View>

        <View style={s.metric}>
          <View style={s.metricHeader}>
            <Ionicons name="people" size={16} color={colors.textSecondary} />
            <Text style={s.metricValue}>
              {formatNumber(analytics.followers)}
            </Text>
          </View>
          <Text style={s.metricLabel}>followers</Text>
          <Text style={s.metricSubtext}>People following your profile</Text>
        </View>

        <View style={s.metric}>
          <View style={s.metricHeader}>
            <Ionicons name="person-add" size={16} color={colors.textSecondary} />
            <Text style={s.metricValue}>{formatNumber(analytics.following)}</Text>
          </View>
          <Text style={s.metricLabel}>following</Text>
          <Text style={s.metricSubtext}>Profiles you follow</Text>
        </View>
      </View>

      <TouchableOpacity style={s.viewAllButton} onPress={onViewAll}>
        <Text style={s.viewAllText}>Show all analytics</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 700,
      alignSelf: "center",
      backgroundColor: colors.surface || colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
      marginBottom: 16,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginLeft: 8,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    metricsContainer: {
      padding: 16,
    },
    metric: {
      marginBottom: 16,
    },
    metricHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginLeft: 8,
    },
    metricLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    metricSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginRight: 8,
    },
  });
