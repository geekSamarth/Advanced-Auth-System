import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const tokens = pgTable("tokens", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  token: text().notNull(), // verification and reset
  expiresAt: timestamp().defaultNow(),
});
