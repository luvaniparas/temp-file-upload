import express from "express";
import bodyParser from "body-parser";
import morganMiddleware from "./morgan.js";
import cookieParser from "cookie-parser";
import validateToken from "./auth.js";
import logger from "../utils/logger.js";

const applyMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(morganMiddleware);
  app.use((req, res, next) => {
    req.logger = logger;
    next();
  });

  // Apply token validation middleware to all routes except authentication
  app.use((req, res, next) => {
    // Add your authentication paths here
    const authPaths = ["/", "/login", "/sing-up"];

    // Remove the /api/v1/auth prefix from req.path
    const modifiedPath = req.path.replace(/^\/api\/v1\/auth/, "");
    console.log("🚀 ~ app.use ~ modifiedPath:", modifiedPath);

    if (authPaths.includes(modifiedPath)) {
      return next();
    }

    validateToken(req, res, next);
  });
};

export default applyMiddleware;
