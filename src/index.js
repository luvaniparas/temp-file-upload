import express from "express";
import { PORT } from "./secrets.js";
import rootRouter from "./routes/index.js";
import { PrismaClient } from "@prisma/client";
import applyMiddleware from "./middlewares/index.js";

const app = express();
applyMiddleware(app);

app.use("/api/v1", rootRouter);

app.use("/", (req, res) => {
  res.send("Hello From Temp File Upload");
});

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

app.listen(PORT, () => {
  console.log("Temp File Upload App Working");
  console.log(`Express app is running at http://localhost:${PORT}`);
});
