// import { pool } from "../config/db.js";
// import { ROLES } from "../constants/roles.js";

// /* =========================
//    INTERNS BY TEAM LEAD
// ========================= */
// export const fetchInternsByTeamLead = (teamLeadId) =>
//   pool.query(
//     `SELECT id,name,email
//      FROM users
//      WHERE role=$1 AND team_lead_id=$2`,
//     [ROLES.INTERN, teamLeadId]
//   );

// /* =========================
//    GET INTERN TEAM LEAD
// ========================= */
// export const fetchInternTeamLead = (internId) =>
//   pool.query(
//     `SELECT team_lead_id,name 
//      FROM users 
//      WHERE id=$1`,
//     [internId]
//   );