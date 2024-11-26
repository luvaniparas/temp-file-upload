import { ONE_HOUR_IN_MILLISECONDS } from "../utils/constant.js";
import {
  createResource,
  getUserResources,
  getResourceById,
  deleteResourceById,
} from "../models/resource.js";
import {
  createLink,
  deleteShareLinksByResourceId,
} from "../models/shareLink.js";

class ResourceService {
  /**
   * Creates a new resource based on the given input.
   * @param {Object} input - The data to create the resource with.
   * @returns {Promise<Object>} - The newly created resource.
   * @throws {Error} - If there's an error during creating the resource.
   */
  async createResource(input) {
    const createdResource = await createResource(input);

    const currentTime = new Date();

    // If expirationTime is in hours, convert it to milliseconds (1 hour = 3600000 ms)
    const userInputTimeInMilliseconds =
      createdResource?.expiration * ONE_HOUR_IN_MILLISECONDS;

    const expirationAt = new Date(
      currentTime.getTime() + userInputTimeInMilliseconds
    );

    const shareLinkDto = {
      resourceId: createdResource.id,
      sharedById: createdResource.createdById,
      expiresAt: expirationAt,
    };

    // TODO: Add a transaction
    const createdShareLink = await createLink(shareLinkDto);

    return { resource: createdResource, shareLink: createdShareLink };
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

    return resource;
  }

  /**
   * Deletes a resource by ID.
   * @param {string} id - the ID of the resource to delete
   * @returns {Promise<Object>} - the deleted resource
   */
  async deleteResourceById(id, userId) {
    const deletedShareLinks = await deleteShareLinksByResourceId(id, userId);

    if (deletedShareLinks) {
      // Delete the resource from the database
      await deleteResourceById(id, userId);
    }
  }
}

export default new ResourceService();
