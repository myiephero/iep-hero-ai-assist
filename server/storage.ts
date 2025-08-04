import { type User, type InsertUser, type Goal, type InsertGoal, type Document, type InsertDocument, type Event, type InsertEvent, type Message, type InsertMessage, type SharedMemory, type InsertSharedMemory, users, iepGoals, documents, events, messages, sharedMemories } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  updateSubscriptionTier(userId: string, tier: string): Promise<User>;
  
  // IEP Goals
  getGoalsByUserId(userId: string): Promise<Goal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(goalId: string, updates: Partial<InsertGoal>): Promise<Goal>;
  deleteGoal(goalId: string): Promise<void>;
  
  // Documents
  getDocumentsByUserId(userId: string): Promise<Document[]>;
  createDocument(userId: string, document: InsertDocument): Promise<Document>;
  deleteDocument(documentId: string): Promise<void>;
  
  // Events
  getEventsByUserId(userId: string): Promise<Event[]>;
  createEvent(userId: string, event: InsertEvent): Promise<Event>;
  
  // Messages
  getMessagesByUserId(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // Shared Memories
  createSharedMemory(sharedMemory: InsertSharedMemory): Promise<SharedMemory>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private goals: Map<string, Goal>;
  private documents: Map<string, Document>;
  private events: Map<string, Event>;
  private messages: Map<string, Message>;
  private sharedMemories: Map<string, SharedMemory>;

  constructor() {
    this.users = new Map();
    this.goals = new Map();
    this.documents = new Map();
    this.events = new Map();
    this.messages = new Map();
    this.sharedMemories = new Map();
    
    // Add sample data for development
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: "sample-user-1",
      email: "demo@example.com",
      username: "Demo User",
      password: "hashed-password",
      role: "parent",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: "free",
      advocateEmail: "advocate@iephere.com",
      createdAt: new Date()
    };
    this.users.set("sample-user-1", sampleUser);
    
    // Add sample goals
    const sampleGoals = [
      {
        id: "goal-1",
        userId: "sample-user-1",
        studentId: "student-001",
        title: "Improve Reading Comprehension",
        description: "Student will read grade-level texts and answer comprehension questions with 80% accuracy",
        progress: 65,
        status: "In Progress",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "goal-2", 
        userId: "sample-user-1",
        studentId: "student-001",
        title: "Math Problem Solving",
        description: "Student will solve multi-step word problems using appropriate strategies with minimal prompting",
        progress: 40,
        status: "In Progress",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "goal-3",
        userId: "sample-user-1", 
        studentId: "student-001",
        title: "Social Communication Skills",
        description: "Student will initiate conversations with peers during structured activities",
        progress: 100,
        status: "Completed",
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        targetDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    sampleGoals.forEach(goal => this.goals.set(goal.id, goal as Goal));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: "free",
      advocateEmail: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId, 
      stripeSubscriptionId: subscriptionId,
      subscriptionTier: "professional"
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateSubscriptionTier(userId: string, tier: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, subscriptionTier: tier };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async createGoal(userId: string, insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = {
      ...insertGoal,
      id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(goalId: string, updates: Partial<InsertGoal>): Promise<Goal> {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error("Goal not found");
    
    const updatedGoal = { ...goal, ...updates, updatedAt: new Date() };
    this.goals.set(goalId, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(goalId: string): Promise<void> {
    this.goals.delete(goalId);
  }

  async getDocumentsByUserId(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  async createDocument(userId: string, insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      userId,
      uploadedAt: new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(documentId: string): Promise<void> {
    this.documents.delete(documentId);
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.userId === userId);
  }

  async createEvent(userId: string, insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      userId,
      createdAt: new Date()
    };
    this.events.set(id, event);
    return event;
  }

  async getMessagesByUserId(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      message => message.senderId === userId || message.receiverId === userId
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      sentAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      const updatedMessage = { ...message, read: true };
      this.messages.set(messageId, updatedMessage);
    }
  }

  async createSharedMemory(sharedMemory: InsertSharedMemory): Promise<SharedMemory> {
    const newSharedMemory: SharedMemory = {
      id: randomUUID(),
      ...sharedMemory,
      sharedAt: new Date(),
    };
    this.sharedMemories.set(newSharedMemory.id, newSharedMemory);
    return newSharedMemory;
  }
}

// Database Storage Implementation using Drizzle ORM
export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    // Use local Replit PostgreSQL database
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required');
    }
    
    const sql = postgres(databaseUrl, { 
      max: 1,
      connect_timeout: 10,
      idle_timeout: 20
    });
    this.db = drizzle(sql);
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = {
      ...user,
      id,
      createdAt: new Date(),
      role: user.role || "parent",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: "free",
      advocateEmail: null
    };
    
    const result = await this.db.insert(users).values(newUser).returning();
    return result[0];
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ 
        stripeCustomerId: customerId, 
        stripeSubscriptionId: subscriptionId || null,
        subscriptionTier: subscriptionId ? "hero" : "free"
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateSubscriptionTier(userId: string, tier: string): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ subscriptionTier: tier })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // IEP Goals
  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return await this.db.select().from(iepGoals).where(eq(iepGoals.userId, userId));
  }

  async createGoal(userId: string, goal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const newGoal = {
      ...goal,
      id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await this.db.insert(iepGoals).values(newGoal).returning();
    return result[0];
  }

  async updateGoal(goalId: string, updates: Partial<InsertGoal>): Promise<Goal> {
    const result = await this.db
      .update(iepGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(iepGoals.id, goalId))
      .returning();
    return result[0];
  }

  async deleteGoal(goalId: string): Promise<void> {
    await this.db.delete(iepGoals).where(eq(iepGoals.id, goalId));
  }

  // Documents
  async getDocumentsByUserId(userId: string): Promise<Document[]> {
    return await this.db.select().from(documents).where(eq(documents.userId, userId));
  }

  async createDocument(userId: string, document: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const newDocument = {
      ...document,
      id,
      userId,
      uploadedAt: new Date()
    };
    
    const result = await this.db.insert(documents).values(newDocument).returning();
    return result[0];
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.db.delete(documents).where(eq(documents.id, documentId));
  }

  // Events
  async getEventsByUserId(userId: string): Promise<Event[]> {
    return await this.db.select().from(events).where(eq(events.userId, userId));
  }

  async createEvent(userId: string, event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent = {
      ...event,
      id,
      userId,
      createdAt: new Date()
    };
    
    const result = await this.db.insert(events).values(newEvent).returning();
    return result[0];
  }

  // Messages
  async getMessagesByUserId(userId: string): Promise<Message[]> {
    return await this.db.select().from(messages).where(
      eq(messages.senderId, userId) // or eq(messages.receiverId, userId) - adjust based on your needs
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const newMessage = {
      ...message,
      id,
      sentAt: new Date()
    };
    
    const result = await this.db.insert(messages).values(newMessage).returning();
    return result[0];
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, messageId));
  }

  // Shared Memories
  async createSharedMemory(sharedMemory: InsertSharedMemory): Promise<SharedMemory> {
    const id = randomUUID();
    const newSharedMemory = {
      ...sharedMemory,
      id,
      sharedAt: new Date()
    };
    
    const result = await this.db.insert(sharedMemories).values(newSharedMemory).returning();
    return result[0];
  }
}

// Initialize storage with database connection
async function createStorage(): Promise<IStorage> {
  try {
    console.log('Attempting local database connection...');
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.log('No DATABASE_URL found, using memory storage');
      return new MemStorage();
    }
    
    const sql = postgres(databaseUrl, { 
      max: 1,
      connect_timeout: 10,
      idle_timeout: 20
    });
    
    // Test connection
    await sql`SELECT 1`;
    await sql.end();
    
    console.log('✅ Local database connection successful, using DbStorage');
    return new DbStorage();
  } catch (error) {
    console.warn('⚠️ Database connection failed, using memory storage:', error.message);
    return new MemStorage();
  }
}

// Try database storage, fall back to memory storage if connection fails
let storage: IStorage = new MemStorage(); // Default fallback

createStorage().then(s => {
  storage = s;
  console.log('Storage initialization completed');
}).catch(err => {
  console.error('Storage initialization failed:', err);
});

export { storage };
