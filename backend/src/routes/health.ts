import { Router } from "express";
import { pool } from "../lib/db";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "degraded", reason: "database unreachable" });
  }
});
