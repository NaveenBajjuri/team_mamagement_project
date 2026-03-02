import cron from "node-cron";
import { pool } from "../config/db.js";
import { createNotification } from "./notificationHelper.js";

cron.schedule(
  "0 9 * * *",
  async () => {
    try {

      const result = await pool.query(`
        SELECT p.id, p.title, p.intern_id, p.team_lead_id
        FROM projects p
        WHERE p.deadline::date = CURRENT_DATE + INTERVAL '1 day'
        AND p.status = 'Ongoing'
      `);

      for (const project of result.rows) {

        /* 🔔 Notify Intern */
        await createNotification(
          project.intern_id,
          `Reminder: Your project "${project.title}" is due tomorrow.`,
          "DEADLINE_REMINDER"
        );

        /* 🔔 Notify Team Lead */
        if (project.team_lead_id) {
          await createNotification(
            project.team_lead_id,
            `Project "${project.title}" is due tomorrow.`,
            "DEADLINE_REMINDER"
          );
        }

        /* 🔔 Notify HR */
        const hr = await pool.query(
          `SELECT id FROM users WHERE role='HR'`
        );

        for (const h of hr.rows) {
          await createNotification(
            h.id,
            `Project "${project.title}" deadline tomorrow.`,
            "DEADLINE_REMINDER"
          );
        }
      }

    } catch (error) {
      console.error("Deadline Reminder Error:", error);
    }
  },
  { timezone: "Asia/Kolkata" }
);