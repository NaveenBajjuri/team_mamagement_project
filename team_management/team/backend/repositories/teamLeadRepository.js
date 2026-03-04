/*import { pool } from "../config/db.js";
import { ROLES } from "../constants/roles.js";

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
    SELECT team_lead_id, name 
    FROM users 
    WHERE id=$1
    `,
    [internId]
  );
*/