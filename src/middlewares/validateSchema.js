import { StatusCodes } from "http-status-codes";
import { INVALID_INPUT } from "../utils/constant.js";

/**
 * Middleware to validate request payload against a given Zod schema.
 * @param {import("zod").ZodSchema} schema - The Zod schema to validate against.
 * @returns {Function} Express middleware function.
 */
const validateSchema = (schema) => (req, res, next) => {
  const { logger } = req;

  logger.info("[ValidationMiddleware] :: Validating request payload");

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors
      .map((err) => `${err.message} (Path: ${err.path.join(".")})`)
      .join(", ");

    logger.error("[ValidationMiddleware] :: Validation errors:", errorMessages);

    return res.status(StatusCodes.BAD_REQUEST).json({
      message: INVALID_INPUT,
      errors: errorMessages,
    });
  }

  // Attach validated data to the request object for downstream use
  req.validatedData = result.data;
  logger.info("[ValidationMiddleware] :: Validation successful");
  next();
};

export default validateSchema;
