import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";
import {
createIntern,
assignIntern,
getHRAnalyticsDashboard,
getHRInterns,
getInternDetails,
removeIntern,
getTeamLeads,
getHRSubmissions

} from "../controllers/hrController.js";

const router = express.Router();
router.use(auth);
router.use(authorizeRoles(ROLES.HR));
router.post("/create-intern", createIntern);

router.put("/assign-intern", assignIntern);
router.get("/analytics-dashboard", getHRAnalyticsDashboard);
router.get("/interns", getHRInterns);
router.get("/intern-details/:id", getInternDetails);
router.delete("/remove-intern/:id", removeIntern);
router.get("/teamleads", getTeamLeads);
router.get("/submissions", getHRSubmissions);

export default router;