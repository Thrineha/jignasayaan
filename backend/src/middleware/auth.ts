import type { RequestHandler } from "express";
import { AUTH_COOKIE_NAME, verifyToken, type Role, type TokenPayload } from "../lib/auth";

// Augment Express's Request type with the authenticated user, set by requireAuth.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Reads the session cookie (httpOnly, so it's invisible to client-side JS --
 * the primary defense against XSS-based token theft), verifies it, and
 * attaches the decoded user to the request. Rejects with 401 if missing/invalid.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  req.user = payload;
  next();
};

/** Restricts a route to one or more roles. Use after requireAuth. */
export function requireRole(...roles: Role[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
