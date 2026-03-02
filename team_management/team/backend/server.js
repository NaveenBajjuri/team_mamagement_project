import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

dotenv.config();

import "./utils/deadlineReminder.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projectsRoutes.js";
import submissionRoutes from "./routes/submissionsRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import teamLeadRoutes from "./routes/teamLeadRoutes.js";
import ceoRoutes from "./routes/ceoRoutes.js";
import internRoutes from "./routes/internRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import createSuperAdmin from "./utils/createSuperAdmin.js";
import initializeDatabase from "./config/dbInit.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   STATIC FILES (🔥 PUBLIC - MUST BE FIRST)
======================= */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* =======================
   CONFIGS
======================= */
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

/* =======================
   GLOBAL MIDDLEWARES
======================= */
app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false
  })
);

app.use(limiter);
app.use(express.json());

createSuperAdmin();

/* =======================
   API BASE ROUTER
======================= */
const apiRouter = express.Router();

apiRouter.use("/users", userRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/submissions", submissionRoutes);
apiRouter.use("/hr", hrRoutes);
apiRouter.use("/ceo", ceoRoutes);
apiRouter.use("/teamlead", teamLeadRoutes);
apiRouter.use("/intern", internRoutes);
apiRouter.use("/notifications", notificationRoutes);

/* Mount once */
app.use("/api", apiRouter);

app.use(globalErrorHandler);

/* =======================
   SERVER START
======================= */

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log("🚀 Backend running on port ${PORT}");
  });
};

startServer();