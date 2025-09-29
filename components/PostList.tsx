import Post from "@/components/Post";
import { useThemeColors } from "@/constants/Colors";
import { Post as PostType } from "@/types/post";
import React, { ComponentType, useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from "react-native";

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
  ListHeaderComponent?:
    | ComponentType<any>
    | React.ReactElement<any>
    | null
    | undefined;
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

  const renderPost: ListRenderItem<PostType> = useCallback(
    ({ item }) => (
      <Post
        post={item}
        onUserPress={onUserPress}
        onLike={onLike}
        onRepost={onRepost}
        onComment={onComment}
        onShare={onShare}
      />
    ),
    [onUserPress, onLike, onRepost, onComment, onShare]
  );

  const keyExtractor = useCallback((item: PostType) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={keyExtractor}
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
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
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
      getItemLayout={
        ListHeaderComponent
          ? undefined
          : (data, index) => ({
              length: 200, // Approximate item height
              offset: 200 * index,
              index,
            })
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0, // Remove padding since we handle it at parent level
  },
});
