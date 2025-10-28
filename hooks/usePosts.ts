import { useState, useEffect, useCallback } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  likePost,
  unlikePost,
  isPostLiked,
} from "@/utils/firestore";
import { uploadPostImage } from "@/utils/storage";
import type { Post, PostContent } from "@/types/post";
import { useAuthStore } from "@/store/auth";
import { DocumentSnapshot } from "firebase/firestore";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuthStore();

  // Fetch initial posts
  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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

  // Load more posts (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;

    try {
      const result = await getPosts(20, lastDoc);
      setPosts((prev) => [...prev, ...result.posts]);
      setLastDoc(result.lastDoc);
      setHasMore(result.posts.length === 20);
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
  }, [hasMore, loading, lastDoc]);

  // Create a new post
  const handleCreatePost = useCallback(
    async (content: PostContent) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        // First create the post document to get an ID
        const postId = await createPost({
          user: {
            id: user.uid,
            username: user.displayName || "Anonymous",
            displayName: user.displayName || "Anonymous",
            avatar: user.photoURL || "",
            verified: false,
          },
          content: {
            text: content.text,
            hashtags: content.hashtags,
          },
          engagement: {
            likes: 0,
            comments: 0,
          },
          timestamp: new Date(),
        });

        // Upload images if any
        let imageUrls: string[] = [];
        if (content.images && content.images.length > 0) {
          // Upload images to Firebase Storage
          const uploadPromises = content.images.map(async (imageUri, index) => {
            // Convert image URI to Blob
            const response = await fetch(imageUri);
            const blob = await response.blob();
            return uploadPostImage(blob, postId, index);
          });

          imageUrls = await Promise.all(uploadPromises);

          // Update post with image URLs
          await updatePost(postId, {
            content: {
              ...content,
              images: imageUrls,
            },
          } as any);
        }

        // Refresh posts to show the new one
        await fetchPosts(true);
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    [user, fetchPosts],
  );

  // Handle like/unlike
  const handleLike = useCallback(
    async (postId: string) => {
      if (!user) return;

      try {
        const isLiked = await isPostLiked(postId, user.uid);

        if (isLiked) {
          await unlikePost(postId, user.uid);
          // Optimistically update UI
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    engagement: {
                      ...post.engagement,
                      likes: Math.max(0, post.engagement.likes - 1),
                    },
                  }
                : post,
            ),
          );
        } else {
          await likePost(postId, user.uid);
          // Optimistically update UI
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    engagement: {
                      ...post.engagement,
                      likes: post.engagement.likes + 1,
                    },
                  }
                : post,
            ),
          );
        }
      } catch (error) {
        console.error("Error liking post:", error);
        throw error;
      }
    },
    [user],
  );

  // Initial load
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
