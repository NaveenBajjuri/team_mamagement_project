
import express from "express";
import { pool } from "../config/db.js";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();
router.use(auth);
/* =========================
   GET ALL PROJECTS (CEO ONLY)
========================= */
router.get("/all", authorizeRoles(ROLES.CEO), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

/* =========================
   GET PROJECTS BY TEAM LEAD
========================= */
router.get("/teamlead/:id", authorizeRoles(ROLES.TEAM_LEAD, ROLES.CEO), async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM projects WHERE team_lead_id = $1",
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

/* =========================
   GET PROJECTS BY INTERN
========================= */
router.get("/intern/:id", authorizeRoles(ROLES.INTERN, ROLES.TEAM_LEAD, ROLES.CEO), async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM projects WHERE intern_id = $1",
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

export default router;
