import express from "express";
import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validation/authValidation.js";
import {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", validate(loginSchema), login);

/* ================= REFRESH ================= */
router.post("/refresh", refreshToken);

/* ================= LOGOUT ================= */
router.post("/logout", auth, logout);

/* ================= FORGOT PASSWORD ================= */
/* ⭐ MUST MATCH FRONTEND */
router.post("/forgot-password",validate(forgotPasswordSchema), forgotPassword);

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

/* ================= PROFILE UPDATE ================= */
router.put("/profile", auth, updateProfile);

export default router;