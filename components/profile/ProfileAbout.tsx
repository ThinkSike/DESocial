import { useThemeColors } from "@/constants/Colors";
import { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileAboutProps {
  user: UserProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export default function ProfileAbout({
  user,
  isOwnProfile = false,
  onEdit,
}: ProfileAboutProps) {
  const colors = useThemeColors();
  const [isExpanded, setIsExpanded] = useState(false);

  const aboutText = user.bio
    ? user.bio.replace(/"/g, "")
    : "Technology has always been more than just a field of study for me - it's a space where creativity meets problem solving, and I thrive on pushing those boundaries. With a diploma in computer engineering, I started my journey in game development, crafting interactive experiences that engage.";

  const shouldShowReadMore = aboutText.length > 150;
  const displayText =
    shouldShowReadMore && !isExpanded
      ? aboutText.substring(0, 150) + "..."
      : aboutText;

  const topSkills = [
    "Game Development",
    "Machine Learning",
    "Android Development",
    "Full Stack Development",
  ];

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Text style={styles(colors).title}>About</Text>
        {isOwnProfile && (
          <TouchableOpacity style={styles(colors).editButton} onPress={onEdit}>
            <Ionicons name="pencil" size={16} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles(colors).content}>
        <Text style={styles(colors).aboutText}>{displayText}</Text>

        {shouldShowReadMore && (
          <TouchableOpacity
            style={styles(colors).readMoreButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles(colors).readMoreText}>
              {isExpanded ? "...see less" : "...see more"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Top Skills Section */}
        <View style={styles(colors).skillsSection}>
          <Text style={styles(colors).skillsTitle}>Top skills</Text>
          <View style={styles(colors).skillsList}>
            {topSkills.map((skill, index) => (
              <View key={index} style={styles(colors).skillItem}>
                <View style={styles(colors).skillIcon}>
                  <Ionicons name="star" size={16} color={colors.primary} />
                </View>
                <Text style={styles(colors).skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    editButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    content: {
      padding: 16,
    },
    aboutText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      marginBottom: 8,
    },
    readMoreButton: {
      alignSelf: "flex-start",
    },
    readMoreText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
    skillsSection: {
      marginTop: 20,
    },
    skillsTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    skillsList: {
      gap: 12,
    },
    skillItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    skillIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    skillText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
  });
