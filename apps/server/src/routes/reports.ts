import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db, schema } from "../db";
import { authMiddleware } from "../middleware/auth";

const reports = new Hono();

const VALID_REASONS = [
  "spam",
  "harassment",
  "inappropriate",
  "misinformation",
  "other",
] as const;

const CreateReportSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.number().int().positive(),
  reason: z.enum(VALID_REASONS),
  description: z.string().max(500).optional(),
});

/** POST /api/reports — submit a report */
reports.post("/", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const body = await c.req.json();
    const parsed = CreateReportSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

    const { targetType, targetId, reason, description } = parsed.data;

    // Check the target exists
    if (targetType === "post") {
      const [post] = await db
        .select({ id: schema.posts.id })
        .from(schema.posts)
        .where(eq(schema.posts.id, targetId))
        .limit(1);
      if (!post) return c.json({ error: "Post not found" }, 404);
    } else {
      const [comment] = await db
        .select({ id: schema.comments.id })
        .from(schema.comments)
        .where(eq(schema.comments.id, targetId))
        .limit(1);
      if (!comment) return c.json({ error: "Comment not found" }, 404);
    }

    // Prevent duplicate reports from the same user
    const [existing] = await db
      .select({ id: schema.reports.id })
      .from(schema.reports)
      .where(
        and(
          eq(schema.reports.reporterId, userId),
          eq(schema.reports.targetType, targetType),
          eq(schema.reports.targetId, targetId),
        ),
      )
      .limit(1);

    if (existing) {
      return c.json({ error: "You have already reported this content" }, 409);
    }

    const [report] = await db
      .insert(schema.reports)
      .values({ reporterId: userId, targetType, targetId, reason, description })
      .returning();

    return c.json({ report }, 201);
  } catch (error) {
    console.error("Create report error:", error);
    return c.json({ error: "Failed to submit report" }, 500);
  }
});

export default reports;
