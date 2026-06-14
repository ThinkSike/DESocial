const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: "postgres://desocial:desocial@localhost:5434/desocial",
});

const sql = fs.readFileSync(
  path.join(__dirname, "drizzle/0002_marvelous_chat.sql"),
  "utf8"
);

// Split on drizzle's statement-breakpoint marker and run each statement
const statements = sql
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean);

(async () => {
  for (const stmt of statements) {
    try {
      await pool.query(stmt);
      console.log("OK:", stmt.slice(0, 60).replace(/\n/g, " "));
    } catch (e) {
      // Skip "already exists" errors gracefully
      if (e.code === "42701" || e.code === "42P07" || e.code === "42710") {
        console.log("SKIP (already exists):", stmt.slice(0, 60).replace(/\n/g, " "));
      } else {
        console.error("FAIL code=" + e.code + " msg=" + (e.message || JSON.stringify(e)), "\n  SQL:", stmt.slice(0, 120));
      }
    }
  }
  await pool.end();
  console.log("Migration complete.");
})();
