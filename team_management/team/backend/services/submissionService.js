import { pool } from "../config/db.js";
import { createNotification } from "../utils/notificationHelper.js";
import { fetchHRSubmissions } from "../repositories/submissionRepository.js";

/* ===============================
   HR SUBMISSIONS
================================ */
export const getHRSubmissionsService = async () => {
  const result = await fetchHRSubmissions();
  return result.rows;
};

/* ===============================
   CREATE SUBMISSION
   ✅ FIXED TO STORE pdf_url
================================ */
export const createSubmissionService = async (
  projectId,
  internId,
  internName,
  projectTitle,
  teamLeadId,
  file   // ✅ NEW PARAM
) => {

  if (!file) {
    throw new Error("File upload required");
  }

  const result = await pool.query(
    `INSERT INTO submissions
     (project_id, intern_id, pdf_url, status, submitted_at)
     VALUES ($1,$2,$3,'Pending',NOW())
     RETURNING *`,
    [
      projectId,
      internId,
      file.filename   // ✅ ONLY filename
    ]
  );

  /* 🔔 Notify Team Lead */
  if (teamLeadId) {
    await createNotification(
      teamLeadId,
      `New submission from ${internName} for ${projectTitle}`,
      "SUBMISSION"
    );
  }

  /* 🔔 Notify HR */
  const hr = await pool.query(
    `SELECT id FROM users WHERE role='HR'`
  );

  for (const h of hr.rows) {
    await createNotification(
      h.id,
      `New submission by ${internName}`,
      "SUBMISSION"
    );
  }

  return result.rows[0];
};

/* ===============================
   REVIEW SUBMISSION
================================ */
export const reviewSubmissionService = async (
  submissionId,
  status,
  feedback,
  internId,
  internName
) => {

  const result = await pool.query(
    `UPDATE submissions
     SET status=$1, feedback=$2
     WHERE id=$3
     RETURNING *`,
    [status, feedback, submissionId]
  );

  if (!result.rows.length) {
    throw new Error("Submission not found");
  }

  /* 🔔 Notify Intern */
  await createNotification(
    internId,
    `Your submission has been ${status}`,
    "FEEDBACK"
  );

  /* 🔔 If Rejected → notify HR */
  if (status === "Rejected") {

    const hr = await pool.query(
      `SELECT id FROM users WHERE role='HR'`
    );

    for (const h of hr.rows) {
      await createNotification(
        h.id,
        `Submission rejected for ${internName}`,
        "ALERT"
      );
    }
  }

  return result.rows[0];
};