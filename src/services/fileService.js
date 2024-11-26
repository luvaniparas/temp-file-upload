import { FAILED_TO_CREATE_FILE } from "../utils/constant.js";
import { createFile } from "../models/file.js";
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
}

export default new FileService();
