import express from "express";
import { PORT } from "./secrets.js";
import rootRouter from "./routes/index.js";

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

app.use("/", (req, res) => {
  res.send("Hello From Temp File Upload");
});

app.listen(PORT, () => {
  console.log("Temp File Upload App Working");
  console.log(`Express app is running at http://localhost:${PORT}`);
});
