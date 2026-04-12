import { varchar } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
export const user = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  phone: varchar({ length: 15 }).notNull(),
  fullName: varchar({ length: 255 }).notNull(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow(),
});
