import { type User, type InsertUser, type Goal, type InsertGoal, type Document, type InsertDocument, type Event, type InsertEvent, type Message, type InsertMessage, type SharedMemory, type InsertSharedMemory, type ProgressNote, type InsertProgressNote, type CommunicationLog, type InsertCommunicationLog, type AdvocateMatch, type InsertAdvocateMatch, type Student, type InsertStudent, type AdvocateClient, type InsertAdvocateClient, users, iepGoals, documents, events, messages, sharedMemories, progressNotes, communicationLogs, advocateMatches, students, advocateClients } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  verifyUserEmail(userId: string): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<User>;
  updateSubscriptionTier(userId: string, tier: string): Promise<User>;
  
  // IEP Goals
  getGoalsByUserId(userId: string): Promise<Goal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(goalId: string, updates: Partial<InsertGoal>): Promise<Goal>;
  deleteGoal(goalId: string): Promise<void>;
  
  // Documents
  getDocumentsByUserId(userId: string): Promise<Document[]>;
  getDocumentsByStudentId(studentId: string): Promise<Document[]>;
  createDocument(documentData: any): Promise<Document>;
  deleteDocument(documentId: string): Promise<void>;
  updateDocumentName(documentId: string, displayName: string): Promise<Document>;
  saveDocumentAnalysis(documentId: string, analysis: any): Promise<Document>;
  
  // Events
  getEventsByUserId(userId: string): Promise<Event[]>;
  createEvent(userId: string, event: InsertEvent): Promise<Event>;
  
  // Messages
  getMessagesByUserId(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // Shared Memories
  createSharedMemory(sharedMemory: InsertSharedMemory): Promise<SharedMemory>;
  
  // Progress Notes
  getProgressNotesByUserId(userId: string): Promise<ProgressNote[]>;
  createProgressNote(userId: string, note: InsertProgressNote): Promise<ProgressNote>;
  
  // Communication Logs
  getCommunicationLogsByUserId(userId: string): Promise<CommunicationLog[]>;
  createCommunicationLog(userId: string, log: InsertCommunicationLog): Promise<CommunicationLog>;
  
  // Advocate Matches
  getAdvocateMatchesByParentId(parentId: string): Promise<AdvocateMatch[]>;
  getAdvocateMatchesByAdvocateId(advocateId: string): Promise<AdvocateMatch[]>;
  createAdvocateMatch(parentId: string, advocateId: string, match: InsertAdvocateMatch): Promise<AdvocateMatch>;
  
  // Students
  getStudentsByParentId(parentId: string): Promise<Student[]>;
  getStudentsByAdvocateId(advocateId: string): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(studentId: string, updates: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(studentId: string): Promise<void>;
  
  // Advocate Clients
  getAdvocateClientsByAdvocateId(advocateId: string): Promise<AdvocateClient[]>;
  getAdvocateClientsByParentId(parentId: string): Promise<AdvocateClient[]>;
  createAdvocateClient(client: InsertAdvocateClient): Promise<AdvocateClient>;
  updateAdvocateClient(clientId: string, updates: Partial<InsertAdvocateClient>): Promise<AdvocateClient>;
  deleteAdvocateClient(clientId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private goals: Map<string, Goal>;
  private documents: Map<string, Document>;
  private events: Map<string, Event>;
  private messages: Map<string, Message>;
  private sharedMemories: Map<string, SharedMemory>;
  private progressNotes: Map<string, ProgressNote>;
  private communicationLogs: Map<string, CommunicationLog>;
  private advocateMatches: Map<string, AdvocateMatch>;
  private students: Map<string, Student>;
  private advocateClients: Map<string, AdvocateClient>;

  constructor() {
    this.users = new Map();
    this.goals = new Map();
    this.documents = new Map();
    this.events = new Map();
    this.messages = new Map();
    this.sharedMemories = new Map();
    this.progressNotes = new Map();
    this.communicationLogs = new Map();
    this.advocateMatches = new Map();
    this.students = new Map();
    this.advocateClients = new Map();
    
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
      planStatus: "free",
      advocateEmail: "advocate@iephere.com",
      emailVerified: true,
      verificationToken: null,
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
    
    // Add sample students for demo parent
    const parentStudents = [
      {
        id: "student-001",
        parentId: "sample-user-1",
        firstName: "Emma",
        lastName: "Johnson",
        dateOfBirth: "2015-06-15",
        gradeLevel: "3",
        schoolName: "Roosevelt Elementary",
        schoolDistrict: "Springfield District",
        disabilities: ["ADHD", "Learning Disability"],
        currentServices: ["Speech Therapy", "Special Education"],
        iepStatus: "active",
        lastIepDate: "2024-09-01",
        nextIepDate: "2025-09-01",
        caseNotes: "Student shows good progress in reading but needs support with math concepts.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "student-002", 
        parentId: "sample-user-1",
        firstName: "Alex",
        lastName: "Johnson",
        dateOfBirth: "2013-03-22",
        gradeLevel: "5",
        schoolName: "Roosevelt Elementary",
        schoolDistrict: "Springfield District",
        disabilities: ["Autism Spectrum Disorder"],
        currentServices: ["Occupational Therapy", "Behavioral Support"],
        iepStatus: "active",
        lastIepDate: "2024-08-15",
        nextIepDate: "2025-08-15",
        caseNotes: "Excellent progress in social skills, working on executive functioning.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    parentStudents.forEach(student => this.students.set(student.id, student as Student));
    
    // Add sample advocate students (assigned to advocate@demo.com)
    const advocateStudents = [
      {
        id: "advocate-student-001",
        parentId: "parent-demo-1", // Different parent
        advocateId: "advocate-demo-1", // Will be set to actual advocate ID during setup
        firstName: "Michael",
        lastName: "Smith",
        dateOfBirth: "2014-11-08",
        gradeLevel: "4",
        schoolName: "Lincoln Elementary",
        schoolDistrict: "Central District",
        disabilities: ["Dyslexia"],
        currentServices: ["Reading Support", "Extended Time"],
        iepStatus: "active",
        lastIepDate: "2024-10-01",
        nextIepDate: "2025-10-01",
        caseNotes: "Strong advocate support needed for reading accommodations.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    advocateStudents.forEach(student => this.students.set(student.id, student as Student));
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

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: insertUser.subscriptionTier || "free",
      planStatus: insertUser.planStatus || insertUser.subscriptionTier || "free",
      advocateEmail: null,
      emailVerified: insertUser.emailVerified || false,
      verificationToken: insertUser.verificationToken || null,
      createdAt: new Date(),
      role: insertUser.role || 'parent'
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.verificationToken === token);
  }

  async verifyUserEmail(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      emailVerified: true,
      verificationToken: null
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
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
    
    const updatedUser = { 
      ...user, 
      subscriptionTier: tier,
      planStatus: tier
    };
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

  async createDocument(documentData: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...documentData,
      id,
      uploadedAt: documentData.uploadedAt || new Date(),
      createdAt: documentData.createdAt || new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(documentId: string): Promise<void> {
    this.documents.delete(documentId);
  }

  async updateDocumentName(documentId: string, displayName: string): Promise<Document> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }
    const updatedDocument = { ...document, displayName };
    this.documents.set(documentId, updatedDocument);
    return updatedDocument;
  }

  async saveDocumentAnalysis(documentId: string, analysis: any): Promise<Document> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }
    const updatedDocument = { ...document, analysisResult: analysis };
    this.documents.set(documentId, updatedDocument);
    return updatedDocument;
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
      messageType: insertMessage.messageType || 'text',
      priority: insertMessage.priority || 'normal',
      read: false,
      archived: false,
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

  async getProgressNotesByUserId(userId: string): Promise<ProgressNote[]> {
    return Array.from(this.progressNotes.values()).filter(note => note.userId === userId);
  }

  async createProgressNote(userId: string, note: InsertProgressNote): Promise<ProgressNote> {
    const id = randomUUID();
    const newNote: ProgressNote = {
      id,
      userId,
      ...note,
      createdAt: new Date(),
    };
    this.progressNotes.set(id, newNote);
    return newNote;
  }

  async getCommunicationLogsByUserId(userId: string): Promise<CommunicationLog[]> {
    return Array.from(this.communicationLogs.values()).filter(log => log.userId === userId);
  }

  async createCommunicationLog(userId: string, log: InsertCommunicationLog): Promise<CommunicationLog> {
    const id = randomUUID();
    const newLog: CommunicationLog = {
      id,
      userId,
      ...log,
      createdAt: new Date(),
    };
    this.communicationLogs.set(id, newLog);
    return newLog;
  }

  async getAdvocateMatchesByParentId(parentId: string): Promise<AdvocateMatch[]> {
    return Array.from(this.advocateMatches.values()).filter(match => match.parentId === parentId);
  }

  async getAdvocateMatchesByAdvocateId(advocateId: string): Promise<AdvocateMatch[]> {
    return Array.from(this.advocateMatches.values()).filter(match => match.advocateId === advocateId);
  }

  async createAdvocateMatch(parentId: string, advocateId: string, match: InsertAdvocateMatch): Promise<AdvocateMatch> {
    const id = randomUUID();
    const newMatch: AdvocateMatch = {
      id,
      parentId,
      advocateId,
      ...match,
      createdAt: new Date(),
    };
    this.advocateMatches.set(id, newMatch);
    return newMatch;
  }

  // Student methods
  async getStudentsByParentId(parentId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(student => student.parentId === parentId);
  }

  async getStudentsByAdvocateId(advocateId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(student => student.advocateId === advocateId);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const newStudent: Student = {
      ...student,
      id,
      disabilities: student.disabilities || [],
      currentServices: student.currentServices || [],
      iepStatus: student.iepStatus || "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.students.set(id, newStudent);
    return newStudent;
  }

  async updateStudent(studentId: string, updates: Partial<InsertStudent>): Promise<Student> {
    const student = this.students.get(studentId);
    if (!student) {
      throw new Error(`Student not found: ${studentId}`);
    }

    const updatedStudent: Student = {
      ...student,
      ...updates,
      updatedAt: new Date()
    };
    this.students.set(studentId, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(studentId: string): Promise<void> {
    this.students.delete(studentId);
  }

  async getDocumentsByStudentId(studentId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.studentId === studentId);
  }

  // Advocate Client methods
  async getAdvocateClientsByAdvocateId(advocateId: string): Promise<AdvocateClient[]> {
    return Array.from(this.advocateClients.values()).filter(client => client.advocateId === advocateId);
  }

  async getAdvocateClientsByParentId(parentId: string): Promise<AdvocateClient[]> {
    return Array.from(this.advocateClients.values()).filter(client => client.parentId === parentId);
  }

  async createAdvocateClient(client: InsertAdvocateClient): Promise<AdvocateClient> {
    const id = randomUUID();
    const newClient: AdvocateClient = {
      ...client,
      id,
      assignedDate: new Date(),
      createdAt: new Date()
    };
    this.advocateClients.set(id, newClient);
    return newClient;
  }

  async updateAdvocateClient(clientId: string, updates: Partial<InsertAdvocateClient>): Promise<AdvocateClient> {
    const client = this.advocateClients.get(clientId);
    if (!client) {
      throw new Error(`Advocate client not found: ${clientId}`);
    }

    const updatedClient: AdvocateClient = {
      ...client,
      ...updates
    };
    this.advocateClients.set(clientId, updatedClient);
    return updatedClient;
  }

  async deleteAdvocateClient(clientId: string): Promise<void> {
    this.advocateClients.delete(clientId);
  }
}

// Database Storage Implementation using Drizzle ORM
export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    // Use environment variable or construct Supabase connection string
    let connectionString = process.env.DATABASE_URL;
    
    if (!connectionString && process.env.SUPABASE_URL) {
      // Extract project reference from SUPABASE_URL
      const projectRef = process.env.SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
      connectionString = `postgresql://postgres.${projectRef}:MyIEPHero2025$@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
    }
    
    if (!connectionString) {
      console.error("❌ No database connection string available");
      throw new Error("DATABASE_URL or SUPABASE_URL must be provided");
    }
    
    console.log("🔗 Connecting to database:", connectionString.replace(/:[^:@]*@/, ':***@'));
    
    const sql = postgres(connectionString, { 
      ssl: { rejectUnauthorized: false },
      max: 5,
      connect_timeout: 60,
      idle_timeout: 300
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

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
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

// The issue: Replit environment cannot connect to external Supabase database
// Solution: Use local database for now, provide manual export option for Supabase

console.log('🔧 DATABASE SETUP EXPLANATION:');
console.log('- Replit environment blocks external database connections');
console.log('- Using local PostgreSQL database for development');
console.log('- Users are being saved, but in local database, not Supabase');
console.log('- For production, you would deploy to a service that can connect to Supabase');

export const storage = new class LocalDbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required');
    }
    const sql = postgres(databaseUrl, { max: 1 });
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

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
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
    return await this.db.select().from(messages).where(eq(messages.senderId, userId));
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

  // Progress Notes
  async getProgressNotesByUserId(userId: string): Promise<ProgressNote[]> {
    return await this.db.select().from(progressNotes).where(eq(progressNotes.userId, userId));
  }

  async createProgressNote(userId: string, note: InsertProgressNote): Promise<ProgressNote> {
    const id = randomUUID();
    const newNote = {
      ...note,
      id,
      userId,
      createdAt: new Date()
    };
    
    const result = await this.db.insert(progressNotes).values(newNote).returning();
    return result[0];
  }

  // Communication Logs
  async getCommunicationLogsByUserId(userId: string): Promise<CommunicationLog[]> {
    return await this.db.select().from(communicationLogs).where(eq(communicationLogs.userId, userId));
  }

  async createCommunicationLog(userId: string, log: InsertCommunicationLog): Promise<CommunicationLog> {
    const id = randomUUID();
    const newLog = {
      ...log,
      id,
      userId,
      createdAt: new Date()
    };
    
    const result = await this.db.insert(communicationLogs).values(newLog).returning();
    return result[0];
  }

  // Advocate Matches
  async getAdvocateMatchesByParentId(parentId: string): Promise<AdvocateMatch[]> {
    return await this.db.select().from(advocateMatches).where(eq(advocateMatches.parentId, parentId));
  }

  async getAdvocateMatchesByAdvocateId(advocateId: string): Promise<AdvocateMatch[]> {
    return await this.db.select().from(advocateMatches).where(eq(advocateMatches.advocateId, advocateId));
  }

  async createAdvocateMatch(parentId: string, advocateId: string, match: Omit<InsertAdvocateMatch, 'parentId'>): Promise<AdvocateMatch> {
    const id = randomUUID();
    const newMatch = {
      ...match,
      id,
      parentId,
      advocateId: advocateId || null,
      createdAt: new Date(),
      meetingDate: match.meetingDate || null,
      documentUrls: match.documentUrls || null,
    };
    
    const result = await this.db.insert(advocateMatches).values(newMatch).returning();
    return result[0];
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Email verification methods
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.verificationToken, token)).limit(1);
    return result[0];
  }

  async verifyUserEmail(userId: string): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ 
        emailVerified: true, 
        verificationToken: null 
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateDocumentName(documentId: string, displayName: string): Promise<Document> {
    const result = await this.db
      .update(documents)
      .set({ displayName })
      .where(eq(documents.id, documentId))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Document not found");
    }
    return result[0];
  }

  async saveDocumentAnalysis(documentId: string, analysis: any): Promise<Document> {
    const result = await this.db
      .update(documents)
      .set({ analysisResult: analysis })
      .where(eq(documents.id, documentId))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Document not found");
    }
    return result[0];
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ 
        stripeCustomerId: customerId, 
        stripeSubscriptionId: subscriptionId,
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

  async getUsersByRole(role: string): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.role, role));
  }
}();
