import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { UserProfile } from "@desocial/shared";
import { useCallback, useEffect, useState } from "react";

export const useUserProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const targetUserId = userId || user?.id;

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.get<UserProfile>(`/api/users/${targetUserId}`);
      setProfile(data);
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
        const updated = await api.patch<UserProfile>(
          `/api/users/${targetUserId}`,
          updates,
        );
        setProfile(updated);
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
        const ext = imageUri.split(".").pop() || "jpg";
        const result = await api.upload(
          `/uploads?type=avatars`,
          {
            uri: imageUri,
            name: `avatar_${targetUserId}.${ext}`,
            type: `image/${ext}`,
          },
          "avatars",
        );
        await updateProfile({ avatar: result.url });
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
