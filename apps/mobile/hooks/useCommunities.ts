import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Community } from "@desocial/shared";
import { useAuthStore } from "@/store/auth";

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchCommunities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Community[]>("/api/communities?limit=50");
      setCommunities(data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleJoinCommunity = useCallback(
    async (communityId: string) => {
      if (!user) return;

      try {
        await api.post(`/api/communities/${communityId}/join`);
        setCommunities((prev) =>
          prev.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  isJoined: true,
                  memberCount: community.memberCount + 1,
                }
              : community,
          ),
        );
      } catch (error) {
        console.error("Error joining community:", error);
        throw error;
      }
    },
    [user],
  );

  const handleLeaveCommunity = useCallback(
    async (communityId: string) => {
      if (!user) return;

      try {
        await api.delete(`/api/communities/${communityId}/leave`);
        setCommunities((prev) =>
          prev.map((community) =>
            community.id === communityId
              ? {
                  ...community,
                  isJoined: false,
                  memberCount: Math.max(0, community.memberCount - 1),
                }
              : community,
          ),
        );
      } catch (error) {
        console.error("Error leaving community:", error);
        throw error;
      }
    },
    [user],
  );

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return {
    communities,
    loading,
    fetchCommunities,
    handleJoinCommunity,
    handleLeaveCommunity,
  };
};
