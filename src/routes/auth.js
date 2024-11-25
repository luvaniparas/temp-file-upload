import { Router } from "express";
import authController from "../controllers/authController.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createUserSchema } from "../schema/users.js";

const { register, login } = authController;

const authRouter = Router();

authRouter.post("/sing-up", validateSchema(createUserSchema), register);
authRouter.get("/login", login);

export default authRouter;
