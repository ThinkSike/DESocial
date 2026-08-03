import BMCCMapModal from "@/components/BMCCMapModal";
import CommentsSheet from "@/components/CommentsSheet";
import NewsSidebar from "@/components/NewsSidebar";
import PostCreator from "@/components/PostCreator";
import PostList from "@/components/PostList";
import UserProfileSidebar from "@/components/UserProfileSidebar";
import { useThemeColors } from "@/constants/Colors";
import { usePosts } from "@/hooks/usePosts";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colors = useThemeColors();
  const screenWidth = Dimensions.get("window").width;
  const isTablet = screenWidth > 768;
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    posts,
    loading,
    refreshing,
    hasMore,
    fetchPosts,
    loadMore,
    handleCreatePost,
    handleLike,
    handleDeletePost,
    updateCommentCount,
  } = usePosts();

  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const handleRefresh = useCallback(async () => {
    await fetchPosts(true);
  }, [fetchPosts]);

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/profile?userId=${userId}` as any);
    },
    [router]
  );

  const handleComment = useCallback((postId: string) => {
    setOpenPostId(postId);
  }, []);

  const Header = () => (
    <View style={styles(colors).header}>
      <TouchableOpacity
        onPress={() => setMapVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open DES Pune Campus Map"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles(colors).headerLogo}>DESocial</Text>
      </TouchableOpacity>

      <View style={styles(colors).headerActions}>
        <TouchableOpacity
          onPress={() => router.push("/notifications" as any)}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={{ padding: 6 }}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={styles(colors).container}>
        <Header />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textSecondary, marginTop: 12 }}>
            Loading posts...
          </Text>
        </View>
        <BMCCMapModal visible={mapVisible} onClose={() => setMapVisible(false)} />
      </SafeAreaView>
    );
  }

  // Tablet layout
  if (isTablet) {
    const LEFT_WIDTH = 310;
    const RIGHT_WIDTH = 330;
    const CENTER_MAX_WIDTH = 500;
    const CONTENT_GAP = 16;
    const CONTENT_WIDTH =
      LEFT_WIDTH + CENTER_MAX_WIDTH + RIGHT_WIDTH + CONTENT_GAP * 2;

    return (
      <SafeAreaView style={styles(colors).container}>
        <Header />

        <View style={styles(colors).mainContent}>
          <View
            style={[
              styles(colors).threeColumnLayout,
              { width: CONTENT_WIDTH, alignSelf: "center" },
            ]}
          >
            <View style={{ width: LEFT_WIDTH }}>
              <UserProfileSidebar width={LEFT_WIDTH} />
            </View>

            <View
              style={[
                styles(colors).centerColumn,
                { maxWidth: CENTER_MAX_WIDTH, width: "100%" },
              ]}
            >
              <View style={{ flex: 1, minHeight: 0 }}>
                <PostList
                  posts={posts}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  onLoadMore={loadMore}
                  onUserPress={handleUserPress}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDeletePost}
                  currentUserId={user?.id}
                  ListHeaderComponent={
                    <PostCreator onCreatePost={handleCreatePost} />
                  }
                />
              </View>
            </View>

            <View style={{ width: RIGHT_WIDTH }}>
              <NewsSidebar width={RIGHT_WIDTH} />
            </View>
          </View>
        </View>

        <CommentsSheet
          postId={openPostId}
          visible={openPostId !== null}
          onClose={() => setOpenPostId(null)}
          onCommentCountChange={updateCommentCount}
        />
        <BMCCMapModal visible={mapVisible} onClose={() => setMapVisible(false)} />
      </SafeAreaView>
    );
  }

  // Mobile layout
  return (
    <SafeAreaView style={styles(colors).container}>
      <Header />

      <View style={styles(colors).mobileContent}>
        <PostList
          posts={posts}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={loadMore}
          onUserPress={handleUserPress}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={handleDeletePost}
          currentUserId={user?.id}
          ListHeaderComponent={<PostCreator onCreatePost={handleCreatePost} />}
        />
      </View>

      <CommentsSheet
        postId={openPostId}
        visible={openPostId !== null}
        onClose={() => setOpenPostId(null)}
        onCommentCountChange={updateCommentCount}
      />
      <BMCCMapModal visible={mapVisible} onClose={() => setMapVisible(false)} />
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
    headerLogo: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    headerActions: { flexDirection: "row", alignItems: "center" },
    mainContent: { flex: 1 },
    threeColumnLayout: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      maxWidth: 1200,
      width: "100%",
      alignSelf: "center",
      gap: 16,
    },
    centerColumn: {
      flexGrow: 0,
      flexShrink: 1,
      minWidth: 360,
      minHeight: 0,
    },
    mobileContent: { flex: 1 },
  });
