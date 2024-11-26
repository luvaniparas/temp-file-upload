import fileService from "../services/fileService.js";
import { StatusCodes } from "http-status-codes";
import { FILE_STATUS } from "../../src/utils/constant.js";

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

  async getResources(req, res, next) {
    const { logger, user } = req;

    const { id: userId } = user;
    const status = req.query.status || FILE_STATUS.ACTIVE;

    logger.info(
      `[FileController] :: GetResources :: Received Get Resources request by userId: ${userId}`
    );

    try {
      const response = await fileService.getResources(userId, status);

      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      logger.error(
        "[FileController] :: GetResources :: Error during getting resource:",
        err
      );

      next(err);
    }
  }

  async getResourceById(req, res, next) {
    const { logger, user } = req;

    const { id: userId } = user;

    const { id: resourceId } = req.params;

    logger.info(
      `[FileController] :: GetResourceById :: Received Get Resources request id ${resourceId} for userId: ${userId}`
    );

    try {
      const response = await fileService.getResourceById(resourceId);

      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      logger.error(
        "[FileController] :: GetResourceById :: Error during getting resource by id :",
        resourceId,
        err
      );

      next(err);
    }
  }

  async deleteResourceById(req, res, next) {
    const { logger, user } = req;

    const { id: userId } = user;

    const { id } = req.params;

    logger.info(
      `[FileController] :: DeleteResourceById :: Received Delete Resources by id ${id} for userId: ${userId}`
    );

    try {
      const response = await fileService.deleteResourceById(id);

      return res.status(StatusCodes.NO_CONTENT).json(response);
    } catch (err) {
      logger.error(
        "[FileController] :: DeleteResourceById :: Error during deleting resource by id :",
        id,
        err
      );

      next(err);
    }
  }
}

export default new FileController();
