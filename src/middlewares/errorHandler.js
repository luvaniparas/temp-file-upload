import { StatusCodes, getReasonPhrase } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  const { logger } = req;

  // Log the error
  logger.error("[ErrorHandler] :: An error occurred:", err);

  // Determine the status code
  const statusCode = err?.status || StatusCodes.INTERNAL_SERVER_ERROR;

  // Format the error response
  const response = {
    status: statusCode,
    message: err?.message || getReasonPhrase(statusCode),
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
