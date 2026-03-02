import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getHRDashboardService,
  createInternService,
  assignInternService,
  getTeamLeadsAnalyticsService
} from "../services/hrService.js";

import { getHRInternsService } from "../services/userService.js";
import { getHRSubmissionsService } from "../services/submissionService.js";
import { getInternDetailsService } from "../services/userService.js";
import { removeInternService } from "../services/userService.js";

/* CREATE INTERN */
export const createIntern = asyncHandler(async (req, res) => {
  const intern = await createInternService(req.body);

  res.status(201).json({
    message: "Intern created successfully",
    intern
  });
});

/* ASSIGN INTERN */
export const assignIntern = asyncHandler(async (req, res) => {
  const result = await assignInternService(req.body);

  res.json({
    message: "Intern assigned successfully",
    ...result
  });
});

/* DASHBOARD */
export const getHRAnalyticsDashboard = asyncHandler(async (req, res) => {
  const data = await getHRDashboardService();
  res.json(data);
});

/* HR INTERNS */
export const getHRInterns = asyncHandler(async (req, res) => {
  const interns = await getHRInternsService();
  res.json(interns);
});

/* SUBMISSIONS */
export const getHRSubmissions = asyncHandler(async (req, res) => {
  const submissions = await getHRSubmissionsService();
  res.json(submissions);
});

/* INTERN DETAILS */
export const getInternDetails = asyncHandler(async (req, res) => {
  const data = await getInternDetailsService(req.params.id);
  res.json(data);
});

/* ✅ FIXED TEAM LEADS (USES ANALYTICS) */
export const getTeamLeads = asyncHandler(async (req, res) => {
  const teamLeads = await getTeamLeadsAnalyticsService();
  res.json(teamLeads);
});

/* REMOVE INTERN */
export const removeIntern = asyncHandler(async (req, res) => {
  await removeInternService(req.params.id);
  res.json({ message: "Intern removed" });
});