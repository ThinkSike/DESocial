import { Hono } from "hono";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { authMiddleware } from "../middleware/auth";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9002",
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "desocial",
    secretAccessKey: process.env.S3_SECRET_KEY || "desocialminio",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || "desocial-uploads";

const upload = new Hono();

upload.get("/:type/:filename", async (c) => {
  const type = c.req.param("type");
  const filename = c.req.param("filename");
  const key = `${type}/${filename}`;

  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const response = await s3.send(cmd);
    const buffer = await response.Body!.transformToByteArray();
    const contentType = response.ContentType || "application/octet-stream";
    return new Response(buffer, { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000" } });
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
    const key = `${type}/${filename}`;

    const uploader = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      },
    });

    await uploader.done();

    return c.json({ url: `/uploads/${type}/${filename}`, filename }, 201);
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

export default upload;
