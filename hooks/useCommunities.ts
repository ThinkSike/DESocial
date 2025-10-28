import { useState, useEffect, useCallback } from "react";
import {
  getCommunities,
  joinCommunity,
  leaveCommunity,
  createCommunity,
} from "@/utils/firestore";
import { uploadCommunityCover, uploadCommunityIcon } from "@/utils/storage";
import type { Community } from "@/types/community";
import { useAuthStore } from "@/store/auth";

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchCommunities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCommunities(50);
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
        await joinCommunity(communityId, user.uid);
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
        await leaveCommunity(communityId, user.uid);
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
