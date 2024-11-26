import { Router } from "express";
import resourceController from "../controllers/resourceController.js";
import validateSchema from "../middlewares/validateSchema.js";
import { resourceSchema } from "../schema/resource.js";
import { idSchema } from "../schema/commonSchemas.js";

const { createResource, getResources, getResourceById, deleteResourceById } =
  resourceController;

const resourceRouter = Router();

// Create Resource
resourceRouter.post("/", validateSchema(resourceSchema), createResource);

// Get all Resources
resourceRouter.get("/", getResources);

// Get a single Resource by ID
resourceRouter.get("/:id", validateSchema(idSchema, true), getResourceById);

// Delete a Resource by ID
resourceRouter.delete(
  "/:id",
  validateSchema(idSchema, true),
  deleteResourceById
);

export default resourceRouter;
