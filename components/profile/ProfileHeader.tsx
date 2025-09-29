import { useThemeColors } from "@/constants/Colors";
import { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileStats from "./ProfileStats";

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
        <TouchableOpacity
          style={styles(colors).editButton}
          onPress={onEditProfile}
        >
          <Text style={styles(colors).editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles(colors).actionButtons}>
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
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBio = () => {
    if (!user.bio) return null;

    return <Text style={styles(colors).bio}>{user.bio}</Text>;
  };

  const renderLocation = () => {
    if (!user.location) return null;

    return (
      <View style={styles(colors).infoRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles(colors).infoText}>{user.location}</Text>
      </View>
    );
  };

  const renderWebsite = () => {
    if (!user.website) return null;

    return (
      <View style={styles(colors).infoRow}>
        <Ionicons name="link-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles(colors).infoText, styles(colors).link]}>
          {user.website.replace(/^https?:\/\//, "")}
        </Text>
      </View>
    );
  };

  const renderAcademicInfo = () => {
    if (!user.department && !user.year) return null;

    return (
      <View style={styles(colors).infoRow}>
        <Ionicons
          name="school-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles(colors).infoText}>
          {user.department} {user.year ? `• ${user.year}` : ""}
        </Text>
      </View>
    );
  };

  const renderJoinedDate = () => {
    const joinedMonth = user.joinedDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <View style={styles(colors).infoRow}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles(colors).infoText}>Joined {joinedMonth}</Text>
      </View>
    );
  };

  return (
    <View style={styles(colors).container}>
      {/* Top section with avatar, name, and settings */}
      <View style={styles(colors).topSection}>
        <View style={styles(colors).leftSection}>
          <Image source={{ uri: user.avatar }} style={styles(colors).avatar} />

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

            {/* PRN Display */}
            <View style={styles(colors).prnContainer}>
              <Text style={styles(colors).prnLabel}>PRN: </Text>
              <Text style={styles(colors).prnValue}>{user.prn}</Text>
            </View>
          </View>
        </View>

        {/* Settings button (only for own profile) */}
        {isOwnProfile && onSettingsPress && (
          <TouchableOpacity
            style={styles(colors).settingsButton}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Bio and additional info */}
      <View style={styles(colors).infoSection}>
        {renderBio()}
        {renderAcademicInfo()}
        {renderLocation()}
        {renderWebsite()}
        {renderJoinedDate()}
      </View>

      {/* Action buttons */}
      <View style={styles(colors).buttonSection}>{renderActionButtons()}</View>

      {/* Stats */}
      <ProfileStats
        stats={user.stats}
        onPostsPress={onPostsPress}
        onFollowersPress={onFollowersPress}
        onFollowingPress={onFollowingPress}
      />
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    topSection: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingTop: 16,
      marginBottom: 12,
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    leftSection: {
      flexDirection: "row",
      flex: 1,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    nameSection: {
      flex: 1,
      justifyContent: "center",
    },
    settingsButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      shadowColor: colors.textPrimary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    displayName: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    verifiedIcon: {
      marginLeft: 6,
    },
    username: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
    },
    prnContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
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
    infoSection: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    bio: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    link: {
      color: colors.primary,
    },
    buttonSection: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    editButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    editButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
    },
    followButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    followingButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    followButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.background,
    },
    followingButtonText: {
      color: colors.textPrimary,
    },
    messageButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
    },
  });
