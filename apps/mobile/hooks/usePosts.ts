import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Post, PostContent } from "@desocial/shared";
import { useCallback, useEffect, useState } from "react";

interface PostResponse {
  posts: Post[];
  cursor: string | null;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuthStore();

  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const result = await api.get<PostResponse>("/api/posts?limit=20");
      setPosts(result.posts);
      setCursor(result.cursor);
      setHasMore(result.cursor !== null);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !cursor) return;

    try {
      const result = await api.get<PostResponse>(
        `/api/posts?limit=20&cursor=${cursor}`,
      );
      setPosts((prev) => [...prev, ...result.posts]);
      setCursor(result.cursor);
      setHasMore(result.cursor !== null);
    } catch (error) {
      console.error("Error loading more:", error);
    }
  }, [hasMore, loading, cursor]);

  const handleCreatePost = useCallback(
    async (content: PostContent) => {
      if (!user) throw new Error("Not authenticated");

      try {
        // 1. Upload images first (if any) to get real server URLs before creating the post
        let imageUrls: string[] | undefined;
        if (content.images?.length) {
          imageUrls = await Promise.all(
            content.images.map(async (uri, i) => {
              const ext = uri.split(".").pop() || "jpg";
              const result = await api.upload(
                "/uploads",
                { uri, name: `post_img_${Date.now()}_${i}.${ext}`, type: `image/${ext}` },
                "posts",
              );
              return result.url;
            }),
          );
        }

        // 2. Create the post with real image URLs (local file:// URIs are never sent to server)
        const body = {
          content: {
            text: content.text,
            images: imageUrls,
            hashtags: content.hashtags,
          },
        };
        await api.post<Post>("/api/posts", body);

        // 3. Refresh the feed so the new post appears at the top
        await fetchPosts(true);
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    [user, fetchPosts],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      if (!user) return;

      try {
        const result = await api.post<{ liked: boolean }>(
          `/api/posts/${postId}/like`,
        );

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id !== postId) return post;
            const nextLiked = result.liked;
            const prevLiked = !!post.likedByMe;
            const delta = nextLiked === prevLiked ? 0 : nextLiked ? 1 : -1;

            return {
              ...post,
              likedByMe: nextLiked,
              engagement: {
                ...post.engagement,
                likes: Math.max(post.engagement.likes + delta, 0),
              },
            };
          }),
        );
      } catch (error) {
        console.error("Error liking post:", error);
        await fetchPosts(true);
      }
    },
    [user, fetchPosts],
  );

  const updateCommentCount = useCallback((postId: string, delta: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                comments: Math.max(post.engagement.comments + delta, 0),
              },
            }
          : post,
      ),
    );
  }, []);

  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (!user) return;
      // Optimistic removal — instant feedback
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      try {
        await api.delete<{ success: boolean }>(`/api/posts/${postId}`);
      } catch (error: any) {
        console.error("Delete post failed:", error?.message);
        // Roll back the optimistic removal
        await fetchPosts(true);
        // Let the caller know so it can show an alert
        throw error;
      }
    },
    [user, fetchPosts],
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
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
  };
};
