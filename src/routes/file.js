import { Router } from "express";
import fileController from "../controllers/fileController.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createFileSchema } from "../schema/files.js";

// const { createResource, getResource, getResourceById, deleteResourceById } =
//   fileController;
const { createResource } = fileController;

const fileRouter = Router();

fileRouter.post("/resources", validateSchema(createFileSchema), createResource);
// fileRouter.get("/resources", validateSchema(), getResource);
// fileRouter.get("/resources/:id", validateSchema(), getResourceById);
// fileRouter.delete("/resources/:id", validateSchema(), deleteResourceById);

export default fileRouter;
