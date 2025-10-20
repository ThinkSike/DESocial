import { useThemeColors } from "@/constants/Colors";
import { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
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
  onPostsPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onSettingsPress?: () => void;
  isFollowing?: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

export default function ProfileHeader({
  user,
  isOwnProfile = false,
  onEditProfile,
  onFollowToggle,
  onMessagePress,
  onPostsPress,
  onFollowersPress,
  onFollowingPress,
  onSettingsPress,
  isFollowing = false,
}: ProfileHeaderProps) {
  const colors = useThemeColors();

  const renderActionButtons = () => {
    if (isOwnProfile) {
      return (
        <View style={styles(colors).actionButtonsContainer}>
          <TouchableOpacity
            style={styles(colors).addProfileButton}
            onPress={() => {}}
          >
            <Text style={styles(colors).addProfileButtonText}>
              Add profile section
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles(colors).enhanceProfileButton}
            onPress={() => {}}
          >
            <Text style={styles(colors).enhanceProfileButtonText}>
              Enhance profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles(colors).resourcesButton}
            onPress={() => {}}
          >
            <Text style={styles(colors).resourcesButtonText}>Resources</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles(colors).actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles(colors).followButton,
            isFollowing && styles(colors).followingButton,
          ]}
          onPress={onFollowToggle}
        >
          <Text
            style={[
              styles(colors).followButtonText,
              isFollowing && styles(colors).followingButtonText,
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(colors).messageButton}
          onPress={onMessagePress}
        >
          <Text style={styles(colors).messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles(colors).container}>
      {/* Cover Photo Section */}
      <View style={styles(colors).coverSection}>
        <View style={styles(colors).coverPhoto}>
          {/* You could add a cover image here */}
        </View>

        {/* Profile Picture Overlay */}
        <View style={styles(colors).profilePictureContainer}>
          <Image
            source={{ uri: user.avatar }}
            style={styles(colors).profilePicture}
          />
          {isOwnProfile && (
            <TouchableOpacity style={styles(colors).editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Edit Profile Button */}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles(colors).editProfileButton}
            onPress={onEditProfile}
          >
            <Ionicons name="pencil" size={16} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Info Section */}
      <View style={styles(colors).profileInfoSection}>
        <View style={styles(colors).nameSection}>
          <View style={styles(colors).nameRow}>
            <Text style={styles(colors).displayName}>{user.displayName}</Text>
            {user.verified && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
                style={styles(colors).verifiedIcon}
              />
            )}
          </View>

          <Text style={styles(colors).username}>@{user.username}</Text>

          {/* Professional Title */}
          <Text style={styles(colors).title}>
            {user.bio?.replace(/"/g, "") || "Student"}
          </Text>

          {/* Academic Info */}
          <View style={styles(colors).academicInfo}>
            <Ionicons name="school" size={14} color={colors.textSecondary} />
            <Text style={styles(colors).academicText}>
              {user.department} • {user.year}
            </Text>
          </View>

          {/* Location */}
          <View style={styles(colors).locationInfo}>
            <Ionicons name="location" size={14} color={colors.textSecondary} />
            <Text style={styles(colors).locationText}>{user.location}</Text>
          </View>

          {/* PRN */}
          <View style={styles(colors).prnInfo}>
            <Text style={styles(colors).prnLabel}>PRN: </Text>
            <Text style={styles(colors).prnValue}>{user.prn}</Text>
          </View>

          {/* Website */}
          {user.website && (
            <View style={styles(colors).websiteInfo}>
              <Ionicons name="link" size={14} color={colors.primary} />
              <Text style={styles(colors).websiteText}>
                {user.website.replace(/^https?:\/\//, "")}
              </Text>
            </View>
          )}

          {/* Followers count */}
          <TouchableOpacity
            style={styles(colors).followersInfo}
            onPress={onFollowersPress}
          >
            <Text style={styles(colors).followersText}>
              {user.stats.followersCount.toLocaleString()} followers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        {renderActionButtons()}
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || colors.background,
      marginHorizontal: 16,
      marginBottom: 16,
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
      borderWidth: 1,
      borderColor: colors.border,
    },
    coverSection: {
      position: "relative",
      height: 200,
    },
    coverPhoto: {
      width: "100%",
      height: 200,
      backgroundColor: "#4A90E2",
      position: "relative",
    },
    profilePictureContainer: {
      position: "absolute",
      bottom: -60,
      left: 24,
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: colors.cardBackground || colors.background,
      overflow: "hidden",
    },
    profilePicture: {
      width: 112,
      height: 112,
      borderRadius: 56,
    },
    editAvatarButton: {
      position: "absolute",
      bottom: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    editProfileButton: {
      position: "absolute",
      top: 16,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.9)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileInfoSection: {
      paddingTop: 70,
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    nameSection: {
      marginBottom: 20,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    displayName: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    verifiedIcon: {
      marginLeft: 8,
    },
    username: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      fontWeight: "500",
    },
    academicInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    academicText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    locationInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    locationText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    prnInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    prnLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    prnValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    websiteInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    websiteText: {
      fontSize: 14,
      color: colors.primary,
      marginLeft: 6,
    },
    followersInfo: {
      marginTop: 8,
    },
    followersText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    addProfileButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 24,
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
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
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
      borderRadius: 24,
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
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 24,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
    },
    followingButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    followButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.background,
    },
    followingButtonText: {
      color: colors.text,
    },
    messageButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
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
