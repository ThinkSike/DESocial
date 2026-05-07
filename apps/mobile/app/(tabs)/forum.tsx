import { CommunityFeed } from "@/components/forum/CommunityFeed";
import DiscoverCommunitiesSidebar from "@/components/forum/DiscoverCommunitiesSidebar";
import JoinedCommunitiesSidebar from "@/components/forum/JoinedCommunitiesSidebar";
import { useThemeColors } from "@/constants/Colors";
import { useCommunities } from "@/hooks/useCommunities";
import { api } from "@/lib/api";
import type { Community, Post } from "@/types/community";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForumScreen() {
  const colors = useThemeColors();
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;
  const { communities, loading } = useCommunities();

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const joinedCommunities = communities.filter((c) => c.isJoined);
  const suggestedCommunities = communities.filter((c) => !c.isJoined);
  const trendingCommunities = communities.filter((c) => c.trending);

  const fetchPosts = useCallback(async () => {
    try {
      const result = await api.get<{ posts: Post[] }>("/api/posts?limit=50");
      const allPosts = result.posts;
      if (selectedCommunity) {
        setPosts(allPosts.filter((p) => p.community?.id === selectedCommunity.id));
      } else {
        setPosts(allPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [selectedCommunity]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCommunitySelect = (community: Community | null) => {
    setSelectedCommunity(community);
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await api.post(`/api/communities/${communityId}/join`);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  if (isTablet) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.tabletLayout}>
          <JoinedCommunitiesSidebar
            joinedCommunities={joinedCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
          />

          <View style={styles.mainContent}>
            <CommunityFeed
              posts={posts}
              selectedCommunity={selectedCommunity?.id}
            />
          </View>

          <DiscoverCommunitiesSidebar
            suggestedCommunities={suggestedCommunities}
            trendingCommunities={trendingCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
            onJoinCommunity={handleJoinCommunity}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.mobileLayout}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.mobileHeader,
            {
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.mobileHeaderTitle, { color: colors.text }]}>
            Communities
          </Text>
        </View>

        <CommunityFeed
          posts={posts}
          selectedCommunity={selectedCommunity?.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabletLayout: {
    flexDirection: "row",
    flex: 1,
    padding: 16,
    gap: 16,
  },
  mainContent: {
    flex: 1,
    maxWidth: 500,
  },
  mobileLayout: {
    flex: 1,
  },
  mobileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    margin: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mobileHeaderTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
});
