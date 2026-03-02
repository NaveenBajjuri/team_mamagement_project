import { pool } from "../config/db.js";
import { ROLES } from "../constants/roles.js";

/* =========================
   CREATE INTERN
========================= */
export const findUserByEmail = (email) =>
  pool.query("SELECT id FROM users WHERE email=$1", [email]);

export const insertIntern = (name, email, hash) =>
  pool.query(
    `INSERT INTO users (name,email,password,role)
     VALUES ($1,$2,$3,$4)
     RETURNING id,name,email,role`,
    [name, email, hash, ROLES.INTERN]
  );

/* =========================
   ASSIGN INTERN
========================= */
export const findInternById = (id) =>
  pool.query("SELECT id FROM users WHERE id=$1 AND role=$2", [
    id,
    ROLES.INTERN
  ]);

export const findTeamLeadById = (id) =>
  pool.query("SELECT id FROM users WHERE id=$1 AND role=$2", [
    id,
    ROLES.TEAM_LEAD
  ]);

export const updateInternTeamLead = (teamLeadId, internId) =>
  pool.query("UPDATE users SET team_lead_id=$1 WHERE id=$2", [
    teamLeadId,
    internId
  ]);

/* =========================
   TEAM LEADS ANALYTICS (NEW FIX)
   SAME STRUCTURE AS CEO
========================= */
export const getTeamLeadsAnalytics = () =>
  pool.query(
    `
    SELECT 
      tl.id,
      tl.name,
      tl.email,
      COUNT(DISTINCT i.id) AS interns,
      COUNT(DISTINCT p.id) AS projects
    FROM users tl
    LEFT JOIN users i 
      ON i.team_lead_id = tl.id 
      AND i.role=$1
    LEFT JOIN projects p 
      ON p.team_lead_id = tl.id
    WHERE tl.role=$2
    GROUP BY tl.id
    ORDER BY tl.name
  `,
    [ROLES.INTERN, ROLES.TEAM_LEAD]
  );

/* =========================
   HR DASHBOARD TOTALS
========================= */
export const getTotalInterns = () =>
  pool.query("SELECT COUNT(*) FROM users WHERE role=$1", [ROLES.INTERN]);

export const getInternsPerTeamLead = () =>
  pool.query(
    `
    SELECT 
      t.id,
      t.name AS teamLead,
      COUNT(i.id) AS internCount
    FROM users t
    LEFT JOIN users i
      ON i.team_lead_id = t.id AND i.role=$1
    WHERE t.role=$2
    GROUP BY t.id
    ORDER BY t.name
  `,
    [ROLES.INTERN, ROLES.TEAM_LEAD]
  );

export const getProjectStats = () =>
  pool.query(`
    SELECT 
      COUNT(*) FILTER (WHERE status IN ('Pending','Ongoing')) AS active,
      COUNT(*) FILTER (WHERE status='Completed') AS completed
    FROM projects
  `);

export const getDelayedProjects = () =>
  pool.query(`
    SELECT COUNT(*)
    FROM projects
    WHERE deadline < CURRENT_DATE
    AND status IN ('Pending','Ongoing')
  `);

export const getLateSubmissions = () =>
  pool.query(`
    SELECT COUNT(*)
    FROM submissions s
    JOIN projects p ON s.project_id = p.id
    WHERE s.submitted_at > p.deadline
  `);

/* =========================
   SUBMISSION TRACKING
========================= */
export const getSubmissionTracking = () =>
  pool.query(
    `
    SELECT 
      i.id,
      i.name AS intern,
      COUNT(s.id) AS totalSubmissions,
      COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
      COUNT(s.id) FILTER (WHERE s.status='Rejected') AS rejected,
      COUNT(s.id) FILTER (WHERE s.status='Pending') AS pending
    FROM users i
    LEFT JOIN submissions s ON s.intern_id = i.id
    WHERE i.role=$1
    GROUP BY i.id
    ORDER BY i.name
  `,
    [ROLES.INTERN]
  );

export const getLateSubmissionTracking = () =>
  pool.query(
    `
    SELECT 
      i.id,
      i.name AS intern,
      COUNT(s.id) AS totalSubmissions,
      COUNT(s.id) FILTER (WHERE s.submitted_at > p.deadline) AS lateSubmissions
    FROM users i
    LEFT JOIN submissions s ON s.intern_id = i.id
    LEFT JOIN projects p ON s.project_id = p.id
    WHERE i.role=$1
    GROUP BY i.id
    ORDER BY i.name
  `,
    [ROLES.INTERN]
  );

/* =========================
   WEEKLY SUBMISSIONS (MONTH BASED, DYNAMIC)
========================= */
export const getWeeklySubmissions = () =>
  pool.query(`
    WITH weeks AS (
      SELECT 1 AS week UNION
      SELECT 2 UNION
      SELECT 3 UNION
      SELECT 4
    ),
    monthly_data AS (
      SELECT
        CASE
          WHEN EXTRACT(DAY FROM submitted_at) BETWEEN 1 AND 7 THEN 1
          WHEN EXTRACT(DAY FROM submitted_at) BETWEEN 8 AND 14 THEN 2
          WHEN EXTRACT(DAY FROM submitted_at) BETWEEN 15 AND 21 THEN 3
          ELSE 4
        END AS week,
        COUNT(*) AS total
      FROM submissions
      WHERE DATE_TRUNC('month', submitted_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY week
    )
    SELECT
      CONCAT('Week ', w.week) AS week,
      COALESCE(m.total, 0) AS total
    FROM weeks w
    LEFT JOIN monthly_data m ON w.week = m.week
    ORDER BY w.week;
  `);