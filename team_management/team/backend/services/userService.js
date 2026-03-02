import bcrypt from "bcryptjs";
import { ROLES } from "../constants/roles.js";
import { AppError } from "../utils/AppError.js";
import { findUserProfileById } from "../repositories/userRepository.js";
import { fetchInternStats } from "../repositories/projectRepository.js";
import { deleteUserById } from "../repositories/userRepository.js";
import {
  fetchTeamLeadsAnalytics,
  fetchInternsForAssignment
} from "../repositories/userRepository.js";
import {
  findUserByEmail,
  createUser
} from "../repositories/userRepository.js";
import {
  fetchHRInterns,
  fetchInternDetails,
  fetchTeamLeads
} from "../repositories/userRepository.js";
import { fetchHRs } from "../repositories/userRepository.js";


/* =========================
   CREATE EMPLOYEE
========================= */
export const createEmployeeService = async ({
  name,
  email,
  password,
  role,
  team_lead_id
}) => {

  if (role === ROLES.SUPER_ADMIN) {
    throw new AppError("Cannot create SUPER_ADMIN via API", 400);
  }

  if (!Object.values(ROLES).includes(role)) {
    throw new AppError("Invalid role provided", 400);
  }

  const existing = await findUserByEmail(email);
  if (existing.rows.length) {
    throw new AppError("Email already exists", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  await createUser(
    name,
    email,
    hashed,
    role,
    role === ROLES.INTERN ? team_lead_id : null
  );

  return true;
};


/* =========================
   USER PROFILE
========================= */
export const getUserProfileService = async (id) => {
  const result = await findUserProfileById(id);

  if (!result.rows.length) {
    throw new AppError("User not found", 404);
  }

  return result.rows[0];
};


/* =========================
   HR INTERNS
========================= */
export const getHRInternsService = async () => {
  const result = await fetchHRInterns();
  return result.rows;
};


/* =========================
   INTERN DETAILS
========================= */
export const getInternDetailsService = async (id) => {
  const intern = await fetchInternDetails(id);

  if (!intern.rows.length) {
    throw new AppError("Intern not found", 404);
  }

  const stats = await fetchInternStats(id);

  return {
    ...intern.rows[0],
    stats: stats.rows[0] || {}
  };
};


/* =========================
   TEAM LEADS LIST
========================= */
export const getTeamLeadsService = async () => {
  const result = await fetchTeamLeads();
  return result.rows;
};


/* =========================
   REMOVE INTERN
========================= */
export const removeInternService = async (id) => {
  const result = await deleteUserById(id);

  if (!result.rows.length) {
    throw new AppError("Intern not found", 404);
  }

  return { id };
};


/* =========================
   TEAM LEADS ANALYTICS
========================= */
export const getTeamLeadsAnalyticsService = async () => {
  const result = await fetchTeamLeadsAnalytics();
  return result.rows;
};


/* =========================
   INTERN LIST FOR ASSIGNMENT (NO CHANGE HERE)
========================= */
export const getInternsForAssignmentService = async () => {
  const result = await fetchInternsForAssignment();
  return result.rows;
};
/* =========================
   HR LIST
========================= */
export const getHRsService = async () => {
  const result = await fetchHRs();
  return result.rows;
};

/* =========================
   REMOVE HR
========================= */
export const removeHRService = async (id) => {
  const result = await deleteUserById(id);

  if (!result.rows.length) {
    throw new AppError("HR not found", 404);
  }

  return { id };
};