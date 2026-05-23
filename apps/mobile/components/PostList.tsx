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
  onDelete?: (postId: string) => void | Promise<void>;
  currentUserId?: string;
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
  onDelete,
  currentUserId,
  ListHeaderComponent,
}: PostListProps) {
  const colors = useThemeColors();

  const renderPost: ListRenderItem<PostType> = useCallback(
    ({ item }) => (
      <Post
        post={item}
        onUserPress={onUserPress}
        onLike={onLike}
        onComment={onComment}
        onDelete={onDelete}
        currentUserId={currentUserId}
      />
    ),
    [onUserPress, onLike, onComment, onDelete, currentUserId]
  );

  const keyExtractor = useCallback((item: PostType) => String(item.id), []);

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={keyExtractor}
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      scrollEventThrottle={16}
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
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
