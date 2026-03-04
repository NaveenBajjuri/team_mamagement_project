import { pool } from "../config/db.js";

export const fetchHRSubmissions = () =>
  pool.query(`
    SELECT
      s.id,
      s.pdf_url,
      s.status,
      s.submitted_at,
      s.description,
      s.feedback,

      -- ✅ Total submissions per intern
      COUNT(*) OVER (PARTITION BY s.intern_id) AS submission_number,

      p.title AS project,
      i.name AS intern_name,
      tl.name AS team_lead_name

    FROM submissions s
    JOIN users i ON s.intern_id = i.id
    LEFT JOIN users tl ON i.team_lead_id = tl.id
    JOIN projects p ON s.project_id = p.id
    ORDER BY s.submitted_at DESC
  `);
/* ALL SUBMISSIONS FOR TEAM LEAD */
export const fetchSubmissionsByTeamLead = (teamLeadId) =>
  pool.query(
    `SELECT 
        s.*,
        p.title AS project_title,
        u.name AS intern_name
     FROM submissions s
     JOIN projects p ON s.project_id = p.id
     JOIN users u ON s.intern_id = u.id
     WHERE p.team_lead_id = $1
     ORDER BY s.submitted_at DESC`,
    [teamLeadId]
  );

/* UPDATE SUBMISSION STATUS */
export const updateSubmissionStatus = (submissionId, status, feedback) =>
  pool.query(
    `UPDATE submissions
     SET status=$1, feedback=$2
     WHERE id=$3
     RETURNING *`,
    [status, feedback, submissionId]
  );
export const fetchInternsByTeamLead = (teamLeadId) =>
  pool.query(
    `SELECT * FROM users
     WHERE role='INTERN' AND team_lead_id=$1`,
    [teamLeadId]
  );

/* GET SUBMISSION WITH PROJECT */
export const findSubmissionWithProject = (submissionId) =>
  pool.query(
    `SELECT s.*, p.team_lead_id
     FROM submissions s
     JOIN projects p ON s.project_id = p.id
     WHERE s.id=$1`,
    [submissionId]
  );

/* UPDATE FEEDBACK ONLY */
export const updateSubmissionFeedback = (submissionId, feedback) =>
  pool.query(
    `UPDATE submissions
     SET feedback=$1
     WHERE id=$2`,
    [feedback, submissionId]
  ); 

/* INTERN PROJECT */
export const fetchProjectByIntern = (internId) =>
  pool.query(
    `SELECT * FROM projects WHERE intern_id=$1`,
    [internId]
  );

/* FETCH PROJECT DEADLINE */
export const fetchProjectDeadline = (projectId) =>
  pool.query(
    `SELECT deadline FROM projects WHERE id=$1`,
    [projectId]
  );

/* NEXT SERIAL NUMBER */
export const getNextSerialNumber = (projectId) =>
  pool.query(
    `SELECT COALESCE(MAX(serial_no),0)+1 AS next_serial
     FROM submissions WHERE project_id=$1`,
    [projectId]
  );

/* CREATE SUBMISSION */
export const insertSubmission = (data) =>
  pool.query(
    `INSERT INTO submissions
     (project_id, intern_id, title, description, pdf_url,
      additional_docs, serial_no, status, is_late)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      data.projectId,
      data.internId,
      data.title,
      data.description,
      data.pdfPath,
      data.additionalDocs,
      data.serialNo,
      data.status,
      data.isLate
    ]
  );

/* INTERN SUBMISSIONS */
export const fetchSubmissionsByIntern = (internId) =>
  pool.query(
    `SELECT * FROM submissions 
     WHERE intern_id=$1 
     ORDER BY serial_no ASC`,
    [internId]
  );

/* PROGRESS QUERIES */
export const countInternSubmissions = (internId) =>
  pool.query(
    `SELECT COUNT(*) FROM submissions WHERE intern_id=$1`,
    [internId]
  );

export const countApprovedSubmissions = (internId) =>
  pool.query(
    `SELECT COUNT(*) 
     FROM submissions 
     WHERE intern_id=$1 AND status='Approved'`,
    [internId]
  );

export const countOngoingProjects = (internId) =>
  pool.query(
    `SELECT COUNT(*)
     FROM projects
     WHERE intern_id=$1 AND status='Ongoing'`,
    [internId]
  );

export const fetchSubmissionConsistency = (internId) =>
  pool.query(
    `SELECT TO_CHAR(submitted_at,'IYYY-IW') AS week,
            COUNT(*) AS submissions
     FROM submissions
     WHERE intern_id=$1
     GROUP BY week
     ORDER BY week`,
    [internId]
  );

export const fetchTimeline = (internId) =>
  pool.query(
    `SELECT id,title,status,submitted_at
     FROM submissions
     WHERE intern_id=$1
     ORDER BY submitted_at ASC`,
    [internId]
  );  