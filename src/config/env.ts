import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000").transform(Number),

  // JWT configuration
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1, "Access token secret is required"),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, "Refresh token secret is required"),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

  // DB credentials
  POSTGRES_DB: z.string().min(1, "Postgres DB name is required"),
  POSTGRES_USER: z.string().min(1, "Postgres User is required"),
  POSTGRES_PASSWORD: z.string().min(1, "Postgres Password is required"),

  // Full DB connection string
  DATABASE_URI: z.string().url("Database URI must be a valid URL"),

  // CORS configuration
  CORS_ORIGIN: z.string().default("*"),

  // resend api key

  RESEND_API_KEY: z.string(),
});

// Validate the current process environment against the schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    JSON.stringify(_env.error.format(), null, 2),
  );
  process.exit(1);
}

// Export the strictly-typed env variables
export const env = _env.data;
