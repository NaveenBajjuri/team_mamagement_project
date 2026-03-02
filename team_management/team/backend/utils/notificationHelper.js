import { pool } from "../config/db.js";

export const createNotification = async (
  userId,
  message,
  type = "INFO"
) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, message, type, is_read, created_at)
       VALUES ($1, $2, $3, FALSE, NOW())`,
      [userId, message, type]
    );
  } catch (err) {
    console.error("Notification error:", err);
  }
};