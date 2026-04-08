import express, { Request, Response, NextFunction } from 'express';
import morganMiddleware from './middlewares/morganMiddleware';
import logger from './utils/logger';
import createError from 'http-errors';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';

const app = express();
const port = env.PORT;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

import { asyncHandler } from './utils/asyncHandler';
import { ApiResponse } from './utils/ApiResponse';
import { ApiError } from './utils/ApiError';

app.get('/api/status', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Checking the API status using async middleware');
  res.status(200).json(
    new ApiResponse(200, { state: 'UP' }, 'The API is up and running securely!')
  );
}));

// Route to demonstrate an explicit structured API error creation using asyncHandler and ApiError
app.get('/api/error-demo', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  throw new ApiError(400, 'This is a sample Bad Request structured by custom ApiError', ['Validation failed: Field X is required']);
}));

// 404 Catch-All Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, `Endpoint ${req.url} Not Found`));
});

// Global Error Handler Middleware
// Must be registered after all routes and standard middlewares
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
