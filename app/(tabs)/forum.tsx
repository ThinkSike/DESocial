import { CommunityFeed } from "@/components/forum/CommunityFeed";
import DiscoverCommunitiesSidebar from "@/components/forum/DiscoverCommunitiesSidebar";
import JoinedCommunitiesSidebar from "@/components/forum/JoinedCommunitiesSidebar";
import { useThemeColors } from "@/constants/Colors";
import {
  getJoinedCommunities,
  getSuggestedCommunities,
  getTrendingCommunities,
} from "@/data/communityData";
import {
  getAllCommunityPosts,
  getPostsByCommunity,
} from "@/data/communityPosts";
import { Community } from "@/types/community";
import React, { useState } from "react";
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

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );

  // Get community data
  const joinedCommunities = getJoinedCommunities();
  const suggestedCommunities = getSuggestedCommunities();
  const trendingCommunities = getTrendingCommunities();

  // Mock joined community IDs
  const joinedCommunityIds = ["cs-club", "basketball-team", "music-society"];

  // Get posts based on selected community
  const getPosts = () => {
    if (!selectedCommunity) {
      return getAllCommunityPosts();
    } else {
      return getPostsByCommunity(selectedCommunity.id);
    }
  };

  const posts = getPosts();

  const handleCommunitySelect = (community: Community | null) => {
    setSelectedCommunity(community);
  };

  const handleJoinCommunity = (communityId: string) => {
    // Handle join community logic
    console.log("Joining community:", communityId);
  };

  if (isTablet) {
    // Three-column layout for tablets
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.tabletLayout}>
          {/* Left Sidebar - Joined Communities */}
          <JoinedCommunitiesSidebar
            joinedCommunities={joinedCommunities}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
          />

          {/* Main Content - Community Feed */}
          <View style={styles.mainContent}>
            <CommunityFeed
              posts={posts}
              selectedCommunity={selectedCommunity?.id}
            />
          </View>

          {/* Right Sidebar - Discover Communities */}
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

  // Mobile layout
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.mobileLayout}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Community Selector */}
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

        {/* Community Feed */}
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
  // Make the community feed column narrower by constraining its maximum width.
  // This keeps it responsive while giving more visual space to the sidebars.
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
