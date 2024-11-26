import { Router } from "express";
import authController from "../controllers/authController.js";
import validateSchema from "../middlewares/validateSchema.js";

import { createUserSchema, loginSchema } from "../schema/users.js";

const { register, login, logout } = authController;

const authRouter = Router();

authRouter.post("/sing-up", validateSchema(createUserSchema), register);

authRouter.get("/login", validateSchema(loginSchema), login);

authRouter.get("/logout", logout);

export default authRouter;
