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

  async login(req, res) {
    try {
      res.send("login");
    } catch (error) {}
  }
}

export default new AuthController();
