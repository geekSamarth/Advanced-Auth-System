import app from "./app";
import { env } from "./config/env";
import logger from "./utils/logger";
import { createServer } from "http";
import { closeDatabase } from "./db/db";

const PORT = env.PORT || 8000;

const server = createServer(app);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server is up and running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  logger.info(`${signal} signal received. Shutting down gracefully...`);
  server.close(async () => {
    logger.info("HTTP server closed.");
    // Close database connectivity safely
    await closeDatabase();
    process.exit(0);
  });

  // Force shutdown after 10s if graceful shutdown fails
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error | any) => {
  logger.error(`Unhandled Rejection: ${reason?.message || reason}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});
