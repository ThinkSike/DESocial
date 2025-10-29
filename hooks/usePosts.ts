import { useState, useEffect, useCallback } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  likePost,
  unlikePost,
  isPostLiked,
  getUserProfile,
} from "@/utils/firestore";
import { uploadPostImage } from "@/utils/storage";
import type { Post, PostContent } from "@/types/post";
import { useAuthStore } from "@/store/auth";
import { DocumentSnapshot } from "firebase/firestore";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot>();
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuthStore();

  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const result = await getPosts(20);
      setPosts(result.posts);
      setLastDoc(result.lastDoc);
      setHasMore(result.posts.length === 20);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;

    try {
      const result = await getPosts(20, lastDoc);
      setPosts((prev) => [...prev, ...result.posts]);
      setLastDoc(result.lastDoc);
      setHasMore(result.posts.length === 20);
    } catch (error) {
      console.error("Error loading more:", error);
    }
  }, [hasMore, loading, lastDoc]);

  const handleCreatePost = useCallback(
    async (content: PostContent) => {
      if (!user) throw new Error("Not authenticated");

      try {
        const profile = await getUserProfile(user.uid);

        const userData = {
          id: user.uid,
          username: profile?.username || user.email?.split("@")[0] || "user",
          displayName: profile?.displayName || user.displayName || "User",
          avatar: profile?.avatar || user.photoURL || "",
          verified: false,
        };

        // Create post
        const postId = await createPost({
          user: userData,
          content: {
            text: content.text,
            hashtags: content.hashtags,
          },
          engagement: { likes: 0, comments: 0 },
          timestamp: new Date(),
        });

        // Upload images if any
        if (content.images?.length) {
          const imageUrls = await Promise.all(
            content.images.map((uri, i) => uploadPostImage(uri, postId, i)),
          );
          await updatePost(postId, { "content.images": imageUrls } as any);
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
        const isLiked = await isPostLiked(postId, user.uid);

        // Update UI optimistically
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    likes: post.engagement.likes + (isLiked ? -1 : 1),
                  },
                }
              : post,
          ),
        );

        // Update backend
        isLiked
          ? await unlikePost(postId, user.uid)
          : await likePost(postId, user.uid);
      } catch (error) {
        console.error("Error liking post:", error);
        // Revert UI on error
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
