import { createEmployeeService } from "../services/userService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getUserProfileService } from "../services/userService.js";
export const createEmployee = asyncHandler(async (req, res) => {
    const { name, email, password, role, team_lead_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    await createEmployeeService({
      name,
      email,
      password,
      role,
      team_lead_id
    });

    res.json({ message: "Employee created" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserProfileService(req.user.id);
  res.json(user);
});