import { Router } from "express";
import { z } from "zod";
import { pool } from "../lib/db";
import { AUTH_COOKIE_NAME, signToken, verifyPassword } from "../lib/auth";
import { loginLimiter } from "../middleware/security";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(200),
});

const isProduction = process.env.NODE_ENV === "production";

authRouter.post("/auth/login", loginLimiter, async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    // Same generic message as a bad credential -- don't reveal which field failed.
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { email, password } = parsed.data;

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    // Constant-shape response whether the user exists or not, so login
    // can't be used to enumerate registered emails.
    const isValid = user ? await verifyPassword(password, user.password_hash) : false;

    if (!user || !isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken({ sub: user.id, role: user.role, email: user.email });

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({ email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/auth/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
  res.status(200).json({ ok: true });
});

authRouter.get("/auth/me", requireAuth, (req, res) => {
  res.status(200).json({ email: req.user!.email, role: req.user!.role });
});
