import { USER_ALREADY_EXISTS } from "../utils/constant.js";
import { findUserByEmail, createUser } from "../models/user.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

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
    try {
      res.send("login");
    } catch (error) {}
  }
}

export default new AuthService();
