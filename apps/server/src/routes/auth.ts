import { LoginSchema } from "@desocial/shared";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db, schema } from "../db";
import { JWT_SECRET, authMiddleware, type JwtPayload } from "../middleware/auth";

const auth = new Hono();

// Login accepts either:
//   { prn: "1012412071", password } — student enrollment number
//   { email: "rupali.chopade@despu.edu.in", password } — teacher / alumni full email
const FlexLoginSchema = z.union([
  z.object({ prn: z.string().regex(/^\d{10}$/), password: z.string().min(1) }),
  z.object({ email: z.string().email(), password: z.string().min(1) }),
]);

auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = FlexLoginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Provide your enrollment number or email with a password." }, 400);
    }

    const { password, ...lookup } = parsed.data as any;

    // Build the WHERE clause — match by PRN or email
    const email = "email" in lookup
      ? lookup.email
      : `${lookup.prn}@despu.edu.in`;

    const [user] = await db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.email, email),
          "prn" in lookup ? eq(schema.users.prn, lookup.prn) : undefined!,
        ),
      )
      .limit(1);

    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    if (!user.isActive) {
      return c.json({ error: "Your account has been deactivated. Contact admin." }, 403);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return c.json({ error: "Invalid credentials" }, 401);

    const token = jwt.sign(
      { userId: user.id, email: user.email } satisfies JwtPayload,
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    const { passwordHash: _, ...safeUser } = user;
    return c.json({ user: safeUser, token });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

auth.get("/me", authMiddleware, async (c) => {
  const { userId } = c.get("user");
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (!user) return c.json({ error: "User not found" }, 404);
  if (!user.isActive) return c.json({ error: "Account deactivated" }, 403);

  const { passwordHash: _, ...safeUser } = user;
  return c.json(safeUser);
});

// Change password — required when mustChangePassword is true
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

auth.post("/change-password", authMiddleware, async (c) => {
  try {
    const { userId } = c.get("user");
    const body = await c.req.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) return c.json({ error: "User not found" }, 404);

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!valid) return c.json({ error: "Current password is incorrect" }, 400);

    const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await db
      .update(schema.users)
      .set({ passwordHash: newHash, mustChangePassword: false, updatedAt: new Date() })
      .where(eq(schema.users.id, userId));

    return c.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return c.json({ error: "Failed to change password" }, 500);
  }
});

auth.post("/forgot-password", async (c) => {
  const { email, prn } = await c.req.json();
  const resolvedEmail = prn ? `${String(prn).trim()}@despu.edu.in` : email;
  if (!resolvedEmail) return c.json({ error: "PRN or email is required" }, 400);
  console.log(`Password reset requested for: ${resolvedEmail}`);
  return c.json({ message: `Contact your admin to reset the password for ${resolvedEmail}.` });
});

export default auth;
