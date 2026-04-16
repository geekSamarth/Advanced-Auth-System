import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  refreshToken: text().notNull(),
  userAgent: text(),
  ipAddress: text(),
  isRevoked: boolean().default(false),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow(),
});
