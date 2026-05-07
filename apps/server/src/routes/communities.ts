import { Hono } from "hono";
import { db, schema } from "../db";
import { eq, desc, and, sql } from "drizzle-orm";
import { CommunitySchema } from "@desocial/shared";
import { authMiddleware, optionalAuth } from "../middleware/auth";

const communities = new Hono();

communities.get("/", async (c) => {
  try {
    const limit = Math.min(Number(c.req.query("limit")) || 20, 50);
    const results = await db
      .select()
      .from(schema.communities)
      .orderBy(desc(schema.communities.memberCount))
      .limit(limit);

    return c.json(results);
  } catch (error) {
    console.error("Get communities error:", error);
    return c.json({ error: "Failed to fetch communities" }, 500);
  }
});

communities.get("/:id", optionalAuth, async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.json({ error: "Invalid community id" }, 400);

    const [community] = await db
      .select()
      .from(schema.communities)
      .where(eq(schema.communities.id, id))
      .limit(1);

    if (!community) return c.json({ error: "Community not found" }, 404);

    const user = c.get("user");
    let isJoined = false;

    if (user) {
      const [membership] = await db
        .select()
        .from(schema.communityMembers)
        .where(
          and(
            eq(schema.communityMembers.communityId, id),
            eq(schema.communityMembers.userId, user.userId),
          ),
        )
        .limit(1);
      isJoined = !!membership;
    }

    return c.json({ ...community, isJoined });
  } catch (error) {
    console.error("Get community error:", error);
    return c.json({ error: "Failed to fetch community" }, 500);
  }
});

communities.post("/", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CommunitySchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [community] = await db
      .insert(schema.communities)
      .values(parsed.data)
      .returning();

    return c.json(community, 201);
  } catch (error) {
    console.error("Create community error:", error);
    return c.json({ error: "Failed to create community" }, 500);
  }
});

communities.post("/:id/join", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const communityId = Number(c.req.param("id"));
    if (isNaN(communityId)) return c.json({ error: "Invalid community id" }, 400);

    await db.insert(schema.communityMembers).values({
      communityId,
      userId,
    });

    await db
      .update(schema.communities)
      .set({ memberCount: sql`${schema.communities.memberCount} + 1` })
      .where(eq(schema.communities.id, communityId));

    return c.json({ joined: true }, 201);
  } catch (error: any) {
    if (error?.code === "23505") return c.json({ error: "Already a member" }, 409);
    console.error("Join community error:", error);
    return c.json({ error: "Failed to join community" }, 500);
  }
});

communities.delete("/:id/leave", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const communityId = Number(c.req.param("id"));
    if (isNaN(communityId)) return c.json({ error: "Invalid community id" }, 400);

    await db
      .delete(schema.communityMembers)
      .where(
        and(
          eq(schema.communityMembers.communityId, communityId),
          eq(schema.communityMembers.userId, userId),
        ),
      );

    await db
      .update(schema.communities)
      .set({ memberCount: sql`${schema.communities.memberCount} - 1` })
      .where(eq(schema.communities.id, communityId));

    return c.json({ joined: false });
  } catch (error) {
    console.error("Leave community error:", error);
    return c.json({ error: "Failed to leave community" }, 500);
  }
});

export default communities;
