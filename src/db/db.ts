import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../config/env";
import logger from "../utils/logger";

const { Pool } = pg;

// Production-grade connection pool configuration
const pool = new Pool({
  connectionString: env.DATABASE_URI,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // how long to wait for a connection to become available
});

// Pool event listeners for monitoring and error logging
pool.on("connect", () => {
  logger.info("Database connection established successfully");
});

pool.on("error", (err) => {
  logger.error(`Unexpected error on idle database client: ${err.message}`, err);
  process.exit(-1);
});

// Initialize Drizzle ORM
export const db = drizzle(pool);

// Helper for graceful database shutdown
export const closeDatabase = async () => {
  try {
    await pool.end();
    logger.info("Database pool closed successfully");
  } catch (err: any) {
    logger.error(`Error closing database pool: ${err.message}`);
  }
};
