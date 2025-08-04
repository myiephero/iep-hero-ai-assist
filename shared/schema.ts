import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("parent"), // parent, advocate, professional
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("free"), // free, basic, professional, enterprise
  planStatus: text("plan_status").default("free").notNull(), // free, heroOffer, retainer
  advocateEmail: text("advocate_email"),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const iepGoals = pgTable("iep_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  studentId: varchar("student_id"), // Optional student identifier for multi-student households
  title: text("title").notNull(),
  description: text("description").notNull(),
  progress: integer("progress").default(0), // percentage 0-100
  status: text("status").notNull().default("Not Started"), // Not Started, In Progress, Completed
  dueDate: timestamp("due_date").notNull(),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  type: text("type").notNull(), // iep, assessment, progress_report, meeting_notes, other
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").default(sql`now()`),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // meeting, deadline, appointment
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  sentAt: timestamp("sent_at").default(sql`now()`),
});

export const sharedMemories = pgTable("shared_memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sharedAt: timestamp("shared_at").default(sql`now()`),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  role: true,
}).extend({
  emailVerified: z.boolean().optional(),
  verificationToken: z.string().optional(),
  planStatus: z.string().optional(),
});

export const insertGoalSchema = createInsertSchema(iepGoals).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["Not Started", "In Progress", "Completed"]).default("Not Started"),
  progress: z.number().min(0).max(100).default(0),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  userId: true,
  uploadedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
});

export const insertSharedMemorySchema = createInsertSchema(sharedMemories).omit({
  id: true,
  sharedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof iepGoals.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertSharedMemory = z.infer<typeof insertSharedMemorySchema>;
export type SharedMemory = typeof sharedMemories.$inferSelect;
