import { LoginSchema, RegisterSchema } from "@desocial/shared";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { db, schema } from "../db";
import { JWT_SECRET, authMiddleware, type JwtPayload } from "../middleware/auth";
import { uuidv4 } from "./_utils";

const auth = new Hono();

auth.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const { prn, password, username, displayName } = parsed.data;

    const email = `${prn}@despu.edu.in`;

    // check by PRN or email to avoid duplicates
    const existingByPrn = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.prn, prn))
      .limit(1);

    const existingByEmail = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingByPrn.length > 0 || existingByEmail.length > 0) {
      return c.json({ error: "Account with this PRN already exists" }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const [user] = await db
      .insert(schema.users)
      .values({
        id: userId,
        email,
        username,
        displayName,
        passwordHash,
        prn,
      })
      .returning();

    const token = jwt.sign(
      { userId: user.id, email: user.email } satisfies JwtPayload,
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { passwordHash: _, ...safeUser } = user;
    return c.json({ user: safeUser, token }, 201);
  } catch (error) {
    console.error("Register error:", error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const { prn, password } = parsed.data;
    const email = `${prn}@despu.edu.in`;

    let user = (await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.prn, prn))
      .limit(1))[0];

    // fallback to email lookup if PRN lookup didn't find a user
    if (!user) {
      const byEmail = (await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1))[0];
      if (byEmail) {
        user = byEmail;
      }
    }

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email } satisfies JwtPayload,
      JWT_SECRET,
      { expiresIn: "7d" },
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

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const { passwordHash: _, ...safeUser } = user;
  return c.json(safeUser);
});

auth.post("/forgot-password", async (c) => {
  const { email, prn } = await c.req.json();
  const resolvedEmail = prn ? `${String(prn).trim()}@despu.edu.in` : email;
  if (!resolvedEmail) {
    return c.json({ error: "PRN or email is required" }, 400);
  }
  // In production, send email with reset link
  // For local dev, just acknowledge the request
  console.log(`Password reset requested for: ${resolvedEmail}`);
  return c.json({ message: "If the email exists, a reset link has been sent." });
});

export default auth;
