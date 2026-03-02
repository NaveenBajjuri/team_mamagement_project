
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";
import { createEmployee } from "../controllers/userController.js";
import { pool } from "../config/db.js";
import { getCurrentUser } from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema } from "../validation/userValidation.js";

const router = express.Router();

/* =========================
   CREATE EMPLOYEE
========================= */
router.post(
  "/",
  auth,
  authorizeRoles(ROLES.CEO, ROLES.HR, ROLES.SUPER_ADMIN),
  validate(createUserSchema),
  createEmployee
);

/* =========================
   GET CURRENT USER PROFILE
========================= */
router.get("/me", auth, getCurrentUser);

export default router;