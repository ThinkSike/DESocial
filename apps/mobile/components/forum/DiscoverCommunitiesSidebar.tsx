import { useThemeColors } from "@/constants/Colors";
import { Community } from "@/types/community";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DiscoverCommunitiesSidebarProps {
  suggestedCommunities: Community[];
  trendingCommunities: Community[];
  selectedCommunity?: Community | null;
  onCommunitySelect: (community: Community | null) => void;
  onJoinCommunity: (communityId: string) => void;
}

export default function DiscoverCommunitiesSidebar({
  suggestedCommunities,
  trendingCommunities,
  selectedCommunity,
  onCommunitySelect,
  onJoinCommunity,
}: DiscoverCommunitiesSidebarProps) {
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

  const renderCommunityItem = (community: Community, showJoinButton: boolean = true) => (
    <View key={community.id} style={styles(colors).communityItemContainer}>
      <TouchableOpacity
        style={[
          styles(colors).communityItem,
          selectedCommunity?.id === community.id && styles(colors).selectedCommunityItem,
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
            <View style={styles(colors).nameRow}>
              <Text style={styles(colors).communityName} numberOfLines={1}>
                {community.name}
              </Text>
              {community.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" style={styles(colors).verifiedIcon} />
              )}
            </View>
            <Text style={styles(colors).memberCount}>
              {community.memberCount >= 1000 
                ? `${(community.memberCount / 1000).toFixed(1)}K` 
                : community.memberCount} members
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {showJoinButton && !community.isJoined && (
        <TouchableOpacity
          style={styles(colors).joinButton}
          onPress={() => onJoinCommunity(community.id)}
        >
          <Text style={styles(colors).joinButtonText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles(colors).container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {/* Header */}
      <View style={[styles(colors).header, { borderBottomColor: colors.border }]}>
        <Text style={[styles(colors).headerTitle, { color: colors.text }]}>Trending Communities</Text>
        <Text style={[styles(colors).headerSubtitle, { color: colors.textSecondary }]}>
          Discover popular communities in your college
        </Text>
      </View>

      <ScrollView 
        style={styles(colors).scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Communities */}
        {trendingCommunities.length > 0 && (
          <View style={styles(colors).section}>
            <View style={styles(colors).sectionHeader}>
              <Text style={styles(colors).sectionTitle}>🔥 Trending</Text>
              <View style={styles(colors).trendingBadge}>
                <Text style={styles(colors).trendingBadgeText}>HOT</Text>
              </View>
            </View>
            {trendingCommunities.slice(0, 3).map((community) =>
              renderCommunityItem(community, true)
            )}
          </View>
        )}

        {/* Suggested Communities */}
        {suggestedCommunities.length > 0 && (
          <View style={styles(colors).section}>
            <Text style={styles(colors).sectionTitle}>Suggested for You</Text>
            {suggestedCommunities.slice(0, 5).map((community) =>
              renderCommunityItem(community, true)
            )}
          </View>
        )}

        {/* Discover More */}
        <TouchableOpacity
          style={styles(colors).discoverButton}
          onPress={() => router.push("/browse-communities" as any)}
        >
          <Ionicons name="compass" size={20} color={colors.primary} />
          <Text style={styles(colors).discoverButtonText}>Explore All Communities</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 300,
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
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    trendingBadge: {
      backgroundColor: "#FF5722",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    trendingBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    communityItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    communityItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
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
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    communityName: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    verifiedIcon: {
      marginLeft: 4,
    },
    memberCount: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    joinButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 16,
      marginLeft: 8,
    },
    joinButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.background,
    },
    discoverButton: {
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
    discoverButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 8,
    },
  });