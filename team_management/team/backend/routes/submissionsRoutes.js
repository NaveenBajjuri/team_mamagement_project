import express from "express";
import { pool } from "../config/db.js";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";
import { upload } from "../middleware/multer.js"; // ✅ CORRECT PATH
import { createSubmission } from "../controllers/submissionController.js";

const router = express.Router();

/* =========================
   PROTECT ALL ROUTES
========================= */
router.use(auth);

/* =========================
   CREATE SUBMISSION (INTERN ONLY)
========================= */
router.post(
  "/",
  authorizeRoles(ROLES.INTERN),
  upload.single("file"), // field name must match frontend FormData key
  createSubmission
);

/* =========================
   GET ALL SUBMISSIONS (CEO ONLY)
========================= */
router.get(
  "/all",
  authorizeRoles(ROLES.CEO),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM submissions ORDER BY submitted_at DESC"
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching all submissions:", err);
      res.status(500).json({ message: "Error fetching submissions" });
    }
  }
);

/* =========================
   GET SUBMISSIONS BY PROJECT
========================= */
router.get(
  "/project/:id",
  authorizeRoles(ROLES.CEO, ROLES.TEAM_LEAD),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "SELECT * FROM submissions WHERE project_id = $1 ORDER BY submitted_at DESC",
        [id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching project submissions:", err);
      res.status(500).json({ message: "Error fetching submissions" });
    }
  }
);

/* =========================
   GET SUBMISSIONS BY INTERN
========================= */
router.get(
  "/intern/:id",
  authorizeRoles(ROLES.CEO, ROLES.TEAM_LEAD, ROLES.INTERN),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "SELECT * FROM submissions WHERE intern_id = $1 ORDER BY submitted_at DESC",
        [id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching intern submissions:", err);
      res.status(500).json({ message: "Error fetching submissions" });
    }
  }
);

export default router;