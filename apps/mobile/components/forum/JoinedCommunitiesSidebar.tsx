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

  const getCategoryColor = (type: Community['type']) => {
    switch (type) {
      case 'academic':
        return '#2196F3';
      case 'technical':
        return '#FF5722';
      case 'sports':
        return '#4CAF50';
      case 'cultural':
        return '#9C27B0';
      case 'social':
        return '#FF9800';
      case 'hobby':
        return '#E91E63';
      default:
        return colors.primary;
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
      <View style={styles(colors).communityHeader}>
        <View
          style={[
            styles(colors).communityIcon,
            { backgroundColor: getCategoryColor(community.type) + '20' },
          ]}
        >
          <Ionicons
            name={community.icon as any}
            size={16}
            color={getCategoryColor(community.type)}
          />
        </View>
        <View style={styles(colors).communityInfo}>
          <Text style={styles(colors).communityName} numberOfLines={1}>
            {community.name}
          </Text>
          <Text style={styles(colors).memberCount}>
            {community.memberCount >= 1000 
              ? `${(community.memberCount / 1000).toFixed(1)}K` 
              : community.memberCount} members
          </Text>
        </View>
      </View>
      {community.isVerified && (
        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles(colors).container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {/* Header */}
      <View style={[styles(colors).header, { borderBottomColor: colors.border }]}>
        <Text style={[styles(colors).headerTitle, { color: colors.text }]}>Communities</Text>
        <Text style={[styles(colors).headerSubtitle, { color: colors.textSecondary }]}>
          Browse and manage your communities
        </Text>
      </View>

      <ScrollView 
        style={styles(colors).scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* All Posts Option */}
        <TouchableOpacity
          style={[
            styles(colors).allPostsItem,
            !selectedCommunity && styles(colors).selectedCommunityItem,
          ]}
          onPress={() => onCommunitySelect(null)}
        >
          <View style={styles(colors).allPostsIcon}>
            <Ionicons name="home" size={20} color={colors.primary} />
          </View>
          <Text style={styles(colors).allPostsText}>All Communities</Text>
        </TouchableOpacity>

        {/* Joined Communities */}
        {joinedCommunities.length > 0 && (
          <View style={styles(colors).section}>
            <Text style={styles(colors).sectionTitle}>My Communities</Text>
            {joinedCommunities.map((community) =>
              renderCommunityItem(
                community,
                selectedCommunity?.id === community.id
              )
            )}
          </View>
        )}

        {/* Browse More */}
        <TouchableOpacity
          style={styles(colors).browseButton}
          onPress={() => router.push("/browse-communities" as any)}
        >
          <Ionicons name="add-circle" size={20} color={colors.primary} />
          <Text style={styles(colors).browseButtonText}>Browse Communities</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// JoinedCommunitiesSidebar.tsx - within the styles function at the bottom

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 280,
      alignSelf: "stretch",
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    allPostsItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    allPostsIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + '20',
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    allPostsText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    communityItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 4,
      borderRadius: 6,
      backgroundColor: "transparent",
    },
    selectedCommunityItem: {
      backgroundColor: colors.primary + '10',
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    communityHeader: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    communityIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    communityInfo: {
      flex: 1,
    },
    communityName: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    memberCount: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    browseButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      marginTop: 16,
      marginBottom: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    browseButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 8,
    },
  });