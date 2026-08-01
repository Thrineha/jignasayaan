import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { RequestHandler, ErrorRequestHandler } from "express";

/**
 * Helmet: secure headers on every response. CSP is intentionally strict --
 * tighten `script-src`/`style-src` further with nonces once the frontend's
 * exact asset origins are finalized.
 */
export const secureHeaders: RequestHandler = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Next.js injects critical CSS inline
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: "same-site" },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
});

/**
 * CORS: explicit allow-list from env, never a wildcard. Requests with no
 * Origin header (server-to-server, curl) are allowed through since they
 * aren't subject to browser same-origin protections anyway.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "https://jignasayaan-psi.vercel.app/,https://jignasayaan-psi.vercel.app,*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: 600,
});

/** General read-endpoint limiter. */
export const generalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

/** Tighter limiter for write endpoints (registration submissions). */
export const writeLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again in a minute." },
});

/**
 * Strict limiter for login attempts -- brute-force/credential-stuffing
 * defense. Keyed on IP; pair with account lockout at the application layer
 * for production (not implemented here).
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

/**
 * Centralized error handler. Never leak stack traces or internal error
 * detail to the client -- log full detail server-side only.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error({ path: req.path, method: req.method, err }, "Unhandled error");

  if (res.headersSent) return;

  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message ?? "Request failed",
  });
};
