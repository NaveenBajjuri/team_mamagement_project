// import { pool } from "../config/db.js";
// import { ROLES } from "../constants/roles.js";

// export const findUserByEmail = async (email) => {
//   return pool.query("SELECT id FROM users WHERE email=$1", [email]);
// };

// export const createUser = async (name, email, password, role, teamLeadId) => {
//   return pool.query(
//     `INSERT INTO users (name,email,password,role,team_lead_id)
//      VALUES ($1,$2,$3,$4,$5)`,
//     [name, email, password, role, teamLeadId]
//   );
// };

// export const findUserByIdAndRole = async (id, role) => {
//   return pool.query(
//     "SELECT id FROM users WHERE id=$1 AND role=$2",
//     [id, role]
//   );
// };

// export const updateInternTeamLead = async (teamLeadId, internId) => {
//   return pool.query(
//     "UPDATE users SET team_lead_id=$1 WHERE id=$2",
//     [teamLeadId, internId]
//   );
// };


// export const findUserProfileById = async (id) => {
//   return pool.query(
//     "SELECT id,name,email,role,created_at FROM users WHERE id=$1",
//     [id]
//   );
// };

//  export const deleteUserById = (id) =>
//   pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [id]); 

 
import { pool } from "../config/db.js";
import { ROLES } from "../constants/roles.js";

export const findUserByEmail = async (email) => {
  return pool.query("SELECT id FROM users WHERE email=$1", [email]);
};

export const createUser = async (name, email, password, role, teamLeadId) => {
  return pool.query(
    `INSERT INTO users (name,email,password,role,team_lead_id)
     VALUES ($1,$2,$3,$4,$5)`,
    [name, email, password, role, teamLeadId]
  );
};

export const findUserByIdAndRole = async (id, role) => {
  return pool.query(
    "SELECT id FROM users WHERE id=$1 AND role=$2",
    [id, role]
  );
};

export const updateInternTeamLead = async (teamLeadId, internId) => {
  return pool.query(
    "UPDATE users SET team_lead_id=$1 WHERE id=$2",
    [teamLeadId, internId]
  );
};

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
export const fetchInternsForAssignment = async () => {
  return await pool.query(`
    SELECT 
      i.id,
      i.name,
      i.email,
      i.created_at,
      i.team_lead_id,
      tl.name AS teamlead
    FROM users i
    LEFT JOIN users tl 
      ON i.team_lead_id = tl.id
    WHERE i.role = 'INTERN'
    ORDER BY i.created_at DESC
  `);
};

export const findUserProfileById = async (id) => {
  return pool.query(
    "SELECT id,name,email,role,created_at FROM users WHERE id=$1",
    [id]
  );
};

export const fetchHRInterns = () =>
  pool.query(
    `
    SELECT 
      i.id,
      i.name,
      i.email,
      i.created_at,
      i.team_lead_id,
      tl.name AS teamlead
    FROM users i
    LEFT JOIN users tl
      ON i.team_lead_id = tl.id
      AND tl.role = $2
    WHERE i.role = $1
    ORDER BY i.name
    `,
    [ROLES.INTERN, ROLES.TEAM_LEAD]
  );

  export const fetchInternDetails = (id) =>
  pool.query(`
    SELECT 
      i.id,
      i.name,
      i.email,
      i.created_at,
      i.team_lead_id,
      tl.name AS team_lead_name
    FROM users i
    LEFT JOIN users tl ON i.team_lead_id=tl.id
    WHERE i.id=$1
  `, [id]);

 export const fetchTeamLeads = () =>
  pool.query(
    `SELECT id,name 
     FROM users
     WHERE role=$1
     ORDER BY name`,
    [ROLES.TEAM_LEAD]
  ); 

 export const deleteUserById = (id) =>
  pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [id]); 

 export const fetchInternsByTeamLead = (teamLeadId) =>
  pool.query(
    `
    SELECT 
      i.id,
      i.name,
      i.email,
      i.created_at,
      COUNT(p.id) AS project_count
    FROM users i
    LEFT JOIN projects p 
      ON p.intern_id = i.id
    WHERE i.role = $1
      AND i.team_lead_id = $2
    GROUP BY i.id
    ORDER BY i.name
    `,
    [ROLES.INTERN, teamLeadId]
  );
 
 export const fetchInternTeamLead = (internId) =>
  pool.query(
    `
    SELECT 
      i.team_lead_id,
      tl.name AS name,
      tl.email AS email
    FROM users i
    LEFT JOIN users tl
      ON i.team_lead_id = tl.id
    WHERE i.id = $1
    `,
    [internId]
  );
  export const fetchHRs = () =>
  pool.query(`
    SELECT 
      id,
      name,
      email,
      created_at
    FROM users
    WHERE role = $1
    ORDER BY created_at DESC
  `, [ROLES.HR]);