/**
 * One-off admin bootstrap script. Run inside the backend container once,
 * after the database is up:
 *
 *   docker compose exec backend node dist/scripts/seed-admin.js
 *
 * Reads credentials from environment variables so nothing is hard-coded:
 *   ADMIN_EMAIL=admin@jignasayaan.example.com
 *   ADMIN_PASSWORD=<a strong password, 12+ chars>
 *
 * Safe to re-run: it upserts on email, so it can also be used to rotate
 * the admin password.
 */
import "dotenv/config";
import { pool } from "../lib/db";
import { hashPassword } from "../lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables before running this script.");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await pool.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, passwordHash]
  );

  console.log(`Admin user ready: ${email}`);
  await pool.end();
}

main().catch((err) => {
  console.error("Failed to seed admin user:", err);
  process.exit(1);
});
