import { pool } from "../config/db.js";
import { AppError } from "../utils/AppError.js";
import { createNotification } from "../utils/notificationService.js";
import { PROJECT_STATUS } from "../constants/projectStatus.js";
import { fetchProjectsByTeamLead } from "../repositories/projectRepository.js";
import {
  fetchInternsByTeamLead
} from "../repositories/userRepository.js";
import {
  createProject as createProjectRepo,
  findProjectById,
  updateProjectStatus,
  updateProject,
  deleteProjectById
} from "../repositories/projectRepository.js";

import {
  fetchSubmissionsByTeamLead,
  updateSubmissionStatus,
  findSubmissionWithProject,
  updateSubmissionFeedback
} from "../repositories/submissionRepository.js";


export const createProjectService = async (body, teamLeadId) => {
  const { title, description, deadline, internId } = body;

  if (!title || !description || !deadline || !internId) {
    throw new AppError("All fields required", 400);
  }

  const result = await createProjectRepo({
    title,
    description,
    deadline,
    internId,
    teamLeadId,
    status: PROJECT_STATUS.ONGOING
  });

  await createNotification(
    internId,
    `New project assigned: ${title}`,
    "PROJECT_ASSIGNED"
  );

  return result.rows[0];
};

/* COMPLETE PROJECT (TRANSACTION SAFE) */
export const completeProjectService = async (projectId, teamLeadId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const project = await findProjectById(projectId, teamLeadId);

    if (!project.rows.length) {
      throw new AppError("Project not found", 404);
    }

    const p = project.rows[0];

    await updateProjectStatus(projectId, PROJECT_STATUS.COMPLETED, client);

    await createNotification(
      p.intern_id,
      `Project completed: ${p.title}`,
      "PROJECT_COMPLETED"
    );

    const ceo = await client.query(
      `SELECT id FROM users WHERE role='CEO' LIMIT 1`
    );

    if (ceo.rows.length) {
      await createNotification(
        ceo.rows[0].id,
        `Project completed by TeamLead: ${p.title}`,
        "PROJECT_COMPLETED"
      );
    }

    const hr = await client.query(
      `SELECT id FROM users WHERE role='HR' LIMIT 1`
    );

    if (hr.rows.length) {
      await createNotification(
        hr.rows[0].id,
        `Project completed by intern: ${p.title}`,
        "PROJECT_COMPLETED"
      );
    }

    await client.query("COMMIT");

    return { message: "Project completed successfully" };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/* EDIT PROJECT */
export const editProjectService = async (body, projectId, teamLeadId) => {
  const result = await updateProject({
    title: body.title,
    description: body.description,
    deadline: body.deadline,
    projectId,
    teamLeadId
  });

  if (!result.rows.length) {
    throw new AppError("Project not found", 404);
  }

  return result.rows[0];
};

/* DELETE PROJECT */
export const deleteProjectService = async (projectId, teamLeadId) => {
  await deleteProjectById(projectId, teamLeadId);
  return { message: "Deleted" };
};

export const getMyInternsService = async (teamLeadId) => {
  const result = await fetchInternsByTeamLead(teamLeadId);
  return result.rows;
};

export const getMyProjectsService = async (teamLeadId) => {
  const result = await fetchProjectsByTeamLead(teamLeadId);
  return result.rows;
};

/* GET ALL SUBMISSIONS */
export const getProjectSubmissionsService = async (teamLeadId) => {
  const result = await fetchSubmissionsByTeamLead(teamLeadId);
  return result.rows;
};

/* REVIEW SUBMISSION */
export const reviewSubmissionService = async (body) => {
  const { submissionId, status, feedback } = body;

  if (!submissionId || !status) {
    throw new AppError("SubmissionId and status required", 400);
  }

  const updated = await updateSubmissionStatus(
    submissionId,
    status,
    feedback || null
  );

  if (!updated.rows.length) {
    throw new AppError("Submission not found", 404);
  }

  const submission = updated.rows[0];

  await createNotification(
    submission.intern_id,
    `Your submission ${status}`,
    "FEEDBACK"
  );

  return submission;
};

/* GIVE FEEDBACK */
export const giveFeedbackService = async (
  submissionId,
  feedback,
  teamLeadId
) => {
  if (!feedback || feedback.trim() === "") {
    throw new AppError("Feedback required", 400);
  }

  const sub = await findSubmissionWithProject(submissionId);

  if (!sub.rows.length) {
    throw new AppError("Submission not found", 404);
  }

  if (sub.rows[0].team_lead_id !== teamLeadId) {
    throw new AppError("Not your intern submission", 403);
  }

  await updateSubmissionFeedback(submissionId, feedback);

  await createNotification(
    sub.rows[0].intern_id,
    `Feedback added on submission`,
    "FEEDBACK"
  );

  return { message: "Feedback saved" };
};

export const getTeamLeadDashboardService = async (teamLeadId) => {
  const [
    interns,
    active,
    completed,
    pending,
    graph,
    recent,
    projects,
    overall
  ] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) FROM users 
       WHERE role='INTERN' AND team_lead_id=$1`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT COUNT(*) FROM projects 
       WHERE team_lead_id=$1 AND status!='Completed'`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT COUNT(*) FROM submissions s
       JOIN projects p ON s.project_id=p.id
       WHERE p.team_lead_id=$1 AND s.status='Approved'`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT COUNT(*) FROM submissions s
       JOIN projects p ON s.project_id=p.id
       WHERE p.team_lead_id=$1 AND s.status='Pending'`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT 
        u.name AS intern,
        COUNT(s.id) AS totalsubmissions,
        COUNT(s.id) FILTER (WHERE DATE(s.submitted_at)>p.deadline) AS latesubmissions
       FROM users u
       LEFT JOIN projects p ON p.intern_id=u.id
       LEFT JOIN submissions s ON s.project_id=p.id
       WHERE u.role='INTERN' AND u.team_lead_id=$1
       GROUP BY u.name`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT u.name AS intern,p.title AS project,s.status,s.submitted_at
       FROM submissions s
       JOIN projects p ON s.project_id=p.id
       JOIN users u ON p.intern_id=u.id
       WHERE p.team_lead_id=$1
       ORDER BY s.submitted_at DESC LIMIT 3`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT p.id,p.title,
        COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
        COUNT(s.id) AS total
       FROM projects p
       LEFT JOIN submissions s ON s.project_id=p.id
       WHERE p.team_lead_id=$1 AND p.status!='Completed'
       GROUP BY p.id,p.title`,
      [teamLeadId]
    ),

    pool.query(
      `SELECT 
        ROUND(
          AVG(
            CASE 
              WHEN total=0 THEN 0
              ELSE approved*100.0/total
            END
          )
        ) AS progress
       FROM (
         SELECT 
           p.id,
           COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
           COUNT(s.id) AS total
         FROM projects p
         LEFT JOIN submissions s ON s.project_id=p.id
         WHERE p.team_lead_id=$1 AND p.status!='Completed'
         GROUP BY p.id
       ) t`,
      [teamLeadId]
    )
  ]);

  return {
    cards: {
      interns: parseInt(interns.rows[0].count),
      activeProjects: parseInt(active.rows[0].count),
      completedTasks: parseInt(completed.rows[0].count),
      pendingReviews: parseInt(pending.rows[0].count)
    },
    performanceGraphData: graph.rows,
    recentSubmissions: recent.rows,
    activeProjectsList: projects.rows,
    overallProgress: overall.rows[0].progress || 0
  };
};

