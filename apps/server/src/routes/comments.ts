import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db, schema } from "../db";
import { authMiddleware } from "../middleware/auth";

const comments = new Hono();

const CreateCommentSchema = z.object({
  text: z.string().min(1).max(1000).optional(),
  parentId: z.coerce.number().int().positive().optional(),
  images: z.array(z.string()).max(4).optional(),
});

/** GET /api/posts/:postId/comments — list comments newest first */
comments.get("/:postId/comments", async (c) => {
  try {
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) return c.json({ error: "Invalid post id" }, 400);

    const rows = await db
      .select({
        id: schema.comments.id,
        text: schema.comments.text,
        images: schema.comments.images,
        parentId: schema.comments.parentId,
        likesCount: schema.comments.likesCount,
        createdAt: schema.comments.createdAt,
        user: {
          id: schema.users.id,
          username: schema.users.username,
          displayName: schema.users.displayName,
          avatar: schema.users.avatar,
          verified: schema.users.verified,
        },
      })
      .from(schema.comments)
      .leftJoin(schema.users, eq(schema.comments.userId, schema.users.id))
      .where(eq(schema.comments.postId, postId))
      .orderBy(desc(schema.comments.createdAt));

    return c.json({ comments: rows });
  } catch (err) {
    console.error("Get comments error:", err);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
});

/** POST /api/posts/:postId/comments — add a comment */
comments.post("/:postId/comments", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const postId = Number(c.req.param("postId"));
    if (isNaN(postId)) return c.json({ error: "Invalid post id" }, 400);

    const body = await c.req.json();
    const parsed = CreateCommentSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const { parentId, images, text } = parsed.data;
    if (!text && (!images || images.length === 0)) {
      return c.json({ error: "Text or images are required" }, 400);
    }

    if (parentId) {
      const [parent] = await db
        .select({ id: schema.comments.id })
        .from(schema.comments)
        .where(
          and(
            eq(schema.comments.id, parentId),
            eq(schema.comments.postId, postId),
          ),
        )
        .limit(1);

      if (!parent) return c.json({ error: "Parent comment not found" }, 404);
    }

    const [comment] = await db
      .insert(schema.comments)
      .values({
        postId,
        userId,
        text: text ?? "",
        parentId: parentId ?? null,
        images: images?.length ? images : null,
      })
      .returning();

    // bump post commentsCount
    await db
      .update(schema.posts)
      .set({ commentsCount: sql`${schema.posts.commentsCount} + 1` })
      .where(eq(schema.posts.id, postId));

    // Return with user info attached
    const [withUser] = await db
      .select({
        id: schema.comments.id,
        text: schema.comments.text,
        images: schema.comments.images,
        parentId: schema.comments.parentId,
        likesCount: schema.comments.likesCount,
        createdAt: schema.comments.createdAt,
        user: {
          id: schema.users.id,
          username: schema.users.username,
          displayName: schema.users.displayName,
          avatar: schema.users.avatar,
          verified: schema.users.verified,
        },
      })
      .from(schema.comments)
      .leftJoin(schema.users, eq(schema.comments.userId, schema.users.id))
      .where(eq(schema.comments.id, comment.id));

    return c.json(withUser, 201);
  } catch (err) {
    console.error("Create comment error:", err);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

/** DELETE /api/posts/:postId/comments/:commentId — delete own comment */
comments.delete("/:postId/comments/:commentId", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const postId = Number(c.req.param("postId"));
    const commentId = Number(c.req.param("commentId"));
    if (isNaN(postId) || isNaN(commentId))
      return c.json({ error: "Invalid id" }, 400);

    const [comment] = await db
      .select()
      .from(schema.comments)
      .where(
        and(
          eq(schema.comments.id, commentId),
          eq(schema.comments.postId, postId),
        ),
      )
      .limit(1);

    if (!comment) return c.json({ error: "Comment not found" }, 404);
    if (comment.userId !== userId) return c.json({ error: "Forbidden" }, 403);

    const rows = await db
      .select({ id: schema.comments.id, parentId: schema.comments.parentId })
      .from(schema.comments)
      .where(eq(schema.comments.postId, postId));

    const childrenMap = new Map<number, number[]>();
    rows.forEach((row) => {
      if (row.parentId) {
        const list = childrenMap.get(row.parentId) || [];
        list.push(row.id);
        childrenMap.set(row.parentId, list);
      }
    });

    const idsToDelete: number[] = [];
    const stack = [commentId];
    while (stack.length) {
      const current = stack.pop()!;
      idsToDelete.push(current);
      const children = childrenMap.get(current);
      if (children?.length) stack.push(...children);
    }

    await db
      .delete(schema.comments)
      .where(inArray(schema.comments.id, idsToDelete));

    // Decrement post commentsCount by deleted count
    await db
      .update(schema.posts)
      .set({
        commentsCount: sql`GREATEST(${schema.posts.commentsCount} - ${idsToDelete.length}, 0)`,
      })
      .where(eq(schema.posts.id, postId));

    return c.json({ success: true });
  } catch (err) {
    console.error("Delete comment error:", err);
    return c.json({ error: "Failed to delete comment" }, 500);
  }
});

/** POST /api/posts/:postId/comments/:commentId/like — toggle like on a comment */
comments.post(
  "/:postId/comments/:commentId/like",
  authMiddleware,
  async (c) => {
    try {
      const { userId } = c.get("user");
      const commentId = Number(c.req.param("commentId"));
      if (isNaN(commentId)) return c.json({ error: "Invalid comment id" }, 400);

      const [existing] = await db
        .select()
        .from(schema.commentLikes)
        .where(
          and(
            eq(schema.commentLikes.commentId, commentId),
            eq(schema.commentLikes.userId, userId),
          ),
        )
        .limit(1);

      if (existing) {
        await db
          .delete(schema.commentLikes)
          .where(eq(schema.commentLikes.id, existing.id));
        await db
          .update(schema.comments)
          .set({
            likesCount: sql`GREATEST(${schema.comments.likesCount} - 1, 0)`,
          })
          .where(eq(schema.comments.id, commentId));
        return c.json({ liked: false });
      } else {
        await db
          .insert(schema.commentLikes)
          .values({ commentId, userId });
        await db
          .update(schema.comments)
          .set({ likesCount: sql`${schema.comments.likesCount} + 1` })
          .where(eq(schema.comments.id, commentId));
        return c.json({ liked: true }, 201);
      }
    } catch (err) {
      console.error("Like comment error:", err);
      return c.json({ error: "Failed to like comment" }, 500);
    }
  },
);

export default comments;
