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
        // Fetch user profile from Firestore
        const userProfile = await getUserProfile(user.uid);

        // Build user data from profile or fallback to auth data
        const userData = {
          id: user.uid,
          username:
            userProfile?.username || user.email?.split("@")[0] || "user",
          displayName: userProfile?.displayName || user.displayName || "User",
          avatar: userProfile?.avatar || user.photoURL || "",
          verified: false,
        };

        // Build the post content object, only including defined fields
        const postContent: any = {};
        if (content.text) {
          postContent.text = content.text;
        }
        if (content.hashtags && content.hashtags.length > 0) {
          postContent.hashtags = content.hashtags;
        }

        // First create the post document to get an ID
        const postId = await createPost({
          user: userData,
          content: postContent,
          engagement: {
            likes: 0,
            comments: 0,
          },
          timestamp: new Date(),
        });

        // Upload images if any
        if (content.images && content.images.length > 0) {
          console.log("Uploading images...");

          // Upload images to Firebase Storage
          const uploadPromises = content.images.map(async (imageUri, index) => {
            console.log(
              `Uploading image ${index + 1}/${content.images!.length}:`,
              imageUri,
            );
            try {
              const url = await uploadPostImage(imageUri, postId, index);
              console.log(`Image ${index + 1} uploaded successfully:`, url);
              return url;
            } catch (error: any) {
              console.error(`Error uploading image ${index + 1}:`, {
                message: error.message,
                code: error.code,
                serverResponse: error.serverResponse,
                customData: error.customData,
              });
              throw error;
            }
          });

          const imageUrls = await Promise.all(uploadPromises);
          console.log("All images uploaded successfully:", imageUrls);

          // Update post with image URLs
          await updatePost(postId, {
            "content.images": imageUrls,
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
