import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;

export const AWS_SECRET_BUCKET_NAME = process.env.AWS_SECRET_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
