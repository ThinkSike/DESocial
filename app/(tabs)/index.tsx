import Logo from "@/components/Logo";
import NewsSidebar from "@/components/NewsSidebar";
import PostCreator from "@/components/PostCreator";
import PostList from "@/components/PostList";
import UserProfileSidebar from "@/components/UserProfileSidebar";
import { useThemeColors } from "@/constants/Colors";
import { mockPosts } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 768;

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

  const handleCreatePost = useCallback((content: string) => {
    // In a real app, you would create a new post in Firebase
    const newPost = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        username: 'tiyabhavsar',
        displayName: 'Tiya Bhavsar',
        avatar: 'https://i.pravatar.cc/150?img=1',
        verified: false,
      },
      content: {
        text: content,
      },
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

  if (isTablet) {
    // Desktop/Tablet layout with three columns
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
        
        <ScrollView 
          style={styles(colors).mainContent}
          contentContainerStyle={styles(colors).mainContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(colors).threeColumnLayout}>
            {/* Left Sidebar */}
            <UserProfileSidebar />
            
            {/* Main Content */}
            <View style={styles(colors).centerColumn}>
              <PostCreator onCreatePost={handleCreatePost} />
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
            </View>
            
            {/* Right Sidebar */}
            <NewsSidebar />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Mobile layout - single column
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
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
    logo: {
      width: 50,
      height: 50,
    },
    chatButton: {},
    mainContent: {
      flex: 1,
    },
    mainContentContainer: {
      paddingBottom: 20,
    },
    threeColumnLayout: {
      flexDirection: "row",
      justifyContent: "center",
      maxWidth: 1200,
      width: "100%",
      alignSelf: "center",
    },
    centerColumn: {
      flex: 1,
      maxWidth: 540,
      minWidth: 400,
    },
    mobileContent: {
      flex: 1,
    },
  });
