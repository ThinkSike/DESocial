import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const SOURCE_DIR = "D:\\koniq10k_512x384";
const COUNT = 40;
const BUCKET = "desocial-uploads";
const PUBLIC_URL = "http://192.168.0.225:3000/uploads";

const s3 = new S3Client({
  endpoint: "http://localhost:9002",
  region: "us-east-1",
  credentials: {
    accessKeyId: "desocial",
    secretAccessKey: "desocialminio",
  },
  forcePathStyle: true,
});

const pool = new pg.Pool({
  connectionString: "postgres://desocial:desocial@localhost:5434/desocial",
});

const db = drizzle(pool, { schema });

const postTexts = [
  "Check out this amazing view from campus today!",
  "Working on a new project, stay tuned.",
  "Beautiful sunset captured during evening walk.",
  "Sharing some behind-the-scenes from our workshop.",
  "Nature walk photos from this weekend.",
  "Campus looks stunning this time of year.",
  "Quick snap from the library study session.",
  "Our event setup is coming along nicely.",
  "Love the architecture on this building.",
  "New artwork spotted near the admin block.",
  "Random snap from yesterday's club meetup.",
  "This place never gets old.",
  "Morning vibes on campus.",
  "Caught this during golden hour.",
  "Weekend exploration photos.",
  "Our campus garden is underrated.",
  "Lecture hall views.",
  "Grabbed a quick shot between classes.",
  "Throwback to last semester's fest.",
  "The new lab equipment is fire.",
  "Coffee + code = perfect afternoon.",
  "Campus at dusk is something else.",
  "Study break scenery.",
  "Found this hidden spot near the library.",
  "Rainy day aesthetic on campus.",
  "Annual tech fest preparations.",
  "Just another day in paradise.",
  "Sports ground looking fresh after renovation.",
  "Night photography practice results.",
  "Early morning jog route views.",
  "Our department building got a makeover.",
  "Post-exam celebration vibes.",
  "The reading room has the best lighting.",
  "Weekend project update, making good progress.",
  "Green campus initiative photos.",
  "Cultural fest practice session.",
  "The auditorium setup for today's event.",
  "Caught a rainbow from the rooftop.",
  "Group study session turned photoshoot.",
];

const hashtagSets = [
  ["campus", "photography"],
  ["coding", "dev", "project"],
  ["sunset", "nature"],
  ["workshop", "tech"],
  ["nature", "weekend"],
  ["campus", "views"],
  ["event", "setup"],
  ["architecture", "design"],
  ["art", "creative"],
  ["club", "community"],
  ["campus", "vibes"],
  ["morning", "campus"],
  ["goldenhour", "photography"],
  ["weekend", "explore"],
  ["garden", "nature"],
  ["lecture", "campus"],
  ["throwback", "fest"],
  ["lab", "tech"],
  ["coffee", "code"],
  ["dusk", "photography"],
];

async function seed() {
  const users = await db.select().from(schema.users).limit(5);
  if (users.length === 0) {
    console.log("No users found, run main seed first.");
    await pool.end();
    return;
  }

  await db.delete(schema.posts);
  console.log("Cleared existing posts.");

  console.log(`Picking ${COUNT} random images...`);
  const allFiles = await readdir(SOURCE_DIR);
  const imageFiles = allFiles.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const shuffled = imageFiles.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, COUNT);

  console.log(`Uploading ${COUNT} images to MinIO...`);
  for (let i = 0; i < selected.length; i++) {
    const file = selected[i];
    const buffer = await readFile(join(SOURCE_DIR, file));
    const ext = extname(file).slice(1);
    const mime = ext === "jpg" ? "jpeg" : ext;

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `posts/${file}`,
      Body: buffer,
      ContentType: `image/${mime}`,
    }));

    if ((i + 1) % 10 === 0) console.log(`  Uploaded ${i + 1}/${selected.length}`);
  }
  console.log("Images uploaded.");

  console.log("Creating posts...");
  for (let i = 0; i < COUNT; i++) {
    const user = users[i % users.length];
    const text = postTexts[i % postTexts.length];
    const hashtags = hashtagSets[i % hashtagSets.length];
    const imageUrl = `${PUBLIC_URL}/posts/${selected[i]}`;

    await db.insert(schema.posts).values({
      userId: user.id,
      text,
      hashtags,
      images: [imageUrl],
      likesCount: Math.floor(Math.random() * 50),
      commentsCount: Math.floor(Math.random() * 10),
    });
  }

  console.log(`${COUNT} posts created.`);
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  pool.end();
  process.exit(1);
});
