import { pgTable, uuid, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Messages table for storing all chat messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").notNull(),
  receiverId: uuid("receiver_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  isRead: boolean("is_read").default(false).notNull(),
}, (table) => ({
  senderIdx: index("messages_sender_idx").on(table.senderId),
  receiverIdx: index("messages_receiver_idx").on(table.receiverId),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
}));

// Conversations table to track active conversations between users
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").notNull(),
  advocateId: uuid("advocate_id").notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  parentIdx: index("conversations_parent_idx").on(table.parentId),
  advocateIdx: index("conversations_advocate_idx").on(table.advocateId),
  lastMessageIdx: index("conversations_last_message_idx").on(table.lastMessageAt),
}));

// Typing indicators for real-time typing status
export const typingIndicators = pgTable("typing_indicators", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  conversationId: uuid("conversation_id").notNull(),
  isTyping: boolean("is_typing").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userConversationIdx: index("typing_user_conversation_idx").on(table.userId, table.conversationId),
}));

// Insert and select schemas
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
export const insertConversationSchema = createInsertSchema(conversations);
export const selectConversationSchema = createSelectSchema(conversations);
export const insertTypingIndicatorSchema = createInsertSchema(typingIndicators);
export const selectTypingIndicatorSchema = createSelectSchema(typingIndicators);

// Types
export type Message = z.infer<typeof selectMessageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Conversation = z.infer<typeof selectConversationSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type TypingIndicator = z.infer<typeof selectTypingIndicatorSchema>;
export type InsertTypingIndicator = z.infer<typeof insertTypingIndicatorSchema>;

// Extended types for UI
export interface MessageWithUser extends Message {
  senderName: string;
  senderRole: 'parent' | 'advocate';
}

export interface ConversationWithDetails extends Conversation {
  otherUserName: string;
  otherUserRole: 'parent' | 'advocate';
  lastMessage?: string;
  unreadCount: number;
}