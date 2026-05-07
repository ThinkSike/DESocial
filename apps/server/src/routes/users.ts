import { Hono } from "hono";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import { UpdateProfileSchema } from "@desocial/shared";
import { authMiddleware, optionalAuth } from "../middleware/auth";

const users = new Hono();

users.get("/:id", optionalAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!user) return c.json({ error: "User not found" }, 404);

    const followersCount = await db.$count(
      schema.follows,
      eq(schema.follows.followingId, id),
    );
    const followingCount = await db.$count(
      schema.follows,
      eq(schema.follows.followerId, id),
    );
    const postsCount = await db.$count(
      schema.posts,
      eq(schema.posts.userId, id),
    );

    const { passwordHash: _, ...safeUser } = user;
    return c.json({
      ...safeUser,
      stats: {
        followers: followersCount,
        following: followingCount,
        posts: postsCount,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

users.patch("/:id", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const id = c.req.param("id");

    if (userId !== id) return c.json({ error: "Forbidden" }, 403);

    const body = await c.req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [user] = await db
      .update(schema.users)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();

    if (!user) return c.json({ error: "User not found" }, 404);

    const { passwordHash: _, ...safeUser } = user;
    return c.json(safeUser);
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

users.get("/:id/posts", async (c) => {
  try {
    const id = c.req.param("id");
    const limit = Math.min(Number(c.req.query("limit")) || 20, 50);

    const results = await db
      .select({
        id: schema.posts.id,
        userId: schema.posts.userId,
        text: schema.posts.text,
        images: schema.posts.images,
        hashtags: schema.posts.hashtags,
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
      .where(eq(schema.posts.userId, id))
      .orderBy(eq(schema.posts.createdAt, schema.posts.createdAt))
      .limit(limit);

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
      engagement: { likes: row.likesCount, comments: row.commentsCount },
      timestamp: row.createdAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return c.json(formatted);
  } catch (error) {
    console.error("Get user posts error:", error);
    return c.json({ error: "Failed to fetch user posts" }, 500);
  }
});

users.post("/:id/follow", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const targetId = c.req.param("id");
    if (userId === targetId) return c.json({ error: "Cannot follow yourself" }, 400);

    await db.insert(schema.follows).values({
      followerId: userId,
      followingId: targetId,
    });

    return c.json({ following: true }, 201);
  } catch (error: any) {
    if (error?.code === "23505") return c.json({ error: "Already following" }, 409);
    console.error("Follow error:", error);
    return c.json({ error: "Failed to follow" }, 500);
  }
});

users.delete("/:id/follow", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const targetId = c.req.param("id");

    await db
      .delete(schema.follows)
      .where(
        eq(schema.follows.followerId, userId) &&
        eq(schema.follows.followingId, targetId),
      );

    return c.json({ following: false });
  } catch (error) {
    console.error("Unfollow error:", error);
    return c.json({ error: "Failed to unfollow" }, 500);
  }
});

export default users;
