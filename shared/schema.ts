import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  outputName: text("output_name").notNull(),
  originalPath: text("original_path").notNull(),
  outputPath: text("output_path").notNull(),
  width: integer("width"),
  height: integer("height"),
  processingTime: integer("processing_time"),
  createdAt: timestamp("created_at").defaultNow(),
  multiplier: integer("multiplier").default(6),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
