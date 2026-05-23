import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useCallback, useEffect, useState } from "react";

export interface Comment {
  id: number;
  text: string;
  images?: string[] | null;
  parentId?: number | null;
  likesCount: number;
  createdAt: string | Date;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string | null;
    verified?: boolean;
  };
  /** optimistic: whether the current user has liked this comment */
  likedByMe?: boolean;
}

export function useComments(postId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const { user } = useAuthStore();

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await api.get<{ comments: Comment[] }>(
        `/api/posts/${postId}/comments`,
      );
      setComments(res.comments);
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
    else setComments([]);
  }, [postId, fetchComments]);

  const addComment = useCallback(
    async (input: { text: string; parentId?: number | null; images?: string[] }) => {
      if (!postId || (!input.text.trim() && !input.images?.length)) return;
      setPosting(true);
      try {
        let imageUrls: string[] | undefined;
        if (input.images?.length) {
          imageUrls = await Promise.all(
            input.images.map(async (uri, i) => {
              const ext = uri.split(".").pop() || "jpg";
              const result = await api.upload(
                "/uploads",
                { uri, name: `comment_img_${Date.now()}_${i}.${ext}`, type: `image/${ext}` },
                "comments",
              );
              return result.url;
            }),
          );
        }

        const trimmedText = input.text.trim();
        const comment = await api.post<Comment>(
          `/api/posts/${postId}/comments`,
          {
            text: trimmedText ? trimmedText : undefined,
            parentId: input.parentId ?? undefined,
            images: imageUrls?.length ? imageUrls : undefined,
          },
        );
        // Prepend optimistically
        setComments((prev) => [comment, ...prev]);
      } catch (err) {
        console.error("Add comment error:", err);
        throw err;
      } finally {
        setPosting(false);
      }
    },
    [postId],
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      if (!postId) return;
      // Optimistic remove
      setComments((prev) =>
        prev.filter((c) => c.id !== commentId && c.parentId !== commentId),
      );
      try {
        await api.delete(`/api/posts/${postId}/comments/${commentId}`);
      } catch (err) {
        console.error("Delete comment error:", err);
        await fetchComments();
        throw err;
      }
    },
    [postId, fetchComments],
  );

  const toggleLike = useCallback(
    async (commentId: number) => {
      if (!user) return;
      // Optimistic toggle
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likedByMe: !c.likedByMe,
                likesCount: c.likedByMe
                  ? Math.max(c.likesCount - 1, 0)
                  : c.likesCount + 1,
              }
            : c,
        ),
      );
      try {
        await api.post(
          `/api/posts/${postId}/comments/${commentId}/like`,
        );
      } catch (err) {
        console.error("Like comment error:", err);
        await fetchComments();
      }
    },
    [user, postId, fetchComments],
  );

  return { comments, loading, posting, addComment, deleteComment, toggleLike };
}
