import { Router } from "express";
import fileController from "../controllers/fileController.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createFileSchema } from "../schema/files.js";
import { idSchema } from "../schema/commonSchemas.js";

const { createResource, getResources, getResourceById, deleteResourceById } =
  fileController;

const fileRouter = Router();

fileRouter.post("/resources", validateSchema(createFileSchema), createResource);
fileRouter.get("/resources", getResources);
fileRouter.get(
  "/resources/:id",
  validateSchema(idSchema, true),
  getResourceById
);
fileRouter.delete(
  "/resources/:id",
  validateSchema(idSchema, true),
  deleteResourceById
);

export default fileRouter;
