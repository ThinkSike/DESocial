import { useThemeColors } from "@/constants/Colors";
import { Community } from "@/types/community";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CommunityCardProps {
  community: Community;
  onJoin?: (communityId: string) => void;
  onLeave?: (communityId: string) => void;
  onPress?: (community: Community) => void;
}

export default function CommunityCard({
  community,
  onJoin,
  onLeave,
  onPress,
}: CommunityCardProps) {
  const colors = useThemeColors();

  const handleJoinPress = () => {
    if (community.isJoined) {
      onLeave?.(community.id);
    } else {
      onJoin?.(community.id);
    }
  };

  const formatMemberCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

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

  return (
    <TouchableOpacity
      style={styles(colors).container}
      onPress={() => onPress?.(community)}
      activeOpacity={0.7}
    >
      <View style={styles(colors).header}>
        <View style={styles(colors).iconContainer}>
          <View
            style={[
              styles(colors).iconBackground,
              { backgroundColor: getCategoryColor(community.type) + '20' },
            ]}
          >
            <Ionicons
              name={community.icon as any}
              size={24}
              color={getCategoryColor(community.type)}
            />
          </View>
          {community.isVerified && (
            <View style={styles(colors).verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles(colors).closeButton}>
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles(colors).content}>
        <Text style={styles(colors).name} numberOfLines={2}>
          {community.name}
        </Text>
        
        <Text style={styles(colors).category}>{community.category}</Text>
        
        <Text style={styles(colors).description} numberOfLines={2}>
          {community.description}
        </Text>

        <View style={styles(colors).metadata}>
          <View style={styles(colors).memberInfo}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={styles(colors).memberCount}>
              {formatMemberCount(community.memberCount)} members
            </Text>
          </View>
          
          {community.location && (
            <View style={styles(colors).locationInfo}>
              <Ionicons name="location" size={14} color={colors.textSecondary} />
              <Text style={styles(colors).locationText}>{community.location}</Text>
            </View>
          )}
        </View>

        {community.recentActivity && (
          <View style={styles(colors).activityInfo}>
            <Ionicons name="flash" size={12} color={colors.primary} />
            <Text style={styles(colors).activityText}>{community.recentActivity}</Text>
          </View>
        )}

        {community.tags && (
          <View style={styles(colors).tagsContainer}>
            {community.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles(colors).tag}>
                <Text style={styles(colors).tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles(colors).footer}>
        <TouchableOpacity
          style={[
            styles(colors).actionButton,
            community.isJoined
              ? styles(colors).leaveButton
              : styles(colors).joinButton,
          ]}
          onPress={handleJoinPress}
        >
          <Text
            style={[
              styles(colors).actionButtonText,
              community.isJoined
                ? styles(colors).leaveButtonText
                : styles(colors).joinButtonText,
            ]}
          >
            {community.isJoined ? 'Leave' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: 16,
      paddingBottom: 12,
    },
    iconContainer: {
      position: "relative",
    },
    iconBackground: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    verifiedBadge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#4CAF50",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.cardBackground || colors.background,
    },
    closeButton: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    category: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: "uppercase",
      fontWeight: "500",
    },
    description: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 18,
      marginBottom: 12,
    },
    metadata: {
      marginBottom: 8,
    },
    memberInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    memberCount: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    locationInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    locationText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    activityInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.primary + "10",
      borderRadius: 6,
      alignSelf: "flex-start",
    },
    activityText: {
      fontSize: 11,
      color: colors.primary,
      marginLeft: 4,
      fontWeight: "500",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 8,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    footer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    actionButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: "center",
    },
    joinButton: {
      backgroundColor: colors.primary,
    },
    leaveButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    joinButtonText: {
      color: colors.background,
    },
    leaveButtonText: {
      color: colors.text,
    },
  });