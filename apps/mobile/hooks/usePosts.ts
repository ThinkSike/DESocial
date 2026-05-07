import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Post, PostContent, PostUser } from "@desocial/shared";
import { useAuthStore } from "@/store/auth";

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
        const body: any = { content };
        const post = await api.post<Post>("/api/posts", body);

        if (content.images?.length) {
          const imageUrls = await Promise.all(
            content.images.map(async (uri, i) => {
              const ext = uri.split(".").pop() || "jpg";
              const result = await api.upload(
                `/uploads?type=posts`,
                { uri, name: `post_${post.id}_${i}.${ext}`, type: `image/${ext}` },
                "posts",
              );
              return result.url;
            }),
          );
          post.content.images = imageUrls;
          setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
        }

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
        const liked = await api.get<{ liked: boolean }>(
          `/api/posts/${postId}/like`,
        );

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    likes: post.engagement.likes + (liked.liked ? -1 : 1),
                  },
                }
              : post,
          ),
        );

        if (liked.liked) {
          await api.delete(`/api/posts/${postId}/like`);
        } else {
          await api.post(`/api/posts/${postId}/like`);
        }
      } catch (error) {
        console.error("Error liking post:", error);
        await fetchPosts(true);
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
  };
};
