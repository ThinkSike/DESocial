import bcrypt from "bcryptjs";
import { desc, eq, or } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db, schema } from "../db";
import { authMiddleware } from "../middleware/auth";
import { uuidv4 } from "./_utils";

const admin = new Hono();

// ─── Admin guard middleware ────────────────────────────────────────────────────
admin.use("*", authMiddleware, async (c, next) => {
  const { userId } = c.get("user");
  const [user] = await db
    .select({ role: schema.users.role })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (!user || user.role !== "admin") {
    return c.json({ error: "Admin access required" }, 403);
  }
  await next();
});

// ─── Provision a new account ──────────────────────────────────────────────────

const CreateUserSchema = z.discriminatedUnion("role", [
  // Students / freshers / alumni — identified by enrollment number (PRN)
  z.object({
    role: z.enum(["student", "fresher", "alumni"]),
    prn: z.string().regex(/^\d{10}$/, "PRN must be 10 digits"),
    displayName: z.string().min(1).max(80),
    department: z.string().optional(),
    password: z.string().min(6),
    mustChangePassword: z.boolean().default(true),
  }),
  // Teachers — identified by their full university email
  z.object({
    role: z.literal("teacher"),
    email: z.string().email(),
    displayName: z.string().min(1).max(80),
    department: z.string().optional(),
    password: z.string().min(6),
    mustChangePassword: z.boolean().default(false),
  }),
]);

/** POST /api/admin/users — provision one account */
admin.post("/users", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

    const data = parsed.data;

    // Build email and username
    let email: string;
    let username: string;
    let prn: string | undefined;

    if (data.role === "teacher") {
      email = data.email;
      // username = first part of email, e.g. "rupali.chopade"
      username = data.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_.]/g, "");
      prn = undefined;
    } else {
      email = `${data.prn}@despu.edu.in`;
      username = data.prn; // students use their enrollment number as username
      prn = data.prn;
    }

    // Check for duplicate
    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(or(eq(schema.users.email, email), eq(schema.users.username, username)))
      .limit(1);

    if (existing) {
      return c.json({ error: `An account with email ${email} already exists` }, 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();

    const [user] = await db
      .insert(schema.users)
      .values({
        id: userId,
        email,
        username,
        displayName: data.displayName,
        passwordHash,
        prn: prn ?? null,
        department: data.department ?? null,
        role: data.role,
        isActive: true,
        mustChangePassword: data.mustChangePassword,
        verified: false,
      })
      .returning();

    const { passwordHash: _, ...safeUser } = user;
    return c.json({ user: safeUser }, 201);
  } catch (error) {
    console.error("Admin create user error:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

/** GET /api/admin/users — list all accounts */
admin.get("/users", async (c) => {
  try {
    const role = c.req.query("role");
    const users = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        username: schema.users.username,
        displayName: schema.users.displayName,
        role: schema.users.role,
        department: schema.users.department,
        isActive: schema.users.isActive,
        mustChangePassword: schema.users.mustChangePassword,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(role ? eq(schema.users.role, role as any) : undefined)
      .orderBy(desc(schema.users.createdAt));

    return c.json({ users });
  } catch (error) {
    console.error("Admin list users error:", error);
    return c.json({ error: "Failed to list users" }, 500);
  }
});

/** PATCH /api/admin/users/:id — deactivate, reactivate, reset password, change role */
const UpdateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(["student", "teacher", "alumni", "fresher", "admin"]).optional(),
  newPassword: z.string().min(6).optional(),
  mustChangePassword: z.boolean().optional(),
  department: z.string().optional(),
  displayName: z.string().min(1).max(80).optional(),
});

admin.patch("/users/:id", async (c) => {
  try {
    const userId = c.req.param("id");
    const body = await c.req.json();
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

    const updates: Partial<typeof schema.users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;
    if (parsed.data.role !== undefined) updates.role = parsed.data.role;
    if (parsed.data.mustChangePassword !== undefined) updates.mustChangePassword = parsed.data.mustChangePassword;
    if (parsed.data.department !== undefined) updates.department = parsed.data.department;
    if (parsed.data.displayName !== undefined) updates.displayName = parsed.data.displayName;
    if (parsed.data.newPassword) {
      updates.passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
      updates.mustChangePassword = true; // force change after admin reset
    }

    const [updated] = await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updated) return c.json({ error: "User not found" }, 404);

    const { passwordHash: _, ...safeUser } = updated;
    return c.json({ user: safeUser });
  } catch (error) {
    console.error("Admin update user error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

/** DELETE /api/admin/users/:id — permanently delete an account */
admin.delete("/users/:id", async (c) => {
  try {
    const userId = c.req.param("id");
    await db.delete(schema.users).where(eq(schema.users.id, userId));
    return c.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// ─── Reports management ───────────────────────────────────────────────────────

/** GET /api/admin/reports — list all reports (pending first) */
admin.get("/reports", async (c) => {
  try {
    const status = c.req.query("status") || "pending";
    const rows = await db
      .select()
      .from(schema.reports)
      .where(status !== "all" ? eq(schema.reports.status, status as any) : undefined)
      .orderBy(desc(schema.reports.createdAt));

    return c.json({ reports: rows });
  } catch (error) {
    console.error("Admin list reports error:", error);
    return c.json({ error: "Failed to list reports" }, 500);
  }
});

/** PATCH /api/admin/reports/:id — resolve a report */
admin.patch("/reports/:id", authMiddleware, async (c) => {
  const { userId } = c.get("user");
  const reportId = Number(c.req.param("id"));
  const { status } = await c.req.json();
  if (!["reviewed", "dismissed"].includes(status)) {
    return c.json({ error: "Status must be reviewed or dismissed" }, 400);
  }
  const [updated] = await db
    .update(schema.reports)
    .set({ status, reviewedBy: userId, updatedAt: new Date() })
    .where(eq(schema.reports.id, reportId))
    .returning();
  return c.json({ report: updated });
});

export default admin;
