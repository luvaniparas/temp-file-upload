import express from "express";
import { PORT } from "./secrets.js";
import { PrismaClient } from "@prisma/client";
import applyMiddleware from "./middlewares/index.js";
import { fileExpiresAtScheduler } from "./utils/fileExpiresAtScheduler.js";
import logger from "../src/utils/logger.js";

const app = express();
applyMiddleware(app);

export const prisma = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () => {
  console.log("Temp File Upload App Working");
  console.log(`Express app is running at http://localhost:${PORT}`);

  fileExpiresAtScheduler(logger);
});
