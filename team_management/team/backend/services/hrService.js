import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import * as repo from "../repositories/hrRepository.js";

/* =========================
   CREATE INTERN
========================= */
export const createInternService = async ({ name, email, password }) => {
  const existing = await repo.findUserByEmail(email);

  if (existing.rows.length) {
    throw new AppError("Email already exists", 400);
  }

  const hash = await bcrypt.hash(password, 10);
  const result = await repo.insertIntern(name, email, hash);

  return result.rows[0];
};

/* =========================
   ASSIGN INTERN
========================= */
export const assignInternService = async ({ internId, teamLeadId }) => {
  const intern = await repo.findInternById(internId);
  if (!intern.rows.length) {
    throw new AppError("Intern not found", 404);
  }

  const teamLead = await repo.findTeamLeadById(teamLeadId);
  if (!teamLead.rows.length) {
    throw new AppError("Team Lead not found", 404);
  }

  await repo.updateInternTeamLead(teamLeadId, internId);

  return { internId, teamLeadId };
};

/* =========================
   TEAM LEADS ANALYTICS
========================= */
export const getTeamLeadsAnalyticsService = async () => {
  const result = await repo.getTeamLeadsAnalytics();
  return result.rows;
};

/* =========================
   HR DASHBOARD
========================= */
export const getHRDashboardService = async () => {
  const [
    totalInterns,
    internsPerTeamLead,
    projectStats,
    delayedProjects,
    lateSubmissions,
    submissionTracking,
    lateSubmissionTracking,
    weeklySubmissions
  ] = await Promise.all([
    repo.getTotalInterns(),
    repo.getInternsPerTeamLead(),
    repo.getProjectStats(),
    repo.getDelayedProjects(),
    repo.getLateSubmissions(),
    repo.getSubmissionTracking(),
    repo.getLateSubmissionTracking(),
    repo.getWeeklySubmissions()
  ]);

  return {
    totals: {
      interns: parseInt(totalInterns.rows[0].count || 0),
      activeProjects: parseInt(projectStats.rows[0].active || 0),
      completedProjects: parseInt(projectStats.rows[0].completed || 0),
      delayedProjects: parseInt(delayedProjects.rows[0].count || 0),
      lateSubmissions: parseInt(lateSubmissions.rows[0].count || 0)
    },
    internsPerTeamLead: internsPerTeamLead.rows,
    submissionTracking: submissionTracking.rows,
    lateSubmissionTracking: lateSubmissionTracking.rows,
    weeklySubmissions: weeklySubmissions.rows
  };
};