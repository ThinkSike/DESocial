import { useThemeColors } from "@/constants/Colors";
import { formatMemberCount, getCategoryColor } from "@/utils/format";
import { Community } from "@/types/search";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CommunitySearchResultProps {
  community: Community;
  onPress: (communityId: string) => void;
}

export const CommunitySearchResult: React.FC<CommunitySearchResultProps> = ({
  community,
  onPress,
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => onPress(community.id)}
    >
      <View style={styles.leftSection}>
        <Image
          source={{
            uri:
              community.icon ||
              community.coverImage ||
              "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=150&fit=crop",
          }}
          style={styles.avatar}
        />
        <View style={styles.communityInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {community.name}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(community.type) },
              ]}
            >
              <Text style={styles.categoryText}>{community.type}</Text>
            </View>
          </View>
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {community.description}
          </Text>
          <View style={styles.statsRow}>
            <Text style={[styles.stat, { color: colors.textSecondary }]}>
              {formatMemberCount(community.memberCount)} members
            </Text>
          </View>
          {community.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {community.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.border }]}
                >
                  <Text
                    style={[styles.tagText, { color: colors.textSecondary }]}
                  >
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
    borderRadius: 8,
    marginRight: 12,
  },
  communityInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  stat: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
  },
});
