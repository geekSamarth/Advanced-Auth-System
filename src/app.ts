import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import helmet from "helmet";
import morganMiddleware from "./middlewares/morganMiddleware";
import { ApiError } from "./utils/ApiError";
import { errorHandler } from "./middlewares/errorHandler";
import healthcheckRouter from "./routes/healthcheck.routes";

const app = express();

// ========================================
// Global Middlewares
// ========================================
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    credentials: true,
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(morganMiddleware);

// healthcheck route

app.use("/api/v1", healthcheckRouter);

// 404 Catch-All Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Endpoint ${req.originalUrl} Not Found`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
