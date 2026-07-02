import { UpdateProfileSchema } from "@desocial/shared";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db, schema } from "../db";
import { authMiddleware, optionalAuth } from "../middleware/auth";

const users = new Hono();

users.get("/search", optionalAuth, async (c) => {
  try {
    const query = c.req.query("q")?.trim();
    if (!query) {
      return c.json({ users: [] });
    }

    const limit = Math.min(Number(c.req.query("limit")) || 20, 50);
    const matches = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        displayName: schema.users.displayName,
        email: schema.users.email,
        avatar: schema.users.avatar,
        bio: schema.users.bio,
        prn: schema.users.prn,
        department: schema.users.department,
        verified: schema.users.verified,
        profileViews: schema.users.profileViews,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users)
      .where(
        or(
          ilike(schema.users.username, `%${query}%`),
          ilike(schema.users.displayName, `%${query}%`),
        ),
      )
      .orderBy(desc(schema.users.createdAt))
      .limit(limit);

    const usersWithStats = await Promise.all(
      matches.map(async (user) => {
        const [followers, following, posts, comments] = await Promise.all([
          db.$count(schema.follows, eq(schema.follows.followingId, user.id)),
          db.$count(schema.follows, eq(schema.follows.followerId, user.id)),
          db.$count(schema.posts, eq(schema.posts.userId, user.id)),
          db.$count(schema.comments, eq(schema.comments.userId, user.id)),
        ]);

        return {
          ...user,
          stats: {
            followers,
            following,
            posts,
            comments,
            profileViews: user.profileViews ?? 0,
          },
        };
      }),
    );

    return c.json({ users: usersWithStats });
  } catch (error) {
    console.error("Search users error:", error);
    return c.json({ error: "Failed to search users" }, 500);
  }
});

users.get("/:id", optionalAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const viewerId = c.get("user")?.userId;

    if (viewerId && viewerId !== id) {
      await db
        .update(schema.users)
        .set({ profileViews: sql`${schema.users.profileViews} + 1` })
        .where(eq(schema.users.id, id));
    }

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
    const commentsCount = await db.$count(
      schema.comments,
      eq(schema.comments.userId, id),
    );

    const isFollowing = viewerId
      ? (await db
          .select({ id: schema.follows.id })
          .from(schema.follows)
          .where(
            and(
              eq(schema.follows.followerId, viewerId),
              eq(schema.follows.followingId, id),
            ),
          )
          .limit(1)).length > 0
      : false;

    const { passwordHash: _, ...safeUser } = user;
    return c.json({
      ...safeUser,
      stats: {
        followers: followersCount,
        following: followingCount,
        posts: postsCount,
        comments: commentsCount,
        profileViews: user.profileViews ?? 0,
      },
      isFollowing,
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

    if (parsed.data.username) {
      const normalizedUsername = parsed.data.username.trim();
      const [existingUsername] = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.username, normalizedUsername))
        .limit(1);

      if (existingUsername && existingUsername.id !== id) {
        return c.json({ error: "Username is already taken" }, 409);
      }

      parsed.data.username = normalizedUsername;
    }

    if (parsed.data.displayName) {
      parsed.data.displayName = parsed.data.displayName.trim();
    }

    if (parsed.data.bio !== undefined) {
      parsed.data.bio = parsed.data.bio.trim();
    }

    const [updatedUser] = await db
      .update(schema.users)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();

    if (!updatedUser) return c.json({ error: "User not found" }, 404);

    const { passwordHash: __, ...safeUser } = updatedUser;
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
      .orderBy(desc(schema.posts.createdAt))
      .limit(limit);

    const normalizeArray = (val: unknown): string[] | undefined => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val as string[];
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [val];
        }
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

users.get("/:id/comments", async (c) => {
  try {
    const id = c.req.param("id");
    const limit = Math.min(Number(c.req.query("limit")) || 20, 50);

    const rows = await db
      .select({
        id: schema.comments.id,
        text: schema.comments.text,
        createdAt: schema.comments.createdAt,
        post: {
          id: schema.posts.id,
          text: schema.posts.text,
          images: schema.posts.images,
          createdAt: schema.posts.createdAt,
          user: {
            id: schema.users.id,
            username: schema.users.username,
            displayName: schema.users.displayName,
            avatar: schema.users.avatar,
            verified: schema.users.verified,
          },
        },
      } as any)
      .from(schema.comments)
      .leftJoin(schema.posts, eq(schema.comments.postId, schema.posts.id))
      .leftJoin(schema.users, eq(schema.posts.userId, schema.users.id))
      .where(eq(schema.comments.userId, id))
      .orderBy(desc(schema.comments.createdAt))
      .limit(limit);

    const normalizeArray = (val: unknown): string[] | undefined => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val as string[];
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [val];
        }
      }
      return undefined;
    };

    const formatted = (rows as any[]).map((row) => ({
      id: row.id,
      text: row.text,
      createdAt: row.createdAt,
      post: row.post
        ? {
            ...(row.post as any),
            images: normalizeArray((row.post as any).images),
          }
        : null,
    }));

    return c.json(formatted);
  } catch (error) {
    console.error("Get user comments error:", error);
    return c.json({ error: "Failed to fetch user comments" }, 500);
  }
});

users.post("/:id/follow", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const targetId = c.req.param("id");

    if (userId === targetId) {
      return c.json({ error: "Cannot follow yourself" }, 400);
    }

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
      .where(and(eq(schema.follows.followerId, userId), eq(schema.follows.followingId, targetId)));

    return c.json({ following: false });
  } catch (error) {
    console.error("Unfollow error:", error);
    return c.json({ error: "Failed to unfollow" }, 500);
  }
});

export default users;
