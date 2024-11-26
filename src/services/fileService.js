import { FAILED_TO_CREATE_FILE } from "../utils/constant.js";
import {
  createFile,
  getUserResources,
  getResourceById,
  deleteResourceById,
} from "../models/file.js";

class FileService {
  async createResource(input) {
    const file = await createFile(input);

    if (!file) {
      const error = new Error(FAILED_TO_CREATE_FILE);
      error.status = StatusCodes.INTERNAL_SERVER_ERROR;
      throw error;
    }

    return file;
    //return await getObjectURL(file?.name);
  }

  async getResources(userId, status) {
    const resources = await getUserResources(userId, status);

    return resources;
  }

  async getResourceById(id) {
    const resource = await getResourceById(id);

    return resource;
  }

  async deleteResourceById(id) {
    const resource = await deleteResourceById(id);

    return resource;
  }
}

export default new FileService();
