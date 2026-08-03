import { useThemeColors } from "@/constants/Colors";
import { Community } from "@/types/community";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface JoinedCommunitiesSidebarProps {
  joinedCommunities: Community[];
  selectedCommunity?: Community | null;
  onCommunitySelect: (community: Community | null) => void;
}

export default function JoinedCommunitiesSidebar({
  joinedCommunities,
  selectedCommunity,
  onCommunitySelect,
}: JoinedCommunitiesSidebarProps) {
  const colors = useThemeColors();
  const router = useRouter();

  const getCategoryColor = (type: Community["type"]) => {
    switch (type) {
      case "academic": return "#2196F3";
      case "technical": return "#FF5722";
      case "sports":   return "#4CAF50";
      case "cultural": return "#9C27B0";
      case "social":   return "#FF9800";
      case "hobby":    return "#E91E63";
      default:         return colors.primary;
    }
  };

  const renderCommunityItem = (community: Community, isSelected: boolean = false) => (
    <TouchableOpacity
      key={community.id}
      style={[
        styles(colors).communityItem,
        isSelected && styles(colors).selectedCommunityItem,
      ]}
      onPress={() => onCommunitySelect(community)}
    >
      <View
        style={[
          styles(colors).communityIcon,
          { backgroundColor: getCategoryColor(community.type) + "20" },
        ]}
      >
        <Ionicons
          name={community.icon as any}
          size={16}
          color={getCategoryColor(community.type)}
        />
      </View>

      <View style={styles(colors).communityInfo}>
        <View style={styles(colors).communityNameRow}>
          <Text style={[styles(colors).communityName, isSelected && { color: colors.primary }]} numberOfLines={1}>
            {community.name}
          </Text>
          {community.isVerified && (
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
          )}
        </View>
        <Text style={styles(colors).memberCount}>
          {community.memberCount >= 1000
            ? `${(community.memberCount / 1000).toFixed(1)}K`
            : community.memberCount}{" "}
          members
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles(colors).container,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
    >
      {/* Header */}
      <View style={[styles(colors).header, { borderBottomColor: colors.border }]}>
        <Text style={[styles(colors).headerTitle, { color: colors.text }]}>My Communities</Text>
        <Text style={[styles(colors).headerSubtitle, { color: colors.textSecondary }]}>
          {joinedCommunities.length > 0
            ? `${joinedCommunities.length} joined`
            : "Browse and join communities"}
        </Text>
      </View>

      <ScrollView style={styles(colors).scrollContainer} showsVerticalScrollIndicator={false}>
        {/* All Posts option */}
        <TouchableOpacity
          style={[
            styles(colors).allPostsItem,
            !selectedCommunity && styles(colors).selectedCommunityItem,
          ]}
          onPress={() => onCommunitySelect(null)}
        >
          <View style={styles(colors).allPostsIcon}>
            <Ionicons name="home" size={18} color={colors.primary} />
          </View>
          <Text style={[styles(colors).allPostsText, { color: !selectedCommunity ? colors.primary : colors.text }]}>
            All Communities
          </Text>
        </TouchableOpacity>

        {/* Joined communities */}
        {joinedCommunities.length > 0 ? (
          <View style={styles(colors).section}>
            <Text style={styles(colors).sectionTitle}>Joined</Text>
            {joinedCommunities.map((community) =>
              renderCommunityItem(community, selectedCommunity?.id === community.id)
            )}
          </View>
        ) : (
          <View style={styles(colors).emptyHint}>
            <Ionicons name="people-outline" size={28} color={colors.textSecondary} />
            <Text style={[styles(colors).emptyHintText, { color: colors.textSecondary }]}>
              You haven't joined any communities yet.
            </Text>
          </View>
        )}

        {/* Browse more */}
        <TouchableOpacity
          style={styles(colors).browseButton}
          onPress={() => router.push("/browse-communities" as any)}
        >
          <Ionicons name="add-circle" size={18} color={colors.primary} />
          <Text style={styles(colors).browseButtonText}>Browse Communities</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 280,
      alignSelf: "stretch",
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 12,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 12,
    },
    allPostsItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 11,
      marginBottom: 8,
      backgroundColor: colors.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    allPostsIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    allPostsText: {
      fontSize: 14,
      fontWeight: "600",
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.textSecondary,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 6,
      paddingHorizontal: 4,
    },
    communityItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 9,
      marginBottom: 2,
      borderRadius: 8,
      backgroundColor: "transparent",
      gap: 10,
    },
    selectedCommunityItem: {
      backgroundColor: colors.primary + "10",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    communityIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      justifyContent: "center",
      alignItems: "center",
    },
    communityInfo: { flex: 1 },
    communityNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    communityName: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      flex: 1,
    },
    memberCount: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
    },
    emptyHint: {
      alignItems: "center",
      paddingVertical: 20,
      gap: 8,
    },
    emptyHintText: {
      fontSize: 12,
      textAlign: "center",
      lineHeight: 18,
    },
    browseButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 11,
      marginTop: 4,
      marginBottom: 16,
      backgroundColor: colors.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    browseButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
    },
  });