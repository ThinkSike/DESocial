import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { db, schema } from "../src/db";
import { uuidv4 } from "../src/routes/_utils";

const TEMP_PASSWORD = "password123";

type SeedAccount = {
  prn: string;
  displayName: string;
  role: "student" | "fresher" | "alumni" | "teacher";
  department?: string;
  email?: string;
};

const ACCOUNTS: SeedAccount[] = [
  { prn: "1012412071", displayName: "Tiya Bhavsar", role: "student", department: "Computer Science" },
  { prn: "1012412072", displayName: "Student Two", role: "student", department: "Computer Science" },
  { prn: "1012412073", displayName: "Student Three", role: "student", department: "Computer Science" },
  { prn: "1012412074", displayName: "Student Four", role: "student", department: "Computer Science" },
  { prn: "1012412075", displayName: "Student Five", role: "student", department: "Computer Science" },
  { prn: "1012412076", displayName: "Student Six", role: "student", department: "Computer Science" },
  { prn: "1012412077", displayName: "Student Seven", role: "student", department: "Computer Science" },
  { prn: "1012412078", displayName: "Student Eight", role: "student", department: "Computer Science" },
  { prn: "1012412079", displayName: "Student Nine", role: "student", department: "Computer Science" },
  { prn: "1012412080", displayName: "Student Ten", role: "student", department: "Computer Science" },
];

async function upsertAccount(account: SeedAccount): Promise<void> {
  const email = account.email ?? `${account.prn}@despu.edu.in`;
  const passwordHash = await bcrypt.hash(TEMP_PASSWORD, 10);

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(or(eq(schema.users.prn, account.prn), eq(schema.users.email, email)))
    .limit(1);

  const values = {
    email,
    username: account.prn,
    displayName: account.displayName,
    passwordHash,
    prn: account.prn,
    department: account.department ?? null,
    role: account.role,
    isActive: true,
    mustChangePassword: true,
    verified: true,
    updatedAt: new Date(),
  };

  if (existing) {
    await db
      .update(schema.users)
      .set(values)
      .where(eq(schema.users.id, existing.id));
    console.log(`Updated: ${account.prn} (${account.displayName})`);
    return;
  }

  await db.insert(schema.users).values({
    id: uuidv4(),
    ...values,
  });
  console.log(`Created: ${account.prn} (${account.displayName})`);
}

async function main(): Promise<void> {
  for (const account of ACCOUNTS) {
    await upsertAccount(account);
  }

  console.log("\nBulk seed complete.");
  console.log(`Temporary password for all accounts: ${TEMP_PASSWORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed bulk users:", error);
    process.exit(1);
  });