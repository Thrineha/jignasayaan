import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import {
  secureHeaders,
  corsMiddleware,
  generalLimiter,
  errorHandler,
} from "./middleware/security";
import { healthRouter } from "./routes/health";
import { registrationsRouter } from "./routes/registrations";
import { countersRouter } from "./routes/counters";
import { authRouter } from "./routes/auth";

const app = express();

// Trust the nginx reverse proxy for correct client IPs (needed for rate limiting).
app.set("trust proxy", 1);

app.use(secureHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(pinoHttp({ redact: ["req.headers.authorization", "req.headers.cookie"] }));
app.use(generalLimiter);

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", registrationsRouter); // includes the admin-only GET list, gated internally
app.use("/api", countersRouter);

// TODO: mount these once School/Volunteer routers exist:
// app.use("/api/schools", requireAuth, requireRole("school"), schoolRouter);
// app.use("/api/volunteers", requireAuth, requireRole("volunteer"), volunteerRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

const port = Number(process.env.API_PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Jignasayaan API listening on port ${port}`);
});
