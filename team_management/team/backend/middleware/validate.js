import { AppError } from "../utils/AppError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    next();
  };
};