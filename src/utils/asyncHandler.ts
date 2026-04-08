import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async express route handler and automatically passes
 * any uncaught rejections/errors to the Express `next()` function
 * so the global Error Handler can process them.
 */
export const asyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
