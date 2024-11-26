import { Router } from "express";
import authRouter from "./auth.js";
import fileRouter from "./file.js";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/file", fileRouter);

export default rootRouter;
