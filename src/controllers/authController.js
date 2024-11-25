import authService from "../services/authService.js";
import { StatusCodes } from "http-status-codes";

class AuthController {
  async register(req, res, next) {
    const { logger } = req;

    logger.info(
      "[AuthController] :: signup :: Received signup request:",
      req.body
    );

    const { email } = req.body;

    try {
      // Create the user
      await authService.register(req.body);

      logger.info(
        "[AuthController] :: signup :: User created successfully:",
        email
      );

      return res
        .status(StatusCodes.CREATED)
        .json({ message: "User created successfully" });
    } catch (err) {
      logger.error(
        "[AuthController] :: signup :: Error during user creation:",
        err
      );

      next(err);
    }
  }

  async login(req, res, next) {
    const { logger } = req;

    logger.info(
      "[AuthController] :: login :: Received login request:",
      req.body
    );

    const { email } = req.body;

    try {
      const { token, options } = await authService.login(req.body);

      logger.info("[AuthController] :: login :: Login successful:", email);

      return res
        .status(StatusCodes.OK)
        .cookie("token", token, options)
        .json({ message: "Login successful", token: token });
    } catch (err) {
      logger.error(
        "[AuthController] :: login :: Error during user creation:",
        err
      );

      next(err);
    }
  }
}

export default new AuthController();
