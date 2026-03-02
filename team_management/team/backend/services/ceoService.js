import { ROLES } from "../constants/roles.js";
import { AppError } from "../utils/AppError.js";
import {
  findUserByIdAndRole,
  updateInternTeamLead
} from "../repositories/userRepository.js";

export const assignTeamLeadService = async (internId, teamLeadId) => {

  const intern = await findUserByIdAndRole(internId, ROLES.INTERN);
  if (!intern.rows.length) {
    throw new AppError("Intern not found", 404);
  }

  const teamLead = await findUserByIdAndRole(teamLeadId, ROLES.TEAM_LEAD);
  if (!teamLead.rows.length) {
    throw new AppError("Team Lead not found", 404);
  }

  await updateInternTeamLead(teamLeadId, internId);

  return { internId, teamLeadId };
};

import {
  getTotalInterns,
  getTotalProjects,
  getProjectStats,
  getTotalSubmissions,
  getApprovedSubmissions,
  getOnTimeSubmissions,
  getDailyTrend,
  getTeamPerformance
} from "../repositories/ceoRepository.js";

export const getCEOAnalyticsDashboardService = async () => {

  const [
    totalInterns,
    totalProjects,
    projectStats,
    totalSubmissions,
    approvedSubmissions,
    onTimeSubmissions,
    dailyTrend,
    teamPerformance
  ] = await Promise.all([
    getTotalInterns(),
    getTotalProjects(),
    getProjectStats(),
    getTotalSubmissions(),
    getApprovedSubmissions(),
    getOnTimeSubmissions(),
    getDailyTrend(),
    getTeamPerformance()
  ]);

  const interns = parseInt(totalInterns.rows[0].count);
  const projects = parseInt(totalProjects.rows[0].count);
  const activeProjects = parseInt(projectStats.rows[0].active);
  const completedProjects = parseInt(projectStats.rows[0].completed);
  const submissions = parseInt(totalSubmissions.rows[0].count);
  const approved = parseInt(approvedSubmissions.rows[0].count);
  const onTime = parseInt(onTimeSubmissions.rows[0].count);

  const completionRate =
    projects === 0 ? 0 : Math.round((completedProjects / projects) * 100);

  const approvalRate =
    submissions === 0 ? 0 : Math.round((approved / submissions) * 100);

  const onTimeRate =
    submissions === 0 ? 0 : Math.round((onTime / submissions) * 100);

  const productivityScore =
    Math.round((approvalRate * 0.5) + (onTimeRate * 0.5));

  return {
    totals: {
      interns,
      projects,
      activeProjects,
      completedProjects,
      submissions,
      approvedSubmissions: approved
    },
    submissionTrends: {
      daily: dailyTrend.rows
    },
    progressTracking: {
      completionPercentage: completionRate,
      approvalRate,
      onTimeRate,
      productivityScore
    },
    teamPerformance: teamPerformance.rows,
    growth: {
      internGrowth: 0,
      projectGrowth: 0,
      completionGrowth: 0
    }
  };
};

