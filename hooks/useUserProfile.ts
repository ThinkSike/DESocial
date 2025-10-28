import { useState, useEffect, useCallback } from "react";
import { getUserProfile, updateUserProfile } from "@/utils/firestore";
import { uploadAvatar } from "@/utils/storage";
import type { UserProfile } from "@/types/profile";
import { useAuthStore } from "@/store/auth";

export const useUserProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const targetUserId = userId || user?.uid;

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      const profileData = await getUserProfile(targetUserId);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!targetUserId) return;

      try {
        await updateUserProfile(targetUserId, updates);
        setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
    [targetUserId],
  );

  const updateAvatar = useCallback(
    async (imageUri: string) => {
      if (!targetUserId) return;

      try {
        // Convert image URI to Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Upload to Firebase Storage
        const avatarUrl = await uploadAvatar(blob, targetUserId);

        // Update profile with new avatar URL
        await updateProfile({ avatar: avatarUrl });
      } catch (error) {
        console.error("Error updating avatar:", error);
        throw error;
      }
    },
    [targetUserId, updateProfile],
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updateProfile,
    updateAvatar,
    refetch: fetchProfile,
  };
};
