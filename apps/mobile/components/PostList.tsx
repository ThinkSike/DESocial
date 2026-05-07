import Post from "@/components/Post";
import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import React from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";

interface PostListProps {
  posts: PostType[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function PostList({
  posts,
  onRefresh,
  refreshing = false,
  onUserPress,
  onLike,
  onComment,
}: PostListProps) {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {posts.map((post) => (
        <Post
          key={String(post.id)}
          post={post}
          onUserPress={onUserPress}
          onLike={onLike}
          onComment={onComment}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
