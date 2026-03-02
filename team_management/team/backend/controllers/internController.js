import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getMyProjectService,
  submitWorkService,
  getMySubmissionsService,
  getProgressService
} from "../services/internService.js";

/* GET ASSIGNED PROJECT */
export const getMyProject = asyncHandler(async (req, res) => {
  const data = await getMyProjectService(req.user.id);
  res.json(data);
});

/* SUBMIT WORK */
export const submitWork = asyncHandler(async (req, res) => {
  const result = await submitWorkService(req, req.user.id);
  res.status(201).json(result);
});

/* VIEW SUBMISSIONS */
export const getMySubmissions = asyncHandler(async (req, res) => {
  const data = await getMySubmissionsService(req.user.id);
  res.json(data);
});

/* PROGRESS */
export const getProgress = asyncHandler(async (req, res) => {
  const data = await getProgressService(req.user.id);
  res.json(data);
});