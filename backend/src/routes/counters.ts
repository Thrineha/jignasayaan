import { Router } from "express";
import { pool } from "../lib/db";

export const countersRouter = Router();

countersRouter.get("/counters", async (_req, res, next) => {
  try {
    const result = await pool.query("SELECT key, value FROM live_counters");
    const counters = Object.fromEntries(result.rows.map((row) => [row.key, row.value]));
    res.status(200).json(counters);
  } catch (err) {
    next(err);
  }
});
