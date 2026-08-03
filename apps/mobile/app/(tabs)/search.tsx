import { PostSearchResult } from "@/components/search/PostSearchResult";
import { UserSearchResult } from "@/components/search/UserSearchResult";
import { useThemeColors } from "@/constants/Colors";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import type { UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NewsRecommendation {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  imageUrl?: string;
  category: string;
  trending?: boolean;
}

interface SearchSuggestion {
  id: string;
  type: "user" | "community" | "topic";
  title: string;
  subtitle: string;
  icon: string;
  verified?: boolean;
}

const newsRecommendations: NewsRecommendation[] = [
  {
    id: "1",
    title: "AI Revolution in Higher Education: How Universities Are Adapting",
    summary:
      "Leading universities worldwide are integrating AI tools into curriculum and research programs, reshaping the future of education.",
    source: "Education Today",
    timeAgo: "2h ago",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop",
    category: "Education",
    trending: true,
  },
  {
    id: "2",
    title: "Student Startups Raise Record $2.3B in Funding This Quarter",
    summary:
      "College entrepreneurs are breaking records with innovative solutions in tech, sustainability, and social impact.",
    source: "Startup Chronicle",
    timeAgo: "4h ago",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop",
    category: "Business",
  },
  {
    id: "3",
    title: "Mental Health Support Programs Expand Across Campuses",
    summary:
      "Universities launch comprehensive wellness initiatives as student mental health becomes top priority.",
    source: "Campus Health News",
    timeAgo: "6h ago",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop",
    category: "Health",
  },
  {
    id: "4",
    title: "Sustainable Campus Initiatives Win Global Recognition",
    summary:
      "Green technology implementations and eco-friendly practices are transforming university environments worldwide.",
    source: "Green Campus Report",
    timeAgo: "8h ago",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
    category: "Environment",
  },
  {
    id: "5",
    title: "Virtual Reality Labs Transform STEM Education",
    summary:
      "Immersive learning experiences are revolutionizing how students engage with complex scientific concepts.",
    source: "Tech in Education",
    timeAgo: "10h ago",
    imageUrl:
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=300&h=200&fit=crop",
    category: "Technology",
    trending: true,
  },
];

const searchSuggestions: SearchSuggestion[] = [
  {
    id: "1",
    type: "community",
    title: "Computer Science Club",
    subtitle: "1,247 members • Active now",
    icon: "code-slash",
    verified: true,
  },
  {
    id: "2",
    type: "user",
    title: "Dr. Sarah Johnson",
    subtitle: "Professor • AI Research",
    icon: "person",
    verified: true,
  },
  {
    id: "3",
    type: "topic",
    title: "Machine Learning",
    subtitle: "Trending in CS",
    icon: "trending-up",
  },
  {
    id: "4",
    type: "community",
    title: "Photography Club",
    subtitle: "523 members • 15 new posts",
    icon: "camera",
  },
];

export default function SearchScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isTablet = width > 768;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState<UserProfile[]>([]);
  const [matchedPosts, setMatchedPosts] = useState<Post[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [searchingPosts, setSearchingPosts] = useState(false);

  const trimmedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    let active = true;

    if (!trimmedQuery) {
      setMatchedUsers([]);
      setMatchedPosts([]);
      setSearchingUsers(false);
      setSearchingPosts(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        setSearchingPosts(true);

        const [usersResult, postsResult] = await Promise.all([
          api.get<{ users: UserProfile[] }>(
            `/api/users/search?q=${encodeURIComponent(trimmedQuery)}&limit=10`,
          ),
          api.get<{ posts: Post[] }>("/api/posts?limit=50"),
        ]);

        if (!active) return;
        setMatchedUsers(usersResult.users);

        const normalizedQuery = trimmedQuery.toLowerCase();
        setMatchedPosts(
          postsResult.posts.filter((post) => {
            const haystacks = [
              post.content.text,
              post.user.displayName,
              post.user.username,
              post.community?.name,
              ...(post.content.hashtags ?? []),
            ]
              .filter(Boolean)
              .map((value) => String(value).toLowerCase());

            return haystacks.some((value) => value.includes(normalizedQuery));
          }),
        );
      } catch (error) {
        console.error("Error searching users:", error);
        if (active) {
          setMatchedUsers([]);
          setMatchedPosts([]);
        }
      } finally {
        if (active) {
          setSearchingUsers(false);
          setSearchingPosts(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [trimmedQuery]);

  const renderNewsCard = (news: NewsRecommendation) => (
    <TouchableOpacity
      key={news.id}
      style={[styles.newsCard, { backgroundColor: colors.cardBackground }]}
    >
      {news.imageUrl && (
        <Image source={{ uri: news.imageUrl }} style={styles.newsImage} />
      )}
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {news.category}
            </Text>
          </View>
          {news.trending && (
            <View style={styles.trendingBadge}>
              <Ionicons name="trending-up" size={12} color={colors.secondary} />
              <Text style={[styles.trendingText, { color: colors.secondary }]}>
                Trending
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.newsTitle, { color: colors.text }]}>
          {news.title}
        </Text>
        <Text style={[styles.newsSummary, { color: colors.textSecondary }]}>
          {news.summary}
        </Text>
        <View style={styles.newsFooter}>
          <Text style={[styles.newsSource, { color: colors.textSecondary }]}>
            {news.source}
          </Text>
          <Text style={[styles.newsTime, { color: colors.textSecondary }]}>
            {news.timeAgo}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestion = (suggestion: SearchSuggestion) => (
    <TouchableOpacity
      key={suggestion.id}
      style={[
        styles.suggestionItem,
        { backgroundColor: colors.cardBackground },
      ]}
    >
      <View
        style={[
          styles.suggestionIcon,
          { backgroundColor: colors.primary + "15" },
        ]}
      >
        <Ionicons
          name={suggestion.icon as any}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.suggestionContent}>
        <View style={styles.suggestionHeader}>
          <Text style={[styles.suggestionTitle, { color: colors.text }]}>
            {suggestion.title}
          </Text>
          {suggestion.verified && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.primary}
            />
          )}
        </View>
        <Text
          style={[styles.suggestionSubtitle, { color: colors.textSecondary }]}
        >
          {suggestion.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderUserResult = (user: UserProfile) => (
    <View key={user.id} style={styles.resultCardWrap}>
      <UserSearchResult
        user={user}
        onPress={(userId) => router.push(`/profile?userId=${userId}` as any)}
      />
    </View>
  );

  const renderPostResult = (post: Post) => (
    <View key={post.id} style={styles.resultCardWrap}>
      <PostSearchResult
        post={post}
        onPress={() => {
          if (post.community?.id) {
            router.push(`/forum?community=${encodeURIComponent(post.community.id)}` as any);
          }
        }}
        onUserPress={(userId) => router.push(`/profile?userId=${userId}` as any)}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Search bar */}
      <View
        style={[
          styles.searchHeader,
          {
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <View
          style={[
            styles.searchBarContainer,
            {
              backgroundColor: colors.background,
              borderColor: isSearchFocused ? colors.primary : colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search people, communities, topics..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer} // center all sections
        showsVerticalScrollIndicator={false}
      >
        {trimmedQuery.length > 0 ? (
          <>
            <View style={styles.centerWrap}>
              <Text style={[styles.h1, { color: colors.text }]}>People</Text>

              {searchingUsers ? (
                <View style={[styles.emptyState, { borderColor: colors.border }]}>
                  <Ionicons
                    name="search-outline"
                    size={44}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>Searching profiles...</Text>
                </View>
              ) : matchedUsers.length > 0 ? (
                <View style={styles.resultsContainer}>
                  {matchedUsers.map(renderUserResult)}
                </View>
              ) : (
                <View style={[styles.emptyState, { borderColor: colors.border }]}>
                  <Ionicons
                    name="person-circle-outline"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>Person doesn't exist on the app</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Try another name or username.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.centerWrap}>
              <Text style={[styles.h1, { color: colors.text }]}>Posts</Text>

              {searchingPosts ? (
                <View style={[styles.emptyState, { borderColor: colors.border }]}>
                  <Ionicons
                    name="search-outline"
                    size={44}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>Searching posts...</Text>
                </View>
              ) : matchedPosts.length > 0 ? (
                <View style={styles.resultsContainer}>
                  {matchedPosts.map(renderPostResult)}
                </View>
              ) : (
                <View style={[styles.emptyState, { borderColor: colors.border }]}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No matching posts found</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Try a community name, hashtag, or a different phrase.
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            {/* Popular Searches */}
            <View style={styles.centerWrap}>
              <Text style={[styles.h1, { color: colors.text }]}>
                Popular Searches
              </Text>

              <View style={styles.suggestionsContainer}>
                {searchSuggestions.map(renderSuggestion)}
              </View>
            </View>

            {/* Latest Updates */}
            <View style={styles.centerWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.h1, { color: colors.text }]}>
                  Latest Updates
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAll, { color: colors.textSecondary }]}>
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.newsContainer}>
                {newsRecommendations.map(renderNewsCard)}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const MAX_COL_WIDTH = 680;

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: "center",
  },

  // Centered column wrapper
  centerWrap: {
    width: "100%",
    maxWidth: MAX_COL_WIDTH,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  h1: { fontSize: 18, fontWeight: "700" },
  seeAll: { fontSize: 12 },
  resultsContainer: {
    gap: 8,
  },
  resultCardWrap: {
    width: "100%",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  // Popular search list
  suggestionsContainer: {},
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  suggestionContent: { flex: 1 },
  suggestionHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  suggestionTitle: { fontSize: 16, fontWeight: "600" },
  suggestionSubtitle: { fontSize: 12 },

  // News
  newsContainer: {},
  newsCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },

  // Search header
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    zIndex: 2,
    borderRadius: 16,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: "400" },
  clearButton: { marginLeft: 8 },

  // News card internals
  newsImage: { width: "100%", height: 200 },
  newsContent: { padding: 16 },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  categoryText: { fontSize: 12, fontWeight: "600" },
  trendingBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  trendingText: { fontSize: 12, fontWeight: "600" },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 8,
  },
  newsSummary: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newsSource: { fontSize: 12, fontWeight: "500" },
  newsTime: { fontSize: 12 },
});
