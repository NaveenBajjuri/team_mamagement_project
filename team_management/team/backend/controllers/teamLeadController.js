import { asyncHandler } from "../middleware/asyncHandler.js";
import { getMyInternsService } from "../services/teamLeadService.js";
import { getMyProjectsService } from "../services/teamLeadService.js";

import {
  createProjectService,
  completeProjectService,
  editProjectService,
  deleteProjectService,
  getProjectSubmissionsService,
  reviewSubmissionService,
  giveFeedbackService,
  getTeamLeadDashboardService
} from "../services/teamLeadService.js";

/* CREATE */
export const createNewProject = asyncHandler(async (req, res) => {
  const project = await createProjectService(req.body, req.user.id);
  res.status(201).json(project);
});

/* COMPLETE */
export const completeProject = asyncHandler(async (req, res) => {
  const result = await completeProjectService(
    req.params.projectId,
    req.user.id
  );
  res.json(result);
});

/* EDIT */
export const editProject = asyncHandler(async (req, res) => {
  const result = await editProjectService(
    req.body,
    req.params.projectId,
    req.user.id
  );
  res.json(result);
});

/* DELETE */
export const deleteProject = asyncHandler(async (req, res) => {
  const result = await deleteProjectService(
    req.params.projectId,
    req.user.id
  );
  res.json(result);
});

export const getMyInterns = asyncHandler(async (req, res) => {
  const interns = await getMyInternsService(req.user.id);
  res.json(interns);
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await getMyProjectsService(req.user.id);
  res.json(projects);
});

/* GET SUBMISSIONS */
export const getProjectSubmissions = asyncHandler(async (req, res) => {
  const data = await getProjectSubmissionsService(req.user.id);
  res.json(data);
});

/* REVIEW */
export const reviewSubmission = asyncHandler(async (req, res) => {
  const result = await reviewSubmissionService(req.body);
  res.json(result);
});

/* FEEDBACK */
export const giveFeedback = asyncHandler(async (req, res) => {
  const result = await giveFeedbackService(
    req.params.submissionId,
    req.body.feedback,
    req.user.id
  );
  res.json(result);
});

/* DASHBOARD */
export const getTeamLeadDashboardFull = asyncHandler(async (req, res) => {
  const data = await getTeamLeadDashboardService(req.user.id);
  res.json(data);
});