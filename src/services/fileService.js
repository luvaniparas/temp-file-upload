import { FAILED_TO_CREATE_FILE } from "../utils/constant.js";
import {
  createFile,
  getUserResources,
  getResourceById,
  deleteResourceById,
} from "../models/file.js";
import { deleteObject } from "../models/awsBucket.js";

class FileService {
  /**
   * Creates a new resource and retrieves a presigned URL for it.
   * @param {Object} input - The input data for creating the resource.
   * @returns {Promise<string>} - A presigned URL for the created resource.
   * @throws Will throw an error if the resource creation fails.
   */
  async createResource(input) {
    // Create a new file/resource with the provided input
    const file = await createFile(input);

    // Check if the file creation was unsuccessful
    if (!file) {
      const error = new Error(FAILED_TO_CREATE_FILE);
      error.status = StatusCodes.INTERNAL_SERVER_ERROR;
      throw error;
    }

    // Retrieve a presigned URL for the created file
    return await getPresignedUrl(file?.name, file?.type);
  }

  /**
   * Retrieves a list of resources for a given user ID and status.
   * @param {string} userId - The ID of the user to retrieve resources for.
   * @param {string} status - The status of the resources to retrieve.
   * @returns {Promise<Object[]>} - An array of resources for the given user ID and status.
   */
  async getResources(userId, status) {
    // Fetch the resources for the given user ID and status
    const resources = await getUserResources(userId, status);

    // Return the resources
    return resources;
  }

  /**
   * Retrieves a resource by ID and generates a signed URL for it.
   * @param {string} id - The ID of the resource to retrieve.
   * @returns {Promise<Object>} - An object containing the resource data and its signed URL.
   */
  async getResourceById(id) {
    // Fetch the resource by its ID
    const resource = await getResourceById(id);

    // Generate a signed URL for the resource
    const url = await getObjectURL(resource?.name, resource?.expirationTime);

    // Return the resource and its signed URL
    return { url, resource };
  }

  /**
   * Deletes a resource by ID.
   * @param {string} id - the ID of the resource to delete
   * @returns {Promise<Object>} - the deleted resource
   */
  async deleteResourceById(id) {
    const resource = await getResourceById(id);
    if (!resource) return null;

    // Delete the resource from the database
    await deleteResourceById(id);

    // Delete the file from S3
    await deleteObject(resource?.name);

    return resource;
  }
}

export default new FileService();
