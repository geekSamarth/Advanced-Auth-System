import app from "./app";
import { env } from "./config/env";
import logger from "./utils/logger";
import { createServer } from "http";
import { closeDatabase, checkDatabaseConnection } from "./db/db";

const PORT = env.PORT || 8000;

const server = createServer(app);

// ✅ Start Server with DB check
const startServer = async () => {
  try {
    // Ensure DB is connected before starting server
    await checkDatabaseConnection();
    logger.info("Database connected successfully");

    server.listen(PORT, () => {
      logger.info(`Server is up and running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV || "development"}`);
    });
  } catch (err: any) {
    logger.error(`Failed to start server: ${err?.message || err}`);
    process.exit(1);
  }
};

startServer();

// ✅ Graceful shutdown handler
const shutdown = async (signal: string) => {
  logger.info(`${signal} signal received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      logger.info("HTTP server closed.");

      // Close DB connection
      await closeDatabase();

      logger.info("Shutdown completed successfully");
      process.exit(0);
    } catch (err: any) {
      logger.error(`Error during shutdown: ${err?.message || err}`);
      process.exit(1);
    }
  });

  // Force shutdown if something hangs
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

// OS Signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ❗ Unhandled Promise Rejections
process.on("unhandledRejection", async (reason: any) => {
  logger.error(`Unhandled Rejection: ${reason?.message || reason}`);

  try {
    await closeDatabase();
  } catch (err) {
    logger.error("Error closing DB during unhandledRejection", err);
  }

  process.exit(1);
});

// ❗ Uncaught Exceptions
process.on("uncaughtException", async (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);

  try {
    await closeDatabase();
  } catch (err) {
    logger.error("Error closing DB during uncaughtException", err);
  }

  process.exit(1);
});
