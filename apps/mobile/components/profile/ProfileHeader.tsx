import { useThemeColors } from "@/constants/Colors";
import type { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onFollowToggle?: () => void;
  onMessagePress?: () => void;
  onSettingsPress?: () => void;
  isFollowing?: boolean;
  isFollowLoading?: boolean;
  onAvatarPress?: () => void;
}

const { width: screenWidth } = Dimensions.get("window");
const CARD_MAX_WIDTH = 700;

export default function ProfileHeader({
  user,
  isOwnProfile = false,
  onEditProfile,
  onFollowToggle,
  onMessagePress,
  onSettingsPress,
  isFollowing = false,
  isFollowLoading = false,
  onAvatarPress,
}: ProfileHeaderProps) {
  const colors = useThemeColors();
  const s = styles(colors);

  const renderActionButtons = () => {
    if (isOwnProfile) {
      return (
        <View style={s.actionButtonsContainer}>
          <TouchableOpacity style={s.addProfileButton} onPress={onEditProfile}>
            <Text style={s.addProfileButtonText}>Add profile section</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.resourcesButton} onPress={onSettingsPress}>
            <Text style={s.resourcesButtonText}>Resources</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={s.actionButtonsContainer}>
        <TouchableOpacity
          style={s.followButton}
          onPress={onFollowToggle}
          disabled={isFollowLoading}
        >
          <Text style={s.followButtonText}>
            {isFollowLoading ? "Saving..." : isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.messageButton} onPress={onMessagePress}>
          <Text style={s.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={s.container}>
      {/* Cover Photo */}
      <View style={s.coverSection}>
        <View style={s.coverPhoto} />

        {/* Profile Picture — centered, overlapping cover */}
        <TouchableOpacity
          style={s.profilePictureContainer}
          onPress={isOwnProfile ? onAvatarPress : undefined}
          activeOpacity={isOwnProfile ? 0.8 : 1}
          accessibilityRole={isOwnProfile ? "button" : undefined}
          accessibilityLabel={isOwnProfile ? "Change profile picture" : undefined}
        >
          <Image
            source={{ uri: user.avatar || "https://i.pravatar.cc/120?img=5" }}
            style={s.profilePicture}
            contentFit="cover"
            transition={200}
          />
          {isOwnProfile && (
            <View style={s.editAvatarOverlay}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        {/* Settings / Edit button top-right */}
        {isOwnProfile && onSettingsPress && (
          <TouchableOpacity style={s.editProfileButton} onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={16} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Info */}
      <View style={s.profileInfoSection}>
        <View style={s.nameSection}>
          <View style={s.nameRow}>
            <Text style={s.displayName}>{user.displayName || user.username}</Text>
            {(user as any).verified && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
                style={s.verifiedIcon}
              />
            )}
          </View>

          <Text style={s.username}>@{user.username}</Text>

          {user.bio ? (
            <Text style={s.title}>{user.bio.replace(/"/g, "")}</Text>
          ) : null}

          {user.department ? (
            <View style={s.academicInfo}>
              <Ionicons name="school" size={14} color={colors.textSecondary} />
              <Text style={s.academicText}>
                {user.department}
                {(user as any).year ? ` • ${(user as any).year}` : ""}
              </Text>
            </View>
          ) : null}

          {user.prn ? (
            <View style={s.prnInfo}>
              <Text style={s.prnLabel}>PRN: </Text>
              <Text style={s.prnValue}>{user.prn}</Text>
            </View>
          ) : null}

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statValue}>{user.stats?.posts ?? 0}</Text>
              <Text style={s.statLabel}>Posts</Text>
            </View>
            <View style={s.statItem}>
              <Text style={s.statValue}>{user.stats?.comments ?? 0}</Text>
              <Text style={s.statLabel}>Comments</Text>
            </View>
            <View style={s.statItem}>
              <Text style={s.statValue}>{user.stats?.followers ?? 0}</Text>
              <Text style={s.statLabel}>Followers</Text>
            </View>
          </View>
        </View>

        {renderActionButtons()}
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: CARD_MAX_WIDTH,
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
    coverSection: {
      position: "relative",
      height: 160,
    },
    coverPhoto: {
      width: "100%",
      height: 160,
      backgroundColor: colors.primary,
    },
    profilePictureContainer: {
      position: "absolute",
      bottom: -50,
      left: "50%",
      transform: [{ translateX: -52 }], // half of 104
      width: 104,
      height: 104,
      borderRadius: 52,
      borderWidth: 4,
      borderColor: colors.surface || colors.background,
      overflow: "hidden",
      backgroundColor: colors.surface,
    },
    profilePicture: {
      width: "100%",
      height: "100%",
    },
    editAvatarOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 32,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "center",
      alignItems: "center",
    },
    editProfileButton: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.9)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    profileInfoSection: {
      paddingTop: 64,
      paddingHorizontal: 16,
      paddingBottom: 20,
      alignItems: "center",
    },
    nameSection: {
      marginBottom: 20,
      alignItems: "center",
      width: "100%",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    displayName: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    verifiedIcon: { marginLeft: 6 },
    username: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 6,
      textAlign: "center",
    },
    title: {
      fontSize: 15,
      color: colors.text,
      marginBottom: 8,
      fontWeight: "500",
      textAlign: "center",
    },
    academicInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    academicText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
      textAlign: "center",
    },
    prnInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    prnLabel: { fontSize: 14, color: colors.textSecondary },
    prnValue: { fontSize: 14, fontWeight: "600", color: colors.primary },
    statsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      marginTop: 8,
    },
    statItem: { alignItems: "center" },
    statValue: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    statLabel: { fontSize: 12, color: colors.textSecondary },
    actionButtonsContainer: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      flexWrap: "wrap",
      width: "100%",
    },
    addProfileButton: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    addProfileButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    enhanceProfileButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    enhanceProfileButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    resourcesButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    resourcesButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    followButton: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    followButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    messageButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    messageButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
  });
