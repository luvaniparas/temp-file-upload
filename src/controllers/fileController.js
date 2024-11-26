import fileService from "../services/fileService.js";
import { StatusCodes } from "http-status-codes";

class FileController {
  async createResource(req, res, next) {
    const { logger, user, validatedData } = req;

    const { id: userId } = user;

    const { expirationTime } = req.body;

    logger.info(
      `[FileController] :: createResource :: Received Create Resource request by userId: ${userId}`
    );

    try {
      const currentTime = new Date();
      const userInputTimeInMilliseconds = expirationTime * 1000;
      const expiresAt = new Date(
        currentTime.getTime() + userInputTimeInMilliseconds
      );

      const dto = {
        ...validatedData,
        expiresAt,
        createdById: userId,
        updatedById: userId,
      };

      const response = await fileService.createResource(dto);

      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      logger.error(
        "[FileController] :: createResource :: Error during creating resource:",
        err
      );

      next(err);
    }
  }
}

export default new FileController();
