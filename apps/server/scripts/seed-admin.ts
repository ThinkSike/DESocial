import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { db, schema } from "../src/db";
import { uuidv4 } from "../src/routes/_utils";

const PRN = "1012412071";
const TEMP_PASSWORD = "password123";

async function seedAdmin(): Promise<void> {
  const email = `${PRN}@despu.edu.in`;
  const passwordHash = await bcrypt.hash(TEMP_PASSWORD, 10);

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(or(eq(schema.users.prn, PRN), eq(schema.users.email, email)))
    .limit(1);

  if (existing) {
    await db
      .update(schema.users)
      .set({
        email,
        username: PRN,
        displayName: existing.displayName || "Admin",
        passwordHash,
        prn: PRN,
        role: "admin",
        isActive: true,
        mustChangePassword: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, existing.id));

    console.log("Admin user updated:", email);
    return;
  }

  await db.insert(schema.users).values({
    id: uuidv4(),
    email,
    username: PRN,
    displayName: "Admin",
    passwordHash,
    prn: PRN,
    role: "admin",
    isActive: true,
    mustChangePassword: true,
    verified: true,
  });

  console.log("Admin user created:", email);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  });
