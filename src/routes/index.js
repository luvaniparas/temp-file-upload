import { Router } from "express";
import authRouter from "./auth.js";
import resourceRouter from "./resource.js";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/resources", resourceRouter);

export default rootRouter;
