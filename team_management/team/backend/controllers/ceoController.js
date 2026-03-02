
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { ROLES } from "../constants/roles.js";
import { assignTeamLeadService } from "../services/ceoService.js";
import { getCEOAnalyticsDashboardService } from "../services/ceoService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getAllProjectProgressService,
  getProjectFullDetailsService
} from "../services/projectService.js";
import {
  getTeamLeadsAnalyticsService,
  getInternsForAssignmentService
} from "../services/userService.js";

export const assignTeamLead =  asyncHandler(async (req, res) => {
    const { internId, teamLeadId } = req.body;

    if (!internId || !teamLeadId) {
      return res.status(400).json({ message: "internId and teamLeadId required" });
    }

    const result = await assignTeamLeadService(internId, teamLeadId);

    res.json({
      message: "Team Lead assigned successfully",
      ...result
    });
  });

/* =========================
   VIEW ALL PROJECT PROGRESS
========================= */
export const getAllProjectProgress =  asyncHandler(async (req, res) => {
    const result = await getAllProjectProgressService();
    res.json(result);
});


export const getCEOAnalyticsDashboard = asyncHandler(async (req, res) => {
  const data = await getCEOAnalyticsDashboardService();
  res.json(data);
});

/* =========================
   TEAM LEADS ANALYTICS
========================= */
export const getTeamLeadsAnalytics = asyncHandler(async (req, res) => {
    const data = await getTeamLeadsAnalyticsService();
    res.json(data);
});


/* =========================
   INTERN LIST FOR ASSIGN
========================= */
export const getInternsForAssignment =  asyncHandler(async (req, res) => {
    const data = await getInternsForAssignmentService();
    res.json(data);
});

/* =========================
   PROJECT FULL DETAILS
========================= */
export const getProjectFullDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await getProjectFullDetailsService(id);
    res.json(data);
  });
import { getHRsService, removeHRService } from "../services/userService.js";

/* =========================
   GET HRS
========================= */
export const getHRs = asyncHandler(async (req, res) => {
  const data = await getHRsService();
  res.json(data);
});

/* =========================
   REMOVE HR
========================= */
export const removeHR = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await removeHRService(id);
  res.json({ message: "HR removed successfully", ...data });
});