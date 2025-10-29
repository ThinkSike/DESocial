import { useThemeColors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth";
import type { UserProfile } from "@/types/profile";
import { getUserProfile } from "@/utils/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserProfileSidebarProps {
  width?: number;
}

export default function UserProfileSidebar({ width = 300 }: UserProfileSidebarProps) {
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await getUserProfile(user.uid);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid]);

  const s = styles(colors);

  if (loading) {
    return (
      <View style={[s.container, { width }]}>
        <View style={s.profileSection}>
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        </View>
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <View style={[s.container, { width }]}>
      {/* Profile card */}
      <View style={s.profileSection}>
        <View style={s.coverPhoto}>
          <Image
            source={{ uri: profile.avatar || "https://i.pravatar.cc/100?img=1" }}
            style={s.avatar}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={s.profileInfo}>
          <Text style={s.name}>{profile.displayName}</Text>
          {profile.bio && <Text style={s.title}>{profile.bio}</Text>}
          {profile.department && (
            <Text style={s.location}>
              {profile.department}
              {profile.prn ? ` • ${profile.prn}` : ""}
            </Text>
          )}
        </View>
      </View>

      {/* Quick Access */}
      <View style={s.quickAccessSection}>
        <TouchableOpacity style={s.quickAccessItem}>
          <Ionicons name="bookmark-outline" size={20} color={colors.text} />
          <Text style={s.quickAccessText}>Saved items</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.quickAccessItem}>
          <Ionicons name="people-outline" size={20} color={colors.text} />
          <Text style={s.quickAccessText}>Communities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.quickAccessItem}>
          <Ionicons name="newspaper-outline" size={20} color={colors.text} />
          <Text style={s.quickAccessText}>Newsletters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.quickAccessItem}>
          <Ionicons name="calendar-outline" size={20} color={colors.text} />
          <Text style={s.quickAccessText}>Events</Text>
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
      shadowOffset: { width: 0, height: 2 },
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

    quickAccessSection: {
      backgroundColor: colors.surface || "#FFFFFF",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
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
    quickAccessText: { fontSize: 14, color: colors.text, marginLeft: 12 },
  });