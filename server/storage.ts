import { type User, type InsertUser, type Goal, type InsertGoal, type Document, type InsertDocument, type Event, type InsertEvent, type Message, type InsertMessage, type SharedMemory, type InsertSharedMemory } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
