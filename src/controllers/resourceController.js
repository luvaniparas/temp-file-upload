import resourceService from "../services/resourceService.js";
import { StatusCodes } from "http-status-codes";
import { FILE_STATUS } from "../../src/utils/constant.js";

class ResourceController {
  async createResource(req, res, next) {
    const { logger, user, validatedData } = req;

    const { id: userId } = user;

    logger.info(
      `[ResourceController] :: createResource :: Received Create Resource request by userId: ${userId}`
    );

    try {
      const resourceDto = {
        ...validatedData,
        status: FILE_STATUS.ACTIVE,
        createdById: userId,
      };

      const response = await resourceService.createResource(resourceDto);

      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      logger.error(
        "[ResourceController] :: createResource :: Error during creating resource:",
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
      `[ResourceController] :: GetResources :: Received Get Resources request by userId: ${userId}`
    );

    try {
      const response = await resourceService.getResources(userId, status);

      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      logger.error(
        "[ResourceController] :: GetResources :: Error during getting resource:",
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
      `[ResourceController] :: GetResourceById :: Received Get Resources request id ${resourceId} for userId: ${userId}`
    );

    try {
      const response = await resourceService.getResourceById(
        resourceId,
        userId
      );

      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      logger.error(
        "[ResourceController] :: GetResourceById :: Error during getting resource by id :",
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
      `[ResourceController] :: DeleteResourceById :: Received Delete Resources by id ${id} for userId: ${userId}`
    );

    try {
      const response = await resourceService.deleteResourceById(id);

      return res.status(StatusCodes.NO_CONTENT).json(response);
    } catch (err) {
      logger.error(
        "[ResourceController] :: DeleteResourceById :: Error during deleting resource by id :",
        id,
        err
      );

      next(err);
    }
  }
}

export default new ResourceController();
