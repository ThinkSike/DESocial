import { CommunitySearchResult } from "@/components/search/CommunitySearchResult";
import {
  PostGridItem,
  PostSearchResult,
} from "@/components/search/PostSearchResult";
import { SearchBar } from "@/components/search/SearchBar";
import { UserSearchResult } from "@/components/search/UserSearchResult";
import { useThemeColors } from "@/constants/Colors";
import { mockPosts } from "@/data/mockData";
import { mockCommunities, mockSearchUsers } from "@/data/searchData";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { Community } from "@/types/search";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewMode = "explore" | "search";
type SearchFilter = "all" | "posts" | "users" | "communities";

export default function SearchScreen() {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("explore");
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Firebase integration points - these would be replaced with actual Firebase queries
  const [searchResults, setSearchResults] = useState<{
    posts: Post[];
    users: UserProfile[];
    communities: Community[];
  }>({
    posts: [],
    users: [],
    communities: [],
  });

  // Mock search function - replace with Firebase search
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ posts: [], users: [], communities: [] });
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowerQuery = query.toLowerCase();

    // Filter posts by content text or user name
    const filteredPosts = mockPosts.filter(
      (post) =>
        post.content.text?.toLowerCase().includes(lowerQuery) ||
        post.user.displayName.toLowerCase().includes(lowerQuery) ||
        post.user.username.toLowerCase().includes(lowerQuery)
    );

    // Sort posts to prioritize those with images
    const sortedPosts = filteredPosts.sort((a, b) => {
      const aHasImages = a.content.images && a.content.images.length > 0;
      const bHasImages = b.content.images && b.content.images.length > 0;

      if (aHasImages && !bHasImages) return -1;
      if (!aHasImages && bHasImages) return 1;
      return 0; // Keep original order for posts of the same type
    });

    // Filter users by name, username, or bio
    const filteredUsers = mockSearchUsers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        user.bio?.toLowerCase().includes(lowerQuery) ||
        user.department?.toLowerCase().includes(lowerQuery)
    );

    // Filter communities by name, description, or tags
    const filteredCommunities = mockCommunities.filter(
      (community) =>
        community.name.toLowerCase().includes(lowerQuery) ||
        community.description.toLowerCase().includes(lowerQuery) ||
        community.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );

    setSearchResults({
      posts: sortedPosts,
      users: filteredUsers,
      communities: filteredCommunities,
    });
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      setViewMode("search");
      performSearch(searchQuery);
    } else {
      setViewMode("explore");
      setSearchResults({ posts: [], users: [], communities: [] });
    }
  }, [searchQuery]);

  // Filter search results based on active filter
  const filteredResults = useMemo(() => {
    if (activeFilter === "all") {
      return searchResults;
    }

    return {
      posts: activeFilter === "posts" ? searchResults.posts : [],
      users: activeFilter === "users" ? searchResults.users : [],
      communities:
        activeFilter === "communities" ? searchResults.communities : [],
    };
  }, [searchResults, activeFilter]);

  // Handle navigation - these would integrate with your navigation system
  const handlePostPress = (postId: string) => {
    Alert.alert("Navigate to Post", `Post ID: ${postId}`);
    // TODO: Navigate to post detail screen
  };

  const handleUserPress = (userId: string) => {
    Alert.alert("Navigate to Profile", `User ID: ${userId}`);
    // TODO: Navigate to user profile screen
  };

  const handleCommunityPress = (communityId: string) => {
    Alert.alert("Navigate to Community", `Community ID: ${communityId}`);
    // TODO: Navigate to community screen
  };

  const renderExploreGrid = () => {
    // Show only posts with images in grid format like Instagram explore
    const postsWithImages = mockPosts.filter(
      (post) => post.content.images && post.content.images.length > 0
    );
    const explorePosts = postsWithImages.slice(0, 12); // Limit for performance

    return (
      <FlatList
        data={explorePosts}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostGridItem post={item} onPress={handlePostPress} />
        )}
        contentContainerStyle={styles.exploreGrid}
        columnWrapperStyle={styles.exploreRow}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderSearchFilters = () => {
    const filters: { key: SearchFilter; label: string; count: number }[] = [
      {
        key: "all",
        label: "All",
        count:
          searchResults.posts.length +
          searchResults.users.length +
          searchResults.communities.length,
      },
      { key: "posts", label: "Posts", count: searchResults.posts.length },
      { key: "users", label: "Users", count: searchResults.users.length },
      {
        key: "communities",
        label: "Communities",
        count: searchResults.communities.length,
      },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === filter.key ? colors.primary : colors.surface,
                borderColor:
                  activeFilter === filter.key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === filter.key ? "white" : colors.textPrimary,
                },
              ]}
            >
              {filter.label} {filter.count > 0 && `(${filter.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderSearchResults = () => {
    const hasResults =
      filteredResults.posts.length > 0 ||
      filteredResults.users.length > 0 ||
      filteredResults.communities.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No results found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Try adjusting your search or filter to find what you're looking for.
          </Text>
        </View>
      );
    }

    const allResults = [
      ...filteredResults.users.map((user) => ({
        type: "user" as const,
        data: user,
      })),
      ...filteredResults.communities.map((community) => ({
        type: "community" as const,
        data: community,
      })),
      ...filteredResults.posts.map((post) => ({
        type: "post" as const,
        data: post,
      })),
    ];

    return (
      <FlatList
        data={allResults}
        keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
        renderItem={({ item }) => {
          switch (item.type) {
            case "user":
              return (
                <UserSearchResult
                  user={item.data as UserProfile}
                  onPress={handleUserPress}
                />
              );
            case "community":
              return (
                <CommunitySearchResult
                  community={item.data as Community}
                  onPress={handleCommunityPress}
                />
              );
            case "post":
              return (
                <PostSearchResult
                  post={item.data as Post}
                  onPress={handlePostPress}
                  onUserPress={handleUserPress}
                />
              );
            default:
              return null;
          }
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.searchResultsContainer}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="default" backgroundColor={colors.background} />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsSearchFocused(true)}
        onClear={() => {
          setSearchQuery("");
          setIsSearchFocused(false);
        }}
        placeholder="Search posts, users, communities..."
      />

      {/* Search Filters - Only show when searching */}
      {viewMode === "search" && renderSearchFilters()}

      {/* Content */}
      <View style={styles.content}>
        {viewMode === "explore" ? renderExploreGrid() : renderSearchResults()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  // Explore grid styles
  exploreGrid: {
    padding: 16,
  },
  exploreRow: {
    justifyContent: "space-between",
    marginBottom: 6,
  },
  // Filter styles
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Search results styles
  searchResultsContainer: {
    paddingBottom: 20,
  },
  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
