import { text, timestamp, varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  refreshToken: text("refresh_token").notNull(),
  accessToken: text("access_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
