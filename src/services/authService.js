import { USER_ALREADY_EXISTS } from "../utils/constant.js";
import { findUserByEmail, createUser } from "../models/user.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import {
  USER_NOT_FOUND_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
} from "../utils/constant.js";
import { JWT_SECRET } from "../secrets.js";
import jwt from "jsonwebtoken";

class AuthService {
  async register(input) {
    const { name, email, password } = input;

    // Check if the user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      const error = new Error(USER_ALREADY_EXISTS);
      error.status = StatusCodes.BAD_REQUEST;
      throw error;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const dto = {
      name,
      email,
      password: hashedPassword,
    };

    return await createUser(dto);
  }

  async login(input) {
    const { email, password } = input;

    // Check if the user already exists
    const userInfo = await findUserByEmail(email);

    if (!userInfo) {
      const error = new Error(USER_NOT_FOUND_MESSAGE);
      error.status = StatusCodes.BAD_REQUEST;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, userInfo.password);

    if (!validPassword) {
      const error = new Error(INVALID_PASSWORD_MESSAGE);
      error.status = StatusCodes.UNAUTHORIZED;
      throw error;
    }

    const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: "4h" });

    const options = {
      expires: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      httpOnly: true,
      sameSite: "strict",
    };

    return {
      token,
      options,
    };
  }
}

export default new AuthService();
