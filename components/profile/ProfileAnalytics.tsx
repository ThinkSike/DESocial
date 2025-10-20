import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AnalyticsData {
  profileViews: number;
  postImpressions: number;
  searchAppearances: number;
}

interface ProfileAnalyticsProps {
  analytics: AnalyticsData;
  onViewAll?: () => void;
}

export default function ProfileAnalytics({
  analytics,
  onViewAll,
}: ProfileAnalyticsProps) {
  const colors = useThemeColors();

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <View style={styles(colors).titleSection}>
          <Ionicons name="analytics" size={20} color={colors.text} />
          <Text style={styles(colors).title}>Analytics</Text>
        </View>
        <Text style={styles(colors).subtitle}>
          Private to you
        </Text>
      </View>

      <View style={styles(colors).metricsContainer}>
        <View style={styles(colors).metric}>
          <View style={styles(colors).metricHeader}>
            <Ionicons name="eye" size={16} color={colors.textSecondary} />
            <Text style={styles(colors).metricValue}>
              {formatNumber(analytics.profileViews)}
            </Text>
          </View>
          <Text style={styles(colors).metricLabel}>profile views</Text>
          <Text style={styles(colors).metricSubtext}>
            Discover who viewed your profile
          </Text>
        </View>

        <View style={styles(colors).metric}>
          <View style={styles(colors).metricHeader}>
            <Ionicons name="trending-up" size={16} color={colors.textSecondary} />
            <Text style={styles(colors).metricValue}>
              {formatNumber(analytics.postImpressions)}
            </Text>
          </View>
          <Text style={styles(colors).metricLabel}>post impressions</Text>
          <Text style={styles(colors).metricSubtext}>
            Check out who's engaging with your posts
          </Text>
        </View>

        <View style={styles(colors).metric}>
          <View style={styles(colors).metricHeader}>
            <Ionicons name="search" size={16} color={colors.textSecondary} />
            <Text style={styles(colors).metricValue}>
              {formatNumber(analytics.searchAppearances)}
            </Text>
          </View>
          <Text style={styles(colors).metricLabel}>search appearances</Text>
          <Text style={styles(colors).metricSubtext}>
            See how often you appear in searches
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles(colors).viewAllButton} onPress={onViewAll}>
        <Text style={styles(colors).viewAllText}>Show all analytics</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || colors.background,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
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
      borderTopColor: colors.border || "#E1E8ED",
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginRight: 8,
    },
  });