import dotenv from "dotenv";

dotenv.config({ path: ".env" });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};
