import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";
import { getHRs, removeHR } from "../controllers/ceoController.js";

import {
  assignTeamLead,
  getAllProjectProgress,
  getCEOAnalyticsDashboard,
  getTeamLeadsAnalytics,
  getInternsForAssignment,
  getProjectFullDetails
} from "../controllers/ceoController.js";

const router = express.Router();

router.use(auth);

/* ✅ Allow BOTH CEO and SUPER_ADMIN */
router.use(authorizeRoles(ROLES.CEO, ROLES.SUPER_ADMIN));

router.put("/assign-teamlead", assignTeamLead);
router.get("/project-progress", getAllProjectProgress);
router.get("/analytics-dashboard", getCEOAnalyticsDashboard);
router.get("/project-details/:id", getProjectFullDetails);
router.get("/team-leads", getTeamLeadsAnalytics);
router.get("/interns", getInternsForAssignment);
router.get("/hrs", getHRs);
router.delete("/remove-hr/:id", removeHR);

export default router;