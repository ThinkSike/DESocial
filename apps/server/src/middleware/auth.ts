import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "desocial-dev-secret-change-in-production";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const authMiddleware = createMiddleware<{
  Variables: { user: JwtPayload };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export const optionalAuth = createMiddleware<{
  Variables: { user?: JwtPayload };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      c.set("user", payload);
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  await next();
});

export { JWT_SECRET };
