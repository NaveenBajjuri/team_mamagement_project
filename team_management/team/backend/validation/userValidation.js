import Joi from "joi";
import { ROLES } from "../constants/roles.js";

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(
      ROLES.CEO,
      ROLES.HR,
      ROLES.TEAM_LEAD,
      ROLES.INTERN
    )
    .required(),
  team_lead_id: Joi.number().optional()
});