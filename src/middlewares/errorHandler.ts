import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Centralized Error Handling Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Determine if the error is an HttpError (from standard library or created via http-errors)
  // If not, it's considered an untracked Server Error (500)
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log all errors using the customized Winston Logger
  // Using warn for 4xx errors, and error for 5xx errors
  if (status >= 500) {
    logger.error(
      `[${req.method}] ${req.url} >> StatusCode:: ${status}, Message:: ${message}`,
    );
    if (err.stack) {
      logger.error(err.stack);
    }
  } else {
    logger.warn(
      `[${req.method}] ${req.url} >> StatusCode:: ${status}, Message:: ${message}`,
    );
  }

  // Centralized response payload
  res.status(status).json({
    error: {
      status,
      message,
      // Forward an array of granular validation errors if attached to the error trace
      errors: err.errors && err.errors.length > 0 ? err.errors : undefined,
      // Provide the stack trace only in development
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};
