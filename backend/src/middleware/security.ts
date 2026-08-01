import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { RequestHandler, ErrorRequestHandler } from "express";

/**
 * Helmet: secure headers on every response.
 * CSP is kept compatible with common frontend frameworks.
 */
export const secureHeaders: RequestHandler = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests:
        process.env.NODE_ENV === "production" ? [] : null,
    },
  },

  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },

  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * CORS: allow all origins.
 *
 * NOTE:
 * credentials MUST be false when using "*".
 */
export const corsMiddleware = cors({
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  maxAge: 600,
});

/**
 * General API rate limiter.
 */
export const generalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

/**
 * Write endpoint limiter.
 */
export const writeLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again in a minute.",
  },
});

/**
 * Login brute-force protection.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
});

/**
 * Central error handler.
 */
export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next
) => {
  console.error(
    {
      path: req.path,
      method: req.method,
      err,
    },
    "Unhandled error"
  );

  if (res.headersSent) {
    return;
  }

  const status =
    typeof err?.status === "number"
      ? err.status
      : 500;

  const safeMessages: Record<number, string> = {
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    429: "Too many requests",
  };

  res.status(status).json({
    error:
      safeMessages[status] ??
      "Internal server error",
  });
};