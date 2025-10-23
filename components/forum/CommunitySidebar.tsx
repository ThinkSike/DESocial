import { useThemeColors } from "@/constants/Colors";
import { Community } from "@/types/community";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CommunitySidebarProps {
  joinedCommunities: Community[];
  recentlyVisited: Community[];
  newCommunities: Community[];
  selectedCommunity?: Community | null;
  onCommunitySelect: (community: Community | null) => void;
  onJoinCommunity: (communityId: string) => void;
}

export default function CommunitySidebar({
  joinedCommunities,
  recentlyVisited,
  newCommunities,
  selectedCommunity,
  onCommunitySelect,
  onJoinCommunity,
}: CommunitySidebarProps) {
  const colors = useThemeColors();

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
    <View style={styles(colors).container}>
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

        {/* Recently Visited */}
        {recentlyVisited.length > 0 && (
          <View style={styles(colors).section}>
            <Text style={styles(colors).sectionTitle}>Recently Visited</Text>
            {recentlyVisited.slice(0, 3).map((community) =>
              renderCommunityItem(
                community,
                selectedCommunity?.id === community.id
              )
            )}
          </View>
        )}

        {/* New Communities */}
        {newCommunities.length > 0 && (
          <View style={styles(colors).section}>
            <View style={styles(colors).sectionHeader}>
              <Text style={styles(colors).sectionTitle}>New Communities</Text>
              <View style={styles(colors).newBadge}>
                <Text style={styles(colors).newBadgeText}>NEW</Text>
              </View>
            </View>
            {newCommunities.slice(0, 4).map((community) => (
              <View key={community.id} style={styles(colors).newCommunityItem}>
                <View style={styles(colors).newCommunityRow}>
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
                  {!community.isJoined && (
                    <TouchableOpacity
                      style={styles(colors).joinButton}
                      onPress={() => onJoinCommunity(community.id)}
                    >
                      <Text style={styles(colors).joinButtonText}>Join</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Discover More */}
        <TouchableOpacity style={styles(colors).discoverButton}>
          <Ionicons name="compass" size={20} color={colors.primary} />
          <Text style={styles(colors).discoverButtonText}>Discover Communities</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: 280,
    },
    scrollContainer: {
      flex: 1,
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
    newBadge: {
      backgroundColor: "#4CAF50",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    newBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#FFFFFF",
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
    newCommunityItem: {
      marginBottom: 4,
    },
    newCommunityRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    joinButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.primary,
      borderRadius: 12,
      marginLeft: 8,
    },
    joinButtonText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.background,
    },
    discoverButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      marginTop: 16,
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