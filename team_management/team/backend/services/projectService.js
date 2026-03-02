import { AppError } from "../utils/AppError.js";
import { pool } from "../config/db.js";
import { createNotification } from "../utils/notificationHelper.js";
import {
  fetchAllProjectProgress,
  fetchProjectById,
  fetchProjectSubmissions
} from "../repositories/projectRepository.js";

/* ===============================
   GET ALL PROJECT PROGRESS
================================ */
export const getAllProjectProgressService = async () => {
  const result = await fetchAllProjectProgress();
  return result.rows;
};

/* ===============================
   GET FULL PROJECT DETAILS
================================ */
export const getProjectFullDetailsService = async (id) => {
  const project = await fetchProjectById(id);

  if (!project.rows.length) {
    throw new AppError("Project not found", 404);
  }

  const submissions = await fetchProjectSubmissions(id);

  return {
    project: project.rows[0],
    submissions: submissions.rows
  };
};

/* ===============================
   MARK PROJECT COMPLETED
================================ */
export const markProjectCompletedService = async (projectId) => {

  const result = await pool.query(
    `UPDATE projects 
     SET status='Completed'
     WHERE id=$1
     RETURNING *`,
    [projectId]
  );

  if (!result.rows.length) {
    throw new AppError("Project not found", 404);
  }

  const project = result.rows[0];

  /* 🔔 Notify CEO */
  const ceo = await pool.query(
    `SELECT id FROM users WHERE role='CEO' LIMIT 1`
  );

  if (ceo.rows.length) {
    await createNotification(
      ceo.rows[0].id,
      `Project completed: ${project.title}`,
      "PROJECT_COMPLETED"
    );
  }

  return project;
};