import {
  boolean,
  varchar,
  integer,
  timestamp,
  text,
  uuid,
  pgTable,
} from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  phone: varchar({ length: 15 }).notNull(),
  fullName: varchar({ length: 255 }).notNull(),
  isVerified: boolean().default(false),
  isActive: boolean().notNull().default(true),
  role: text().default("user"),
  failedAttempts: integer().default(0),
  lockUntil: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
