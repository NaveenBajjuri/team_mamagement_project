import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  getMyProject,
  submitWork,
  getMySubmissions,
  getProgress
} from "../controllers/internController.js";

const router = express.Router();
router.use(auth);
router.use(authorizeRoles(ROLES.INTERN));

router.get("/my-project", getMyProject);

router.post(
  "/submit",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "additionalDocs", maxCount: 3 }
  ]),
  submitWork
);

router.get("/my-submissions", getMySubmissions);
router.get("/progress", getProgress);

export default router;