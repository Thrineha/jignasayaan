import { Router } from "express";
import { z } from "zod";
import { pool } from "../lib/db";
import { writeLimiter } from "../middleware/security";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/auth";

export const registrationsRouter = Router();

// Every field the client can send is validated here. Anything outside this
// shape is rejected before it ever reaches a query.
const registrationSchema = z.object({
  studentName: z.string().trim().min(2).max(120),
  studentAge: z.number().int().min(10).max(25),
  studentGender: z.string().trim().max(30).optional(),
  guardianName: z.string().trim().min(2).max(120),
  guardianPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Invalid phone number"),
  guardianEmail: z.string().trim().email().max(160),
  schoolNameRaw: z.string().trim().min(2).max(160),
  grade: z.string().trim().max(20).optional(),
  emergencyContact: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Invalid emergency contact number"),
  medicalNotes: z.string().trim().max(1000).optional(),
});

registrationsRouter.post("/registrations", writeLimiter, async (req, res, next) => {
  const parsed = registrationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid registration data",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const r = parsed.data;

  try {
    const result = await pool.query(
      `INSERT INTO registrations
        (student_name, student_age, student_gender, guardian_name, guardian_phone,
         guardian_email, school_name_raw, grade, emergency_contact, medical_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, status, created_at`,
      [
        r.studentName,
        r.studentAge,
        r.studentGender ?? null,
        r.guardianName,
        r.guardianPhone,
        r.guardianEmail,
        r.schoolNameRaw,
        r.grade ?? null,
        r.emergencyContact,
        r.medicalNotes ?? null,
      ]
    );

    // TODO: kick off OTP verification + payment session creation here
    // (Razorpay/Stripe hosted checkout) rather than marking confirmed.

    res.status(201).json({
      id: result.rows[0].id,
      status: result.rows[0].status,
      createdAt: result.rows[0].created_at,
    });
  } catch (err) {
    next(err);
  }
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  status: z.enum(["pending_payment", "confirmed", "cancelled"]).optional(),
});

/**
 * Admin-only. Returns a paginated, filterable list of registrations for the
 * admin dashboard. requireAuth checks the session cookie, requireRole
 * restricts access to the "admin" role.
 */
registrationsRouter.get(
  "/registrations",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }
    const { page, pageSize, status } = parsed.data;
    const offset = (page - 1) * pageSize;

    try {
      const whereClause = status ? "WHERE status = $3" : "";
      const params = status ? [pageSize, offset, status] : [pageSize, offset];

      const [rows, count] = await Promise.all([
        pool.query(
          `SELECT id, student_name, student_age, guardian_name, guardian_phone,
                  guardian_email, school_name_raw, status, created_at
           FROM registrations
           ${whereClause}
           ORDER BY created_at DESC
           LIMIT $1 OFFSET $2`,
          params
        ),
        pool.query(
          `SELECT COUNT(*)::int AS total FROM registrations ${whereClause}`,
          status ? [status] : []
        ),
      ]);

      res.status(200).json({
        registrations: rows.rows,
        page,
        pageSize,
        total: count.rows[0].total,
      });
    } catch (err) {
      next(err);
    }
  }
);
