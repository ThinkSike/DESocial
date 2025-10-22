import Logo from "@/components/Logo";
import NewsSidebar from "@/components/NewsSidebar";
import PostCreator from "@/components/PostCreator";
import PostList from "@/components/PostList";
import UserProfileSidebar from "@/components/UserProfileSidebar";
import { useThemeColors } from "@/constants/Colors";
import { mockPosts } from "@/data/mockData";
import { openMaps } from '@/utils/maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<typeof mockPosts>(mockPosts);
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 768;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    Alert.alert("User Profile", `Navigate to profile for user: ${userId}`);
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts((prevPosts: typeof mockPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, engagement: { ...post.engagement, likes: post.engagement.likes + 1 } }
          : post
      )
    );
  }, []);

  const handleRepost = useCallback((postId: string) => {
    Alert.alert("Repost", `Repost functionality for post: ${postId}`);
  }, []);

  const handleComment = useCallback((postId: string) => {
    Alert.alert("Comments", `Navigate to comments for post: ${postId}`);
  }, []);

  const handleShare = useCallback((postId: string) => {
    Alert.alert("Share", `Share functionality for post: ${postId}`);
  }, []);

  const handleCreatePost = useCallback((content: string) => {
    const newPost = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        username: '',
        displayName: '',
        avatar: 'https://i.pravatar.cc/150?img=1',
        verified: false,
      },
      content: { text: content },
      engagement: { likes: 0, reposts: 0, comments: 0, shares: 0 },
      timestamp: new Date(),
    } as (typeof mockPosts)[number];

    setPosts((prevPosts: typeof mockPosts) => [newPost, ...prevPosts]);
  }, []);

  const handleOpenMaps = React.useCallback(() => {
    // You can swap the query for a dynamic value later (e.g., user location)
    openMaps({ query: 'Colleges near me' });
  }, []);

  if (isTablet) {
    const LEFT_WIDTH = 310;
    const RIGHT_WIDTH = 330;
    const CENTER_MAX_WIDTH = 420;

    // row width = left + center + right + gaps (16px between columns)
    const CONTENT_GAP = 16;
    const CONTENT_WIDTH =
      LEFT_WIDTH + CENTER_MAX_WIDTH + RIGHT_WIDTH + CONTENT_GAP * 2;

    return (
      <SafeAreaView style={styles(colors).container}>
        <View style={styles(colors).header}>
          <TouchableOpacity
            onPress={handleOpenMaps}
            accessibilityRole="button"
            accessibilityLabel="Open Maps"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Logo width={50} height={50} />
          </TouchableOpacity>

          <View style={styles(colors).headerActions}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={{ padding: 6 }}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles(colors).mainContent}>
          {/* Center the whole 3-column row */}
          <View
            style={[
              styles(colors).threeColumnLayout,
              { width: CONTENT_WIDTH, alignSelf: 'center' },
            ]}
          >
            <View style={{ width: LEFT_WIDTH }}>
              <UserProfileSidebar width={LEFT_WIDTH} />
            </View>

            <View
              style={[
                styles(colors).centerColumn,
                { maxWidth: CENTER_MAX_WIDTH, width: '100%' },
              ]}
            >
              <View style={{ flex: 1, minHeight: 0 }}>
                <PostList
                  posts={posts}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  onUserPress={handleUserPress}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onComment={handleComment}
                  onShare={handleShare}
                  ListHeaderComponent={<PostCreator onCreatePost={handleCreatePost} />}
                />
              </View>
            </View>

            <View style={{ width: RIGHT_WIDTH }}>
              <NewsSidebar width={RIGHT_WIDTH} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Mobile layout
  return (
    <SafeAreaView style={styles(colors).container}>
      <View style={styles(colors).header}>
        {/* Logo opens maps */}
        <TouchableOpacity
          onPress={handleOpenMaps}
          accessibilityRole="button"
          accessibilityLabel="Open Maps"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Logo width={50} height={50} />
        </TouchableOpacity>

        <View style={styles(colors).headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={{ padding: 6 }}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles(colors).mobileContent}>
        <PostList
          posts={posts}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onUserPress={handleUserPress}
          onLike={handleLike}
          onRepost={handleRepost}
          onComment={handleComment}
          onShare={handleShare}
          ListHeaderComponent={<PostCreator onCreatePost={handleCreatePost} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerActions: { flexDirection: "row", alignItems: "center" },

    // Root area under header
    mainContent: { flex: 1 },                 // no ScrollView here

    threeColumnLayout: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      maxWidth: 1200,
      width: "100%",
      alignSelf: "center",
      gap: 16,
    },
    // Make center take only its content width, allow inner list to scroll
    centerColumn: {
      flexGrow: 0,
      flexShrink: 1,
      minWidth: 360,   // was 360/400 — allow a tighter center
      minHeight: 0,
    },

    feedList: { flex: 1 },                    // FlatList gets flex to enable scrolling

    mobileContent: { flex: 1 },
  });