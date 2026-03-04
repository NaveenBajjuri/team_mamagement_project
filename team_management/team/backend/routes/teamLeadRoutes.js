import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";



import {
  createNewProject,
  getMyInterns,
  getMyProjects,
  getProjectSubmissions,
  reviewSubmission,
  completeProject,
  editProject,
  deleteProject,
  getTeamLeadDashboardFull,
  giveFeedback
} from "../controllers/teamLeadController.js";

const router = express.Router();
router.use(auth);
router.use(authorizeRoles(ROLES.TEAM_LEAD));

/* PROJECT */
router.post("/create-project", createNewProject);
router.get("/my-interns", getMyInterns);
router.get("/my-projects", getMyProjects);

/* SUBMISSIONS */
router.get("/review-submissions", getProjectSubmissions);
router.post("/review", reviewSubmission);

/* PROJECT ACTIONS */
router.put("/complete/:projectId", completeProject);
router.put("/edit/:projectId", editProject);
router.delete("/delete/:projectId", deleteProject);

/* ⭐ FINAL DASHBOARD ROUTE */
router.get("/analytics-dashboard", getTeamLeadDashboardFull);
router.put("/feedback/:submissionId", giveFeedback);

export default router;