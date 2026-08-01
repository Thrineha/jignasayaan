import { Pool } from "pg";

// Single shared connection pool. DATABASE_URL is the only source of
// credentials -- never hard-code connection details here.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Fail fast and loud at boot rather than limping along without a DB.
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: true } : undefined,
});

pool.on("error", (err) => {
  // Idle client errors must not crash the process silently.
  // eslint-disable-next-line no-console
  console.error("Unexpected Postgres pool error", err);
});
