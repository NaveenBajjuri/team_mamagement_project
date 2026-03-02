import { AppError } from "../utils/AppError.js";
import { createNotification } from "../utils/notificationService.js";
import { PROJECT_STATUS } from "../constants/projectStatus.js";

import {
  fetchProjectByIntern,
  fetchProjectDeadline,
  getNextSerialNumber,
  insertSubmission,
  fetchSubmissionsByIntern,
  countInternSubmissions,
  countApprovedSubmissions,
  countOngoingProjects,
  fetchSubmissionConsistency,
  fetchTimeline
} from "../repositories/submissionRepository.js";

import { fetchInternTeamLead } from "../repositories/userRepository.js";

/* GET PROJECT */
export const getMyProjectService = async (internId) => {
  const result = await fetchProjectByIntern(internId);
  return result.rows;
};

/* SUBMIT WORK */
export const submitWorkService = async (req, internId) => {
  const { projectId, title, description } = req.body;

  if (!req.files || !req.files.pdf) {
    throw new AppError("File required", 400);
  }

  const pdfPath = req.files.pdf[0].filename;

  const additionalDocs = req.files.additionalDocs
    ? req.files.additionalDocs.map((f) => f.filename)
    : [];

  const project = await fetchProjectDeadline(projectId);

  if (!project.rows.length) {
    throw new AppError("Project not found", 404);
  }

  const deadline = project.rows[0].deadline;
  const isLate = new Date() > new Date(deadline);

  const serialResult = await getNextSerialNumber(projectId);
  const serialNo = serialResult.rows[0].next_serial;

  const newSubmission = await insertSubmission({
    projectId,
    internId,
    title,
    description,
    pdfPath,
    additionalDocs: JSON.stringify(additionalDocs),
    serialNo,
    status: "Pending",
    isLate
  });

  const internTL = await fetchInternTeamLead(internId);

  const teamLeadId = internTL.rows[0].team_lead_id;
  const internName = internTL.rows[0].name;

  await createNotification(
    teamLeadId,
    `New submission uploaded by ${internName}`,
    "SUBMISSION_UPLOADED"
  );

  return {
    message: "Submitted Successfully",
    submission: newSubmission.rows[0]
  };
};

/* GET MY SUBMISSIONS */
export const getMySubmissionsService = async (internId) => {
  const result = await fetchSubmissionsByIntern(internId);
  return result.rows;
};

/* GET PROGRESS */
export const getProgressService = async (internId) => {
  const [
    total,
    approved,
    ongoingProjects,
    submissionConsistency,
    timeline
  ] = await Promise.all([
    countInternSubmissions(internId),
    countApprovedSubmissions(internId),
    countOngoingProjects(internId),
    fetchSubmissionConsistency(internId),
    fetchTimeline(internId)
  ]);

  const totalCount = parseInt(total.rows[0].count);
  const approvedCount = parseInt(approved.rows[0].count);
  const ongoingCount = parseInt(ongoingProjects.rows[0].count);

  return {
    summary: {
      activeProjects: ongoingCount,
      totalSubmissions: totalCount,
      approvedSubmissions: approvedCount,
      completionPercentage:
        totalCount === 0
          ? 0
          : Math.round((approvedCount / totalCount) * 100)
    },
    submissionConsistency: submissionConsistency.rows,
    timelineTracker: timeline.rows
  };
};