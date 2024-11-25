import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());

app.use("/", (req, res) => {
  res.send("Hello From Temp File Upload");
});

app.listen(PORT, () => {
  console.log("Temp File Upload App Working");
  console.log(`Express app is running at http://localhost:${PORT}`);
});
