import { Hono } from "hono";
import { db, schema } from "../db";
import { eq, desc, and, sql } from "drizzle-orm";
import { CreatePostSchema } from "@desocial/shared";
import { authMiddleware } from "../middleware/auth";

const posts = new Hono();

posts.get("/", async (c) => {
  try {
    const limit = Math.min(Number(c.req.query("limit")) || 20, 50);
    const cursor = c.req.query("cursor");

    let query = db
      .select({
        id: schema.posts.id,
        userId: schema.posts.userId,
        text: schema.posts.text,
        images: schema.posts.images,
        hashtags: schema.posts.hashtags,
        communityId: schema.posts.communityId,
        likesCount: schema.posts.likesCount,
        commentsCount: schema.posts.commentsCount,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        user: {
          id: schema.users.id,
          username: schema.users.username,
          displayName: schema.users.displayName,
          avatar: schema.users.avatar,
          verified: schema.users.verified,
        },
      })
      .from(schema.posts)
      .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id))
      .orderBy(desc(schema.posts.createdAt))
      .limit(limit);

    if (cursor) {
      query = query.where(
        sql`${schema.posts.createdAt} < ${new Date(cursor)}`,
      ) as typeof query;
    }

    const results = await query;

    const normalizeArray = (val: unknown): string[] | undefined => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val as string[];
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return [val]; }
      }
      return undefined;
    };

    const formatted = results.map((row) => ({
      id: String(row.id),
      user: row.user,
      content: {
        text: row.text ?? undefined,
        images: normalizeArray(row.images),
        hashtags: normalizeArray(row.hashtags),
      },
      engagement: {
        likes: row.likesCount,
        comments: row.commentsCount,
      },
      community: row.communityId
        ? { id: String(row.communityId), name: "", icon: "" }
        : undefined,
      timestamp: row.createdAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return c.json({
      posts: formatted,
      cursor:
        results.length === limit
          ? results[results.length - 1]?.createdAt?.toISOString()
          : null,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

posts.get("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid post id" }, 400);

    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id))
      .limit(1);

    if (!post) return c.json({ error: "Post not found" }, 404);

    return c.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

posts.post("/", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const body = await c.req.json();
    const parsed = CreatePostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const { content, communityId } = parsed.data;

    const [post] = await db
      .insert(schema.posts)
      .values({
        userId,
        text: content.text,
        images: content.images,
        hashtags: content.hashtags,
        communityId: communityId ? Number(communityId) : null,
      })
      .returning();

    return c.json(post, 201);
  } catch (error) {
    console.error("Create post error:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

posts.delete("/:id", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid post id" }, 400);

    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id))
      .limit(1);

    if (!post) return c.json({ error: "Post not found" }, 404);
    if (post.userId !== userId)
      return c.json({ error: "Forbidden" }, 403);

    await db.delete(schema.posts).where(eq(schema.posts.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

// Like/unlike post
posts.post("/:id/like", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const postId = Number(c.req.param("id"));
    if (isNaN(postId)) return c.json({ error: "Invalid post id" }, 400);

    const [existing] = await db
      .select()
      .from(schema.likes)
      .where(
        and(eq(schema.likes.postId, postId), eq(schema.likes.userId, userId)),
      )
      .limit(1);

    if (existing) {
      await db
        .delete(schema.likes)
        .where(
          and(
            eq(schema.likes.postId, postId),
            eq(schema.likes.userId, userId),
          ),
        );
      await db
        .update(schema.posts)
        .set({ likesCount: sql`${schema.posts.likesCount} - 1` })
        .where(eq(schema.posts.id, postId));
      return c.json({ liked: false });
    } else {
      await db.insert(schema.likes).values({ postId, userId });
      await db
        .update(schema.posts)
        .set({ likesCount: sql`${schema.posts.likesCount} + 1` })
        .where(eq(schema.posts.id, postId));
      return c.json({ liked: true }, 201);
    }
  } catch (error) {
    console.error("Like error:", error);
    return c.json({ error: "Failed to like post" }, 500);
  }
});

posts.get("/:id/like", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const postId = Number(c.req.param("id"));
    if (isNaN(postId)) return c.json({ error: "Invalid post id" }, 400);

    const [like] = await db
      .select()
      .from(schema.likes)
      .where(
        and(eq(schema.likes.postId, postId), eq(schema.likes.userId, userId)),
      )
      .limit(1);

    return c.json({ liked: !!like });
  } catch (error) {
    console.error("Check like error:", error);
    return c.json({ error: "Failed to check like" }, 500);
  }
});

export default posts;
