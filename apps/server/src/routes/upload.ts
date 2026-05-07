import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const UPLOAD_DIR = join(import.meta.dirname, "..", "..", "uploads");

const upload = new Hono();

upload.get("/:type/:filename", async (c) => {
  const type = c.req.param("type");
  const filename = c.req.param("filename");
  const filepath = join(UPLOAD_DIR, type, filename);

  try {
    const buffer = await readFile(filepath);
    const ext = filename.split(".").pop() || "bin";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      webm: "video/webm",
    };
    return new Response(buffer, {
      headers: { "Content-Type": mimeTypes[ext] || "application/octet-stream" },
    });
  } catch {
    return c.json({ error: "File not found" }, 404);
  }
});

upload.post("/", authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }

    const type = c.req.query("type") || "general";
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${type}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const dir = join(UPLOAD_DIR, type);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    const filepath = join(dir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${type}/${filename}`;
    return c.json({ url, filename }, 201);
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

export default upload;
