import { pool } from "../config/db.js";

/* =========================
   CREATE SUBMISSION
========================= */
export const createSubmission = async (req, res) => {
  try {
    const { projectId, title, description } = req.body;

    // ✅ Check file exists
    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    // ✅ Store ONLY filename (NOT path, NOT uploads/filename)
    const pdf = req.file.filename;

    const result = await pool.query(
      `
      INSERT INTO submissions
      (intern_id, project_id, title, description, pdf_url, status, submitted_at)
      VALUES ($1,$2,$3,$4,$5,'Pending',NOW())
      RETURNING *
      `,
      [
        req.user.id,
        projectId,
        title,
        description,
        pdf
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ message: "Submission error" });
  }
};