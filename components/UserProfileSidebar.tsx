import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserProfileSidebarProps {
  user?: {
    name: string;
    title: string;
    location: string;
    avatar: string;
  };
  profileViews?: number;
  postImpressions?: number;
}

export default function UserProfileSidebar({
  user = {
    name: "Tiya Bhavsar",
    title: "Studying at DES PU | Game Developer | AI Prompt Engineer | ...",
    location: "Pune, Maharashtra",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  profileViews = 186,
  postImpressions = 163,
}: UserProfileSidebarProps) {
  const colors = useThemeColors();

  return (
    <View style={styles(colors).container}>
      {/* Profile Section */}
      <View style={styles(colors).profileSection}>
        <View style={styles(colors).coverPhoto}>
          <Image source={{ uri: user.avatar }} style={styles(colors).avatar} />
        </View>

        <View style={styles(colors).profileInfo}>
          <Text style={styles(colors).name}>{user.name}</Text>
          <Text style={styles(colors).title}>{user.title}</Text>
          <Text style={styles(colors).location}>{user.location}</Text>
        </View>

        <View style={styles(colors).separator} />

        <View style={styles(colors).statsSection}>
          <View style={styles(colors).statRow}>
            <Text style={styles(colors).statLabel}>Profile viewers</Text>
            <Text style={styles(colors).statValue}>{profileViews}</Text>
          </View>
          <View style={styles(colors).statRow}>
            <Text style={styles(colors).statLabel}>Post impressions</Text>
            <Text style={styles(colors).statValue}>{postImpressions}</Text>
          </View>
        </View>

        <View style={styles(colors).separator} />

        <TouchableOpacity style={styles(colors).premiumSection}>
          <Text style={styles(colors).premiumText}>
            Grow your career and get ahead
          </Text>
          <View style={styles(colors).premiumBadge}>
            <Ionicons name="diamond" size={16} color="#DBA41C" />
            <Text style={styles(colors).premiumBadgeText}>
              Try Premium for ₹0
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Access Section */}
      <View style={styles(colors).quickAccessSection}>
        <TouchableOpacity style={styles(colors).quickAccessItem}>
          <Ionicons name="bookmark" size={20} color={colors.text} />
          <Text style={styles(colors).quickAccessText}>Saved items</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).quickAccessItem}>
          <Ionicons name="people" size={20} color={colors.text} />
          <Text style={styles(colors).quickAccessText}>Groups</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).quickAccessItem}>
          <Ionicons name="newspaper" size={20} color={colors.text} />
          <Text style={styles(colors).quickAccessText}>Newsletters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles(colors).quickAccessItem}>
          <Ionicons name="calendar" size={20} color={colors.text} />
          <Text style={styles(colors).quickAccessText}>Events</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: 280,
      marginRight: 16,
    },
    profileSection: {
      backgroundColor: colors.surface || "#FFFFFF",
      borderRadius: 12,
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
    },
    coverPhoto: {
      height: 60,
      backgroundColor: "#4A90E2",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
      borderColor: colors.cardBackground || "#FFFFFF",
      position: "absolute",
      top: 20,
    },
    profileInfo: {
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
      alignItems: "center",
    },
    name: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 4,
      lineHeight: 18,
    },
    location: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
    separator: {
      height: 1,
      backgroundColor: colors.border || "#E1E8ED",
      marginHorizontal: 16,
    },
    statsSection: {
      padding: 16,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    premiumSection: {
      padding: 16,
    },
    premiumText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      fontWeight: "500",
    },
    premiumBadge: {
      flexDirection: "row",
      alignItems: "center",
    },
    premiumBadgeText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#DBA41C",
      marginLeft: 4,
    },
    quickAccessSection: {
      backgroundColor: colors.surface || "#FFFFFF",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
    },
    quickAccessItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    quickAccessText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
    },
  });
