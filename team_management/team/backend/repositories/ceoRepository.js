import { pool } from "../config/db.js";
import { ROLES } from "../constants/roles.js";

export const getTotalInterns = () =>
  pool.query("SELECT COUNT(*) FROM users WHERE role=$1", [ROLES.INTERN]);

export const getTotalProjects = () =>
  pool.query("SELECT COUNT(*) FROM projects");

export const getProjectStats = () =>
  pool.query(`
    SELECT 
      COUNT(*) FILTER (WHERE status='Ongoing') AS active,
      COUNT(*) FILTER (WHERE status='Completed') AS completed
    FROM projects
  `);

export const getTotalSubmissions = () =>
  pool.query("SELECT COUNT(*) FROM submissions");

export const getApprovedSubmissions = () =>
  pool.query("SELECT COUNT(*) FROM submissions WHERE status='Approved'");

export const getOnTimeSubmissions = () =>
  pool.query(`
    SELECT COUNT(*)
    FROM submissions s
    JOIN projects p ON s.project_id=p.id
    WHERE s.submitted_at <= p.deadline
  `);

export const getDailyTrend = () =>
  pool.query(`
    SELECT DATE(submitted_at) AS day, COUNT(*) AS total
    FROM submissions
    GROUP BY day
    ORDER BY day DESC
    LIMIT 7
  `);

export const getTeamPerformance = () =>
  pool.query(`
    SELECT 
      tl.id,
      tl.name AS teamLead,
      COUNT(DISTINCT i.id) AS interns,
      COUNT(DISTINCT p.id) AS projects,
      COUNT(s.id) FILTER (WHERE s.status='Approved') AS approvedSubmissions,
      COUNT(s.id) AS totalSubmissions
    FROM users tl
    LEFT JOIN users i 
      ON i.team_lead_id = tl.id AND i.role=$1
    LEFT JOIN projects p 
      ON p.team_lead_id = tl.id
    LEFT JOIN submissions s 
      ON s.project_id = p.id AND s.intern_id = i.id
    WHERE tl.role=$2
    GROUP BY tl.id
    ORDER BY tl.name
  `, [ROLES.INTERN, ROLES.TEAM_LEAD]);

  export const fetchTeamLeadsAnalytics = () =>
  pool.query(`
    SELECT 
      tl.id,
      tl.name,
      tl.email,
      COUNT(DISTINCT i.id) AS interns,
      COUNT(DISTINCT p.id) AS projects,
      CASE
        WHEN COUNT(DISTINCT s.id)=0 THEN 0
        ELSE ROUND(
          (COUNT(DISTINCT s.id) FILTER (WHERE s.status='Approved')::decimal
          / COUNT(DISTINCT s.id)) * 100
        )
      END AS completionRate
    FROM users tl
    LEFT JOIN users i 
      ON i.team_lead_id = tl.id 
      AND i.role=$1
    LEFT JOIN projects p 
      ON p.team_lead_id = tl.id
    LEFT JOIN submissions s 
      ON s.project_id = p.id
    WHERE tl.role=$2
    GROUP BY tl.id
    ORDER BY tl.name
  `, [ROLES.INTERN, ROLES.TEAM_LEAD]);

/* INTERN LIST */
// export const fetchInternsForAssignment = () =>
//   pool.query(
//     "SELECT id,name,email,team_lead_id FROM users WHERE role=$1 ORDER BY name",
//     [ROLES.INTERN]
//   );


