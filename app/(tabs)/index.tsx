import CreatePost from "@/components/CreatePost";
import Logo from "@/components/Logo";
import PostList from "@/components/PostList";
import { useThemeColors } from "@/constants/Colors";
import { mockPosts } from "@/data/mockData";
import { Post, PostContent } from "@/types/post";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
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

  const handleCreatePost = useCallback((content: PostContent) => {
    // Create a new post with mock data
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: {
        id: "current_user",
        username: "you",
        displayName: "You",
        avatar: "https://i.pravatar.cc/150?img=100",
      },
      content,
      engagement: {
        likes: 0,
        reposts: 0,
        comments: 0,
        shares: 0,
      },
      timestamp: new Date(),
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  return (
    <SafeAreaView style={styles(colors).container}>
      <PostList
        posts={posts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onUserPress={handleUserPress}
        onLike={handleLike}
        onRepost={handleRepost}
        onComment={handleComment}
        onShare={handleShare}
        ListHeaderComponent={<CreatePost onCreatePost={handleCreatePost} />}
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
