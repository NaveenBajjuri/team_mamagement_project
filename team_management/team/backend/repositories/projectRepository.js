import { pool } from "../config/db.js";

export const fetchAllProjectProgress = () =>
  pool.query(`
    SELECT 
      p.id,
      p.title,
      p.status,
      u.name AS intern,
      t.name AS teamLead,
      p.deadline
    FROM projects p
    JOIN users u ON p.intern_id = u.id
    JOIN users t ON p.team_lead_id = t.id
    ORDER BY p.created_at DESC
  `);

export const fetchProjectById = (id) =>
  pool.query(`
    SELECT 
      p.*,
      u.name AS intern,
      t.name AS teamlead
    FROM projects p
    JOIN users u ON p.intern_id=u.id
    JOIN users t ON p.team_lead_id=t.id
    WHERE p.id=$1
  `,[id]);

export const fetchProjectSubmissions = (projectId) =>
  pool.query(`
    SELECT * FROM submissions
    WHERE project_id=$1
    ORDER BY submitted_at DESC
  `,[projectId]);

export const fetchInternStats = (id) =>
  pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE p.status='Ongoing') AS ongoing_projects,
      COUNT(*) FILTER (WHERE p.status='Completed') AS completed_projects,
      COUNT(s.id) AS total_submissions,
      COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
      COUNT(s.id) FILTER (WHERE s.status='Pending') AS pending
    FROM users u
    LEFT JOIN projects p ON p.intern_id=u.id
    LEFT JOIN submissions s ON s.intern_id=u.id
    WHERE u.id=$1
    GROUP BY u.id
  `, [id]);  

  export const createProject = (data) =>
  pool.query(
    `INSERT INTO projects
     (title, description, deadline, intern_id, team_lead_id, status)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      data.title,
      data.description,
      data.deadline,
      data.internId,
      data.teamLeadId,
      data.status
    ]
  );

  /* GET PROJECT BY ID */
export const findProjectById = (projectId, teamLeadId) =>
  pool.query(
    `SELECT * FROM projects WHERE id=$1 AND team_lead_id=$2`,
    [projectId, teamLeadId]
  );

/* UPDATE PROJECT STATUS */
export const updateProjectStatus = (projectId, status, client) =>
  client.query(
    `UPDATE projects SET status=$1 WHERE id=$2`,
    [status, projectId]
  );

/* EDIT PROJECT */
export const updateProject = (data) =>
  pool.query(
    `UPDATE projects
     SET title=$1,description=$2,deadline=$3
     WHERE id=$4 AND team_lead_id=$5 RETURNING *`,
    [
      data.title,
      data.description,
      data.deadline,
      data.projectId,
      data.teamLeadId
    ]
  );

/* DELETE PROJECT */
export const deleteProjectById = (projectId, teamLeadId) =>
  pool.query(
    `DELETE FROM projects WHERE id=$1 AND team_lead_id=$2`,
    [projectId, teamLeadId]
  );

 export const fetchProjectsByTeamLead = (teamLeadId) =>
  pool.query(
    `SELECT * FROM projects WHERE team_lead_id=$1`,
    [teamLeadId]
  ); 