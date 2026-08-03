import { CommunityFeed } from "@/components/forum/CommunityFeed";
import DiscoverCommunitiesSidebar from "@/components/forum/DiscoverCommunitiesSidebar";
import JoinedCommunitiesSidebar from "@/components/forum/JoinedCommunitiesSidebar";
import { useThemeColors } from "@/constants/Colors";
import { browseCommunities, browseCommunityPosts } from "@/data/browseCommunities";
import { useCommunities } from "@/hooks/useCommunities";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Community, Post } from "@/types/community";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MobileTab = "feed" | "communities";

export default function ForumScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ community?: string | string[] }>();
  const { width } = Dimensions.get("window");
  const isDesktop = width >= 1200;
  const { communities, loading, handleJoinCommunity } = useCommunities();
  const { user } = useAuthStore();

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [mobileTab, setMobileTab] = useState<MobileTab>("feed");

  const selectedBrowseCommunityId = Array.isArray(params.community)
    ? params.community[0]
    : params.community;
  const selectedBrowseCommunity = selectedBrowseCommunityId
    ? browseCommunities.find((c) => c.id === selectedBrowseCommunityId)
    : null;

  const joinedCommunities = communities.filter((c) => c.isJoined);
  const suggestedCommunities = communities.filter((c) => !c.isJoined);
  const trendingCommunities = communities.filter((c) => c.trending);

  const isInJoinedCommunity =
    selectedCommunity !== null &&
    joinedCommunities.some((c) => c.id === selectedCommunity.id);

  const fetchPosts = useCallback(async () => {
    try {
      if (selectedBrowseCommunity) {
        setPosts(browseCommunityPosts[selectedBrowseCommunity.id] ?? []);
        return;
      }

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
  }, [selectedBrowseCommunity, selectedCommunity]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (selectedBrowseCommunity) {
      setSelectedCommunity(null);
    }
  }, [selectedBrowseCommunity]);

  const handleCommunitySelect = (community: Community | null) => {
    if (selectedBrowseCommunityId) {
      router.replace("/forum");
    }
    setSelectedCommunity(community);
    // Switch to feed tab when a community is selected on mobile
    if (community !== null) {
      setMobileTab("feed");
    }
  };

  const handleJoinPress = async (communityId: string) => {
    try {
      await handleJoinCommunity(communityId);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const handleLocalPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // ── Desktop 3-column layout ──────────────────────────────────────────────
  if (isDesktop) {
    return (
      <SafeAreaView style={[styles(colors).container, { backgroundColor: colors.background }]}>
        <View style={styles(colors).desktopLayout}>
          <JoinedCommunitiesSidebar
            joinedCommunities={joinedCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
          />

          <View style={styles(colors).mainContent}>
            <CommunityFeed
              posts={posts}
              selectedCommunity={selectedBrowseCommunity?.id ?? selectedCommunity?.id}
              isJoinedCommunity={isInJoinedCommunity}
              currentUser={user}
              onLocalPost={handleLocalPost}
            />
          </View>

          <DiscoverCommunitiesSidebar
            suggestedCommunities={suggestedCommunities}
            trendingCommunities={trendingCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
            onJoinCommunity={handleJoinPress}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Mobile layout with tab switcher ─────────────────────────────────────
  return (
    <SafeAreaView style={[styles(colors).container, { backgroundColor: colors.background }]}>
      {/* Tab switcher */}
      <View style={[styles(colors).tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles(colors).tabItem,
            mobileTab === "feed" && styles(colors).tabItemActive,
            mobileTab === "feed" && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setMobileTab("feed")}
        >
          <Text
            style={[
              styles(colors).tabLabel,
              { color: mobileTab === "feed" ? colors.primary : colors.textSecondary },
            ]}
          >
            Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles(colors).tabItem,
            mobileTab === "communities" && styles(colors).tabItemActive,
            mobileTab === "communities" && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setMobileTab("communities")}
        >
          <Text
            style={[
              styles(colors).tabLabel,
              { color: mobileTab === "communities" ? colors.primary : colors.textSecondary },
            ]}
          >
            Communities
          </Text>
          {joinedCommunities.length > 0 && (
            <View style={[styles(colors).tabBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles(colors).tabBadgeText}>{joinedCommunities.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Selected community info bar */}
      {selectedCommunity && mobileTab === "feed" && (
        <View style={[styles(colors).communityBar, { backgroundColor: colors.primary + "12", borderBottomColor: colors.border }]}>
          <Text style={[styles(colors).communityBarText, { color: colors.primary }]} numberOfLines={1}>
            📌 {selectedCommunity.name}
          </Text>
          <TouchableOpacity onPress={() => setSelectedCommunity(null)}>
            <Text style={[styles(colors).communityBarClear, { color: colors.textSecondary }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Feed tab */}
      {mobileTab === "feed" && (
        <CommunityFeed
          posts={posts}
          selectedCommunity={selectedBrowseCommunity?.id ?? selectedCommunity?.id}
          isJoinedCommunity={isInJoinedCommunity}
          currentUser={user}
          onLocalPost={handleLocalPost}
        />
      )}

      {/* Communities tab */}
      {mobileTab === "communities" && (
        <View style={styles(colors).communitiesPanel}>
          <JoinedCommunitiesSidebar
            joinedCommunities={joinedCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
          />

          <DiscoverCommunitiesSidebar
            suggestedCommunities={suggestedCommunities}
            trendingCommunities={trendingCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
            onJoinCommunity={handleJoinPress}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    // Desktop
    desktopLayout: {
      flexDirection: "row",
      flex: 1,
      padding: 16,
      gap: 16,
    },
    mainContent: {
      flex: 1,
      minWidth: 0,
      maxWidth: 560,
    },
    // Mobile tab bar
    tabBar: {
      flexDirection: "row",
      borderBottomWidth: 1,
    },
    tabItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 13,
      gap: 6,
      borderBottomWidth: 2.5,
      borderBottomColor: "transparent",
    },
    tabItemActive: {
      // borderBottomColor is applied inline with colors.primary
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: "600",
    },
    tabBadge: {
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 1,
      minWidth: 20,
      alignItems: "center",
    },
    tabBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    // Community info bar
    communityBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
    },
    communityBarText: {
      fontSize: 13,
      fontWeight: "600",
      flex: 1,
    },
    communityBarClear: {
      fontSize: 13,
      marginLeft: 12,
    },
    // Communities panel (mobile)
    communitiesPanel: {
      flex: 1,
      padding: 16,
      gap: 16,
    },
  });
