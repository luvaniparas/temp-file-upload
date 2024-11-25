import authService from "../services/authService.js";
import { USER_ALREADY_EXISTS } from "../utils/constant.js";
import { createUserSchema } from "../schema/users.js";
import { StatusCodes } from "http-status-codes";

class AuthController {
  async register(req, res) {
    const { logger } = req;

    logger.info(
      "[AuthController] :: signup :: Received signup request:",
      req.body
    );

    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.message} (Path: ${err.path.join(".")})`)
        .join(", ");

      logger.error(
        "[AuthController] :: signup :: Validation errors:",
        errorMessages
      );

      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid input", errors: errorMessages });
    }

    const { email } = req.body;

    try {
      // Create the user
      await authService.register(result.data);

      logger.info(
        "[AuthController] :: signup :: User created successfully:",
        email
      );

      return res
        .status(StatusCodes.CREATED)
        .json({ message: "User created successfully" });
    } catch (err) {
      if (err.message === USER_ALREADY_EXISTS) {
        logger.error("User already exists:", err);

        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: USER_ALREADY_EXISTS });
      }

      logger.error(
        "[AuthController] :: signup :: Error during user creation:",
        err
      );

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "User registration failed", err });
    }
  }

  async login(req, res) {
    try {
      res.send("login");
    } catch (error) {}
  }
}

export default new AuthController();
