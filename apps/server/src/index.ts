import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import "dotenv/config";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/users";
import communityRoutes from "./routes/communities";
import uploadRoutes from "./routes/upload";

const app = new Hono();

app.use("*", cors());

app.route("/api/auth", authRoutes);
app.route("/api/posts", postRoutes);
app.route("/api/users", userRoutes);
app.route("/api/communities", communityRoutes);
app.route("/uploads", uploadRoutes);

app.get("/health", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT) || 3000;
console.log(`Server running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
