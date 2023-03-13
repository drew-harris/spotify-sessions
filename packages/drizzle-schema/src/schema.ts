import {
  int,
  json,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core/columns";
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

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  contextUri: text("context_uri").notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  externalUrl: text("external_url").notNull(),

  trackId: text("track_id").notNull(),
  trackUri: text("track_uri").notNull(),
  progress: int("progress_ms").notNull(),

  trackName: text("track_name").notNull(),
  artistName: text("artist_name").notNull(),
  albumName: text("album_name").notNull(),
  albumArt: text("album_art").notNull(),
  previewUrl: text("preview_url"), // nullable
  trackNumber: int("track_number").notNull(),

  item: json("item"),
});
