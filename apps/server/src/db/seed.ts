import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: "postgres://desocial:desocial@localhost:5434/desocial",
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("Resetting and seeding database...");

  // Clear existing data
  await db.delete(schema.likes);
  await db.delete(schema.follows);
  await db.delete(schema.comments);
  await db.delete(schema.communityMembers);
  await db.delete(schema.posts);
  await db.delete(schema.communities);
  await db.delete(schema.users);

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create users
  const [alice] = await db.insert(schema.users).values({
    id: "user-001", email: "alice@desocial.app", username: "alice",
    displayName: "Alice Johnson", passwordHash, bio: "CS major, coffee addict ☕",
    department: "Computer Science", prn: "PRN2024001", verified: true,
  }).returning();

  const [bob] = await db.insert(schema.users).values({
    id: "user-002", email: "bob@desocial.app", username: "bob",
    displayName: "Bob Smith", passwordHash, bio: "Design enthusiast | UI/UX",
    department: "Design", prn: "PRN2024002",
  }).returning();

  const [carol] = await db.insert(schema.users).values({
    id: "user-003", email: "carol@desocial.app", username: "carol",
    displayName: "Carol Williams", passwordHash,
    bio: "Backend dev | Open source contributor", department: "Computer Science",
    prn: "PRN2024003", verified: true,
  }).returning();

  const [dave] = await db.insert(schema.users).values({
    id: "user-004", email: "dave@desocial.app", username: "dave",
    displayName: "Dave Kumar", passwordHash, bio: "Sports & fitness",
    department: "Mechanical", prn: "PRN2024004",
  }).returning();

  const [eve] = await db.insert(schema.users).values({
    id: "user-005", email: "eve@desocial.app", username: "eve",
    displayName: "Eve Martinez", passwordHash, bio: "Cultural secretary | Dance club",
    department: "Arts", prn: "PRN2024005", verified: true,
  }).returning();

  console.log("Users seeded: 5");

  // Add PRN accounts requested
  const prnList = [
    "1012412071",
    "1012412074",
    "1012412073",
    "1012412079",
  ];

  for (const [i, prn] of prnList.entries()) {
    const id = `user-00${6 + i}`;
    const email = `${prn}@despu.edu.in`;
    await db.insert(schema.users).values({
      id,
      email,
      username: `stud${prn}`,
      displayName: `Student ${prn}`,
      passwordHash,
      prn,
      verified: true,
    });
  }

  console.log(`PRN users seeded: ${prnList.length}`);

  // Create communities
  const [csClub] = await db.insert(schema.communities).values({
    name: "CS Club", description: "Official Computer Science club — hackathons, workshops, and networking events for tech enthusiasts",
    category: "Academic", type: "academic", memberCount: 4, tags: ["coding", "hackathons", "tech", "workshops"], trending: true, isVerified: true,
  }).returning();

  const [designHub] = await db.insert(schema.communities).values({
    name: "Design Hub", description: "Community for UI/UX designers, graphic artists, and creative minds to share work and collaborate",
    category: "Creative", type: "social", memberCount: 3, tags: ["design", "ui-ux", "creative", "figma"], trending: true,
  }).returning();

  const [sportsClub] = await db.insert(schema.communities).values({
    name: "Sports Club", description: "Football, basketball, cricket, badminton — all sports, all levels welcome!",
    category: "Sports", type: "sports", memberCount: 2, tags: ["sports", "fitness", "football", "cricket"],
  }).returning();

  const [musicSoc] = await db.insert(schema.communities).values({
    name: "Music Society", description: "For musicians, singers, and music lovers — jam sessions, open mics, and band performances",
    category: "Cultural", type: "cultural", memberCount: 2, tags: ["music", "band", "open-mic"], trending: true,
  }).returning();

  const [roboClub] = await db.insert(schema.communities).values({
    name: "Robotics Club", description: "Build robots, compete in robotics challenges, and explore embedded systems",
    category: "Technical", type: "technical", memberCount: 1, tags: ["robotics", "arduino", "embedded"],
  }).returning();

  const [photoClub] = await db.insert(schema.communities).values({
    name: "Photography Club", description: "Capture moments, learn photography techniques, and go on photo walks around campus",
    category: "Hobby", type: "hobby", memberCount: 1, tags: ["photography", "creative", "photo-walks"],
  }).returning();

  console.log("Communities seeded: 6");

  // Create posts
  const allUsers = [alice, bob, carol, dave, eve];
  const allCommunities = [csClub, designHub, sportsClub, musicSoc, roboClub, photoClub];

  const postData = [
    { userId: alice.id, text: "Just finished our CS Club hackathon project — a real-time collaborative code editor! 48 hours of pure adrenaline. 🚀", hashtags: ["hackathon", "coding", "csclub"], likesCount: 12, commentsCount: 4, communityId: csClub.id },
    { userId: bob.id, text: "New design system drop! Clean components, accessible color palette, and responsive breakpoints. Figma file in bio.", hashtags: ["design", "ui-ux", "figma"], likesCount: 8, commentsCount: 2, communityId: designHub.id },
    { userId: carol.id, text: "Hot take: Rust is the future of systems programming. The borrow checker is your friend, not your enemy.", hashtags: ["rust", "programming", "systems"], likesCount: 15, commentsCount: 6 },
    { userId: dave.id, text: "Inter-college football tournament this Saturday! Come support our team at the main ground. ⚽", hashtags: ["football", "sports", "tournament"], likesCount: 20, commentsCount: 5, communityId: sportsClub.id },
    { userId: eve.id, text: "Open mic night this Friday at the amphitheater! Bring your instruments, poetry, or just come vibe. 🎤", hashtags: ["openmic", "music", "campus"], likesCount: 18, commentsCount: 3, communityId: musicSoc.id },
    { userId: alice.id, text: "Just deployed my first full-stack app with Next.js + Hono + Drizzle. The DX is incredible!", hashtags: ["nextjs", "hono", "fullstack"], likesCount: 10, commentsCount: 4 },
    { userId: bob.id, text: "Accessibility isn't optional — it's fundamental. Here's my checklist for designing inclusive interfaces.", hashtags: ["accessibility", "a11y", "design"], likesCount: 25, commentsCount: 8, communityId: designHub.id },
    { userId: carol.id, text: "Open source contribution tip: start with documentation. It's the easiest way to get familiar with a codebase.", hashtags: ["opensource", "tips", "dev"], likesCount: 14, commentsCount: 2 },
    { userId: dave.id, text: "Morning run club starting tomorrow at 6 AM! Meet at the sports complex. All fitness levels welcome.", hashtags: ["fitness", "running", "health"], likesCount: 7, commentsCount: 1, communityId: sportsClub.id },
    { userId: eve.id, text: "Our band 'The Debuggers' is looking for a bassist! DM if interested. Practices twice a week.", hashtags: ["band", "music", "bassist"], likesCount: 11, commentsCount: 5, communityId: musicSoc.id },
    { userId: alice.id, text: "Hosting a workshop on Git & GitHub this Wednesday at Lab 3. Beginners welcome! Bring your laptops.", hashtags: ["git", "workshop", "beginners"], likesCount: 9, commentsCount: 3, communityId: csClub.id },
    { userId: bob.id, text: "Color theory cheat sheet I made for our design club. Save this for your next project! 🎨", hashtags: ["color", "design", "cheatsheet"], likesCount: 30, commentsCount: 7, communityId: designHub.id },
  ];

  for (const p of postData) {
    await db.insert(schema.posts).values(p);
  }

  console.log("Posts seeded: 12");

  // Add community members
  const memberData = [
    { communityId: csClub.id, userId: alice.id, role: "admin" as const },
    { communityId: csClub.id, userId: bob.id, role: "member" as const },
    { communityId: csClub.id, userId: carol.id, role: "member" as const },
    { communityId: csClub.id, userId: dave.id, role: "member" as const },
    { communityId: designHub.id, userId: bob.id, role: "admin" as const },
    { communityId: designHub.id, userId: alice.id, role: "member" as const },
    { communityId: designHub.id, userId: eve.id, role: "member" as const },
    { communityId: sportsClub.id, userId: dave.id, role: "admin" as const },
    { communityId: sportsClub.id, userId: alice.id, role: "member" as const },
    { communityId: musicSoc.id, userId: eve.id, role: "admin" as const },
    { communityId: musicSoc.id, userId: carol.id, role: "member" as const },
    { communityId: roboClub.id, userId: carol.id, role: "admin" as const },
    { communityId: photoClub.id, userId: bob.id, role: "admin" as const },
  ];

  for (const m of memberData) {
    await db.insert(schema.communityMembers).values(m);
  }

  console.log("Community members seeded: 13");

  // Add follows
  const followData = [
    { followerId: alice.id, followingId: bob.id },
    { followerId: alice.id, followingId: carol.id },
    { followerId: alice.id, followingId: eve.id },
    { followerId: bob.id, followingId: alice.id },
    { followerId: bob.id, followingId: carol.id },
    { followerId: carol.id, followingId: alice.id },
    { followerId: carol.id, followingId: dave.id },
    { followerId: dave.id, followingId: alice.id },
    { followerId: dave.id, followingId: eve.id },
    { followerId: eve.id, followingId: bob.id },
    { followerId: eve.id, followingId: carol.id },
  ];

  for (const f of followData) {
    await db.insert(schema.follows).values(f);
  }

  console.log("Follows seeded: 11");

  await pool.end();
  console.log("\nSeed complete!");
  console.log("  Login: alice@desocial.app / password123");
  console.log("  Login: bob@desocial.app   / password123");
}

seed().catch((e) => {
  console.error(e);
  pool.end();
  process.exit(1);
});
