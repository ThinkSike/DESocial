import Logo from "@/components/Logo";
import PostList from "@/components/PostList";
import { useThemeColors } from "@/constants/Colors";
import { mockPosts } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would fetch new posts from Firebase here
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    // Navigate to user profile
    Alert.alert("User Profile", `Navigate to profile for user: ${userId}`);
  }, []);

  const handleLike = useCallback((postId: string) => {
    // In a real app, you would update the like count in Firebase
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                likes: post.engagement.likes + 1,
              },
            }
          : post
      )
    );
  }, []);

  const handleRepost = useCallback((postId: string) => {
    // In a real app, you would handle reposting in Firebase
    Alert.alert("Repost", `Repost functionality for post: ${postId}`);
  }, []);

  const handleComment = useCallback((postId: string) => {
    // Navigate to comments screen
    Alert.alert("Comments", `Navigate to comments for post: ${postId}`);
  }, []);

  const handleShare = useCallback((postId: string) => {
    // Handle sharing functionality
    Alert.alert("Share", `Share functionality for post: ${postId}`);
  }, []);

  return (
    <SafeAreaView style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Logo width={50} height={50} />
        <TouchableOpacity
          onPress={() => router.push("/chats" as any)}
          style={styles(colors).chatButton}
        >
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
      <PostList
        posts={posts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onUserPress={handleUserPress}
        onLike={handleLike}
        onRepost={handleRepost}
        onComment={handleComment}
        onShare={handleShare}
      />
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 20,
    },
    logo: {
      width: 50,
      height: 50,
    },
    chatButton: {},
  });
