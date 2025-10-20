import Post from "@/components/Post";
import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

interface PostListProps {
  posts: PostType[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  onUserPress?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  ListHeaderComponent?: React.ReactNode;
}

export default function PostList({
  posts,
  onRefresh,
  refreshing = false,
  onLoadMore,
  onUserPress,
  onLike,
  onRepost,
  onComment,
  onShare,
  ListHeaderComponent,
}: PostListProps) {
  const colors = useThemeColors();

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <Post
          post={item}
          onUserPress={onUserPress}
          onLike={onLike}
          onRepost={onRepost}
          onComment={onComment}
          onShare={onShare}
        />
      )}
      keyExtractor={(item) => item.id}
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        ListHeaderComponent as React.ReactElement<any> | undefined
      }
      refreshControl={
        onRefresh && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        )
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0, // Remove padding since we handle it at parent level
  },
});
