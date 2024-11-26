import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import { StatusCodes } from "http-status-codes";

const validateToken = (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || "");

    if (typeof decoded === "string") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid token." });
    }

    const userInfo = decoded;

    req.user = userInfo;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token." });
  }
};

export default validateToken;
