import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerShareMemoryRoutes } from "./routes/share-memory";
import { registerTestMemoryRoutes } from "./routes/test-memory";
import studentsRoutes from "./routes/students";
import advocateClientsRoutes from "./routes/advocate-clients";
import { insertUserSchema, insertGoalSchema, insertDocumentSchema, insertEventSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { analyzeIEPDocument, generateIEPGoals, generateIEPGoalsFromArea } from "./ai-document-analyzer";
import OpenAI from "openai";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil" as any,
});

// Initialize Resend for email functionality
const resend = new Resend(process.env.RESEND_API_KEY);

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create PostgreSQL session store for production-ready session management
  const pgSessionStore = pgSession(session);
  
  // Configure PostgreSQL connection pool for sessions
  const sessionPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  // Session configuration with PostgreSQL store
  app.use(session({
    store: new pgSessionStore({
      pool: sessionPool,
      tableName: 'session', // Default table name
      createTableIfMissing: true // Automatically create session table
    }),
    secret: process.env.SESSION_SECRET || 'iep-hero-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Authentication required' });
  };

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password and generate verification token
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const verificationToken = randomUUID();
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        planStatus: req.body.planStatus || "free" // Track plan selection
      });
      
      // Send welcome email with verification link
      try {
        const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${verificationToken}`;
        
        await resend.emails.send({
          from: 'My IEP Hero <noreply@myiephero.com>',
          to: user.email,
          subject: 'Welcome to My IEP Hero - Verify Your Email',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">Welcome to My IEP Hero!</h1>
              <p>Hi ${user.username},</p>
              <p>Thank you for joining My IEP Hero! We're excited to help you navigate your IEP journey.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #1e40af; margin-top: 0;">Get Started</h2>
                <p>To complete your registration and access your account, please verify your email address:</p>
                <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
                  Verify Email & Access Account
                </a>
              </div>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Set up your IEP goals and track progress</li>
                <li>Upload and organize important documents</li>
                <li>Use our AI-powered Memory Q&A feature</li>
                <li>Connect with advocates for expert guidance</li>
              </ul>
              
              <p>If you have any questions, we're here to help!</p>
              <p>Best regards,<br>The My IEP Hero Team</p>
            </div>
          `
        });
        
        console.log(`✅ Welcome email sent to ${user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send welcome email:', emailError);
        // Continue with registration even if email fails
      }
      
      res.json({ 
        message: 'Registration successful! Please check your email to verify your account.',
        user: { id: user.id, email: user.email, username: user.username, role: user.role }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Email verification route
  app.get("/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).send(`
          <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Invalid Verification Link</h1>
            <p>This verification link is invalid or expired.</p>
            <a href="/" style="color: #2563eb;">Return to My IEP Hero</a>
          </body></html>
        `);
      }
      
      const user = await storage.getUserByVerificationToken(token as string);
      
      if (!user) {
        return res.status(400).send(`
          <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Invalid Verification Link</h1>
            <p>This verification link is invalid or has already been used.</p>
            <a href="/" style="color: #2563eb;">Return to My IEP Hero</a>
          </body></html>
        `);
      }
      
      // Verify the user's email
      await storage.verifyUserEmail(user.id);
      
      // Log them in automatically
      req.login(user, (err) => {
        if (err) {
          console.error('Auto-login error:', err);
        }
      });
      
      // Check if user had selected Hero plan during registration
      const isHeroUser = user.subscriptionTier === 'hero' || user.stripeSubscriptionId;
      
      res.send(`
        <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #16a34a;">Email Verified Successfully!</h1>
          <p>Welcome to My IEP Hero, ${user.username}!</p>
          
          ${isHeroUser ? `
            <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #92400e; margin: 0;">🌟 Hero Plan Active</h2>
              <p style="color: #92400e; margin: 10px 0;">You have full access to all Hero features including AI Memory Q&A, advocate sharing, and expert consultations.</p>
            </div>
          ` : `
            <div style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #065f46; margin: 0;">✅ FREE Account Active</h2>
              <p style="color: #065f46; margin: 10px 0;">You have access to basic IEP goal tracking, document storage (10 files), and meeting calendar.</p>
              <a href="/pricing" style="background-color: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; margin-top: 10px; display: inline-block;">
                Upgrade to Hero Plan ($495/year)
              </a>
            </div>
          `}
          
          <a href="/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Go to Dashboard
          </a>
        </body></html>
      `);
    } catch (error: any) {
      console.error('Email verification error:', error);
      res.status(500).send(`
        <html><body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">Verification Error</h1>
          <p>Something went wrong during verification. Please try again.</p>
          <a href="/" style="color: #2563eb;">Return to My IEP Hero</a>
        </body></html>
      `);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login auth error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (!user) {
        console.log('Login failed - no user:', info);
        return res.status(401).json({ message: info?.message || 'Invalid credentials' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login session error:', err);
          return res.status(500).json({ message: 'Session error' });
        }
        
        console.log('✅ Login successful for:', user.email);
        // Fix Hero Plan detection: demo accounts should always have Hero access
        let planStatus = user.planStatus || user.subscriptionTier || 'free';
        let subscriptionTier = user.subscriptionTier || 'free';
        
        if (user.email === 'parent@demo.com' || user.email === 'advocate@demo.com' || user.email === 'demo_parent@demo.com') {
          planStatus = 'heroOffer';
          subscriptionTier = 'heroOffer';
        }
        
        res.json({ 
          user: { 
            id: user.id, 
            email: user.email, 
            username: user.username, 
            role: user.role,
            planStatus: planStatus,
            subscriptionTier: subscriptionTier
          } 
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout error' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Generate Meeting Prep Sheet route
  app.post("/api/generate-meeting-prep", requireAuth, async (req, res) => {
    try {
      console.log("Meeting prep generation request received");
      const { formData } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY not found in environment");
        return res.status(503).json({ 
          error: "AI service temporarily unavailable. Please ensure OPENAI_API_KEY is configured." 
        });
      }

      const prompt = `Create an IEP meeting preparation summary for a parent based on the following responses:

- Meeting Concerns: ${formData.concerns || 'Not specified'}
- Services in Question: ${formData.services || 'Not specified'}
- Child Progress: ${formData.progress || 'Not specified'}
- Behavior or Medical Changes: ${formData.changes || 'No'}
- Goal/Placement Requests: ${formData.requests || 'No'}
- Support Attendees: ${formData.attendees || 'No'}
- Parent's Questions: ${formData.questions || 'None specified'}

Format the output as a clean, bullet-point prep sheet including:
- Meeting agenda overview
- Suggested talking points
- Questions to ask the team
- Reminders of legal rights under IDEA
- Areas to follow up after the meeting
- Tips for effective advocacy

Use professional, supportive language that empowers the parent while being legally appropriate.`;

      console.log("Sending request to OpenAI...");
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: 'You are a professional IEP advocate helping parents prepare for important educational meetings. Provide practical, legally sound advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error("OpenAI API error:", response.status, response.statusText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const prepSheet = data.choices[0].message.content;

      console.log("Meeting prep sheet generated successfully");
      res.json({ prepSheet });
    } catch (error: any) {
      console.error('Error generating meeting prep:', error);
      res.status(500).json({ 
        error: 'Failed to generate meeting prep sheet. Please try again.',
        details: error.message 
      });
    }
  });

  // Generated Documents API - Save AI-generated content to document vault
  app.post("/api/documents/generate", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { content, type, generatedBy, displayName, parentDocumentId } = req.body;

      if (!content || !type || !generatedBy || !displayName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const documentData = {
        userId: user.id,
        filename: `${displayName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`,
        originalName: `${displayName}.txt`,
        displayName,
        type,
        content,
        generatedBy,
        parentDocumentId: parentDocumentId || null,
        fileUrl: null, // Generated documents don't have file URLs
      };

      const document = await storage.createDocument(documentData);
      
      res.json({ 
        success: true, 
        document,
        message: "Generated content saved to Document Vault"
      });
    } catch (error: any) {
      console.error('Error saving generated document:', error);
      res.status(500).json({ error: 'Failed to save generated content' });
    }
  });

  // Progress Notes routes
  app.get("/api/progress-notes", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const notes = await storage.getProgressNotesByUserId(user.id);
      res.json(notes);
    } catch (error: any) {
      console.error('Error fetching progress notes:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/progress-notes", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const noteData = req.body;
      const note = await storage.createProgressNote(user.id, noteData);
      res.json(note);
    } catch (error: any) {
      console.error('Error creating progress note:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/progress-notes/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const noteId = req.params.id;
      await storage.deleteProgressNote(noteId);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting progress note:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Communication Logs routes
  app.get("/api/communication-logs", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const logs = await storage.getCommunicationLogsByUserId(user.id);
      res.json(logs);
    } catch (error: any) {
      console.error('Error fetching communication logs:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/communication-logs", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const logData = req.body;
      const log = await storage.createCommunicationLog(user.id, logData);
      res.json(log);
    } catch (error: any) {
      console.error('Error creating communication log:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Advocate Matches routes
  app.get("/api/advocate-matches", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      let matches: any[] = [];
      if (user.role === 'parent') {
        matches = await storage.getAdvocateMatchesByParentId(user.id);
      } else if (user.role === 'advocate') {
        matches = await storage.getAdvocateMatchesByAdvocateId(user.id);
      }
      res.json(matches);
    } catch (error: any) {
      console.error('Error fetching advocate matches:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/advocate-matches", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const formData = req.body;
      
      // Try Supabase first, fallback to local database
      const { submitAdvocateMatch } = await import('./supabaseService');
      const supabaseResult = await submitAdvocateMatch(formData, user.id, formData.selectedAdvocate);
      
      if (supabaseResult.success) {
        console.log('✅ Data successfully saved to Supabase!');
        
        // Send auto-confirmation to parent
        try {
          const { sendParentConfirmation } = await import('./emailTemplates');
          const matchData = {
            gradeLevel: formData.gradeLevel,
            schoolDistrict: formData.schoolDistrict,
            helpAreas: formData.helpAreas,
            contactMethod: formData.contactMethod,
          };
          await sendParentConfirmation(matchData as any, user.email);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
        
        res.json({ success: true, message: 'Advocate match submitted to Supabase successfully', savedTo: 'supabase' });
        return;
      }
      
      // Fallback to local database
      console.log('📍 Fallback: Saving to local database');
      const matchData = {
        meetingDate: formData.meetingDate || null,
        contactMethod: formData.contactMethod,
        parentAvailability: formData.availability,
        concerns: formData.concerns,
        helpAreas: formData.helpAreas,
        gradeLevel: formData.gradeLevel,
        schoolDistrict: formData.schoolDistrict,
        documentUrls: formData.uploadedFiles || [],
      };
      
      // Use selected advocate or auto-assign to available advocate
      let advocateId: string;
      if (formData.selectedAdvocate) {
        advocateId = formData.selectedAdvocate;
      } else {
        // Auto-assign logic based on help areas
        const availableAdvocate = await storage.getUserByEmail('advocate@demo.com');
        if (availableAdvocate) {
          advocateId = availableAdvocate.id;
        } else {
          return res.status(400).json({ error: 'No advocates available for assignment' });
        }
      }

      const match = await storage.createAdvocateMatch(user.id, advocateId, matchData);
      
      // Send notification emails
      const { sendAdvocateNotification, sendParentConfirmation } = await import('./emailTemplates');
      
      try {
        const availableAdvocate = await storage.getUserByEmail('advocate@demo.com');
        if (availableAdvocate) {
          await sendAdvocateNotification(match, availableAdvocate.email, availableAdvocate.username);
        }
        await sendParentConfirmation(match, user.email);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the request if email fails
      }

      // Send Slack notification for local database too
      const slackWebhook = process.env.SLACK_WEBHOOK_URL;
      if (slackWebhook && slackWebhook !== 'YOUR/SLACK/WEBHOOK') {
        try {
          await fetch(slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `📢 New Advocate Match Request (Local DB)\nParent: ${user.email}\nAdvocate ID: ${advocateId}\nGrade: ${formData.gradeLevel}\nDistrict: ${formData.schoolDistrict}\nConcern: ${formData.concerns.substring(0, 100)}...`
            })
          });
          console.log('✅ Slack notification sent');
        } catch (slackError) {
          console.error('Failed to send Slack notification:', slackError);
        }
      }

      res.json({ success: true, match, savedTo: 'local' });
    } catch (error: any) {
      console.error('Error creating advocate match:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/me", requireAuth, (req, res) => {
    const user = req.user as any;
    // Fix Hero Plan detection: demo accounts should always have Hero access
    let planStatus = user.planStatus || user.subscriptionTier || 'free';
    let subscriptionTier = user.subscriptionTier || 'free';
    
    if (user.email === 'parent@demo.com' || user.email === 'advocate@demo.com' || user.email === 'demo_parent@demo.com') {
      planStatus = 'heroOffer';
      subscriptionTier = 'heroOffer';
    }
    
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        role: user.role, 
        subscriptionTier: subscriptionTier,
        planStatus: planStatus
      } 
    });
  });

  // Stripe subscription route
  // Subscription endpoint - temporarily disabled for MVP testing
  app.post('/api/create-subscription', requireAuth, async (req, res) => {
    console.log("Subscription request received - temporarily disabled for MVP");
    res.status(503).json({ 
      error: "Subscription service temporarily unavailable during MVP testing. All Hero Plan features are available for testing." 
    });
  });

  // Legacy subscription endpoint support  
  app.post('/api/get-or-create-subscription', requireAuth, async (req, res) => {
    console.log("Legacy subscription request received - temporarily disabled for MVP");
    res.status(503).json({ 
      error: "Subscription service temporarily unavailable during MVP testing. All Hero Plan features are available for testing." 
    });
  });

  // Goals routes
  app.get("/api/goals", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const goals = await storage.getGoalsByUserId(user.id);
      res.json(goals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // IEP Drafts routes
  app.get("/api/iep-drafts", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const drafts = await storage.getIEPDraftsByUserId(user.id);
      res.json(drafts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/iep-drafts", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { diagnosis, suggestions } = req.body;
      
      if (!diagnosis || !suggestions) {
        return res.status(400).json({ message: 'Diagnosis and suggestions are required' });
      }

      const draft = await storage.createIEPDraft(user.id, {
        diagnosis: diagnosis.trim(),
        suggestions: suggestions.trim()
      });
      
      res.json(draft);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate IEP Goals using AI
  app.post("/api/generate-iep-goals", requireAuth, async (req, res) => {
    try {
      const { diagnosis } = req.body;
      
      if (!diagnosis) {
        return res.status(400).json({ message: 'Diagnosis is required' });
      }

      const { analyzeDocument } = await import('./ai-document-analyzer');
      
      const prompt = `You are an expert IEP (Individualized Education Program) goal writer. Generate 3-5 comprehensive, measurable IEP goals for a student diagnosed with: ${diagnosis}

Please ensure each goal follows the SMART criteria:
- Specific: Clearly defined skill or behavior
- Measurable: Include specific criteria for success
- Achievable: Realistic for the student
- Relevant: Addresses the student's needs
- Time-bound: Include timeframe (typically 1 year)

Format each goal with:
1. The specific skill area
2. Current performance level
3. Measurable objective
4. Method of measurement
5. Timeline

Focus on functional skills that will help the student succeed in their educational environment.`;

      const analysis = await analyzeDocument('', prompt);
      
      res.json({ goals: analysis });
    } catch (error: any) {
      console.error('Error generating IEP goals:', error);
      res.status(500).json({ message: error.message || 'Failed to generate IEP goals' });
    }
  });

  // Messages routes
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Get all users who have exchanged messages with current user
      const conversations = await storage.getConversationsByUserId(user.id);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/messages/:recipientId", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { recipientId } = req.params;
      
      const messages = await storage.getMessagesBetweenUsers(user.id, recipientId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { receiverId, content } = req.body;
      
      if (!receiverId || !content) {
        return res.status(400).json({ message: 'Receiver ID and content are required' });
      }

      const message = await storage.createMessage({
        senderId: user.id,
        receiverId: receiverId,
        content: content.trim(),
        messageType: 'text',
        priority: 'normal',
        read: false,
        archived: false
      });
      
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/goals", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(user.id, goalData);
      res.json(goal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/goals/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const goal = await storage.updateGoal(id, updates);
      res.json(goal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/goals/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGoal(id);
      res.json({ message: 'Goal deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Documents routes
  app.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const documents = await storage.getDocumentsByUserId(user.id);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/documents", requireAuth, upload.single('document'), async (req, res) => {
    try {
      const user = req.user as any;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { type, description } = req.body;
      
      const document = await storage.createDocument(user.id, {
        filename: req.file.filename,
        originalName: req.file.originalname,
        type: type || 'other',
        description: description || '',
        fileUrl: `/uploads/${req.file.filename}`
      });

      res.json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Document Analysis route
  app.post("/api/documents/:id/analyze", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      // Get document details
      const documents = await storage.getDocumentsByUserId(user.id);
      const document = documents.find((doc: any) => doc.id === id);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      // Construct full file path
      const filePath = `uploads/${document.filename}`;
      
      // Perform AI analysis
      const analysis = await analyzeIEPDocument(filePath, document.type);
      
      // Store analysis results in database
      try {
        await storage.saveDocumentAnalysis(id, analysis);
      } catch (error) {
        console.error('Failed to save analysis results:', error);
      }
      
      res.json({
        documentId: id,
        documentName: document.originalName,
        analysis
      });
      
    } catch (error: any) {
      console.error('Document analysis error:', error);
      res.status(500).json({ 
        message: 'Analysis failed', 
        error: error.message 
      });
    }
  });

  // Download document route
  app.get("/api/documents/:id/download", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      // Get document details
      const documents = await storage.getDocumentsByUserId(user.id);
      const document = documents.find((doc: any) => doc.id === id);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      // Construct full file path
      const filePath = path.join(process.cwd(), 'uploads', document.filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on disk' });
      }
      
      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error: any) {
      console.error('Document download error:', error);
      res.status(500).json({ message: 'Download failed', error: error.message });
    }
  });

  // Update document name route
  app.patch("/api/documents/:id/name", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { displayName } = req.body;
      const user = req.user as any;
      
      if (!displayName?.trim()) {
        return res.status(400).json({ message: 'Display name is required' });
      }

      // Check if document belongs to user
      const documents = await storage.getDocumentsByUserId(user.id);
      const document = documents.find((doc: any) => doc.id === id);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      const updatedDocument = await storage.updateDocumentName(id, displayName.trim());
      res.json(updatedDocument);
    } catch (error: any) {
      console.error('Document name update error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Download document route
  app.get("/api/documents/:id/download", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      // Check if document belongs to user
      const documents = await storage.getDocumentsByUserId(user.id);
      const document = documents.find((doc: any) => doc.id === id);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      const filePath = path.join('uploads', document.filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
      }

      // Set appropriate headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error: any) {
      console.error('Document download error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // AI Goal Generation route
  app.post("/api/generate-goals", requireAuth, async (req, res) => {
    try {
      const { area, studentInfo, needs } = req.body;
      
      // Support both simple area-based generation and detailed studentInfo/needs
      if (area && typeof area === 'string') {
        // Simple area-based generation for parent dashboard
        const goals = await generateIEPGoalsFromArea(area);
        return res.json({ goals });
      }
      
      if (!studentInfo || !Array.isArray(needs)) {
        return res.status(400).json({ 
          message: 'Missing required fields: either "area" or "studentInfo and needs array"' 
        });
      }
      
      const goals = await generateIEPGoals(studentInfo, needs);
      
      res.json({ goals });
      
    } catch (error: any) {
      console.error('Goal generation error:', error);
      res.status(500).json({ 
        message: 'Goal generation failed', 
        error: error.message 
      });
    }
  });

  // AI IEP Review route
  app.post("/api/review-iep", requireAuth, upload.single('file'), async (req, res) => {
    try {
      const user = req.user as any;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      console.log(`📋 Analyzing IEP document: ${req.file.originalname}`);
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY not found in environment");
        return res.status(503).json({ 
          message: "AI service temporarily unavailable. Please ensure OPENAI_API_KEY is configured.", 
          error: "OpenAI API key not configured" 
        });
      }
      
      // Construct full file path
      const filePath = `uploads/${req.file.filename}`;
      
      // Perform comprehensive IEP analysis
      const analysis = await analyzeIEPDocument(filePath, 'iep');
      
      // Transform the analysis into the expected format for the frontend
      const reviewResult = {
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.improvements, // Map improvements to weaknesses
        recommendations: analysis.nextSteps,
        complianceScore: Math.round((analysis.complianceCheck.ideaCompliance + analysis.complianceCheck.stateCompliance) / 2)
      };

      // Log the analysis for record keeping
      console.log(`✅ IEP analysis completed for ${req.file.originalname}:`, {
        overallScore: analysis.overallScore,
        complianceScore: reviewResult.complianceScore,
        priority: analysis.priority
      });
      
      res.json(reviewResult);
      
    } catch (error: any) {
      console.error('IEP review error:', error);
      res.status(500).json({ 
        message: 'IEP analysis failed', 
        error: error.message 
      });
    }
  });

  // Events routes
  app.get("/api/events", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const events = await storage.getEventsByUserId(user.id);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(user.id, eventData);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Messages routes
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const messages = await storage.getMessagesByUserId(user.id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markMessageAsRead(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all users for chat (filtered to remove sensitive data)
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Only return safe user data for chat
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        planStatus: user.planStatus
      }));
      res.json(safeUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Memory Query route for AI-powered IEP questions
  app.post("/api/memory-query", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { prompt } = req.body;
      
      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Get user's IEP data for context
      const goals = await storage.getGoalsByUserId(user.id);
      const documents = await storage.getDocumentsByUserId(user.id);
      const events = await storage.getEventsByUserId(user.id);

      // Build context from user's IEP data
      const context = {
        goals: goals.map(g => ({
          title: g.title,
          description: g.description,
          status: g.status,
          progress: g.progress,
          dueDate: g.dueDate
        })),
        documentsCount: documents.length,
        upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
        totalEvents: events.length
      };

      // Simple AI response based on context
      let answer = generateIEPResponse(prompt, context);

      res.json({ answer });
    } catch (error: any) {
      console.error("Memory query error:", error);
      res.status(500).json({ error: "Failed to query memory" });
    }
  });

  // Ask AI About Docs endpoint - Hero Plan feature
  app.post("/api/ask-docs", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { mode, docId, question } = req.body;
      
      // Check Hero Plan access
      let planStatus = user.planStatus || user.subscriptionTier || 'free';
      if (user.email === 'parent@demo.com' || user.email === 'demo_parent@demo.com') {
        planStatus = 'heroOffer';
      }
      
      if (planStatus !== 'heroOffer') {
        return res.status(403).json({ 
          error: 'This feature requires a Hero Plan subscription. Please upgrade to access AI document analysis.' 
        });
      }
      
      if (!question || question.trim().length === 0) {
        return res.status(400).json({ error: "Question is required" });
      }
      
      // Get user's documents for context
      const documents = await storage.getDocumentsByUserId(user.id);
      
      let documentContext = "";
      
      if (mode === "single" && docId) {
        const selectedDoc = documents.find((doc: any) => doc.id === docId);
        if (!selectedDoc) {
          return res.status(404).json({ error: "Document not found" });
        }
        documentContext = `Analyzing document: "${selectedDoc.originalName}" (${selectedDoc.type})\n\nDocument content: [IEP document with goals, accommodations, and student information]`;
      } else {
        // All documents mode
        documentContext = `Analyzing all ${documents.length} documents:\n` + 
          documents.map((doc: any, index: number) => 
            `${index + 1}. "${doc.originalName}" (${doc.type})`
          ).join('\n') + 
          '\n\nCombined document content: [Multiple IEP documents with comprehensive goals, accommodations, progress reports, and student assessments]';
      }
      
      // Use OpenAI for intelligent analysis
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const prompt = `You are an expert IEP (Individualized Education Program) analyst helping parents understand their child's educational documentation.

${documentContext}

User Question: ${question}

Please provide a helpful, detailed answer about the IEP documents. Focus on:
- Current goals and objectives
- Accommodations and modifications
- Progress tracking
- Areas of need or strength
- Next steps or recommendations

Be supportive and parent-friendly in your language while maintaining accuracy.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert IEP analyst providing supportive guidance to parents. Always be encouraging while providing accurate, actionable information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const answer = response.choices[0].message.content || "I'm unable to analyze the documents at this time. Please try again.";
      
      res.json({ answer });
      
    } catch (error: any) {
      console.error('Ask docs error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze documents. Please try again.' 
      });
    }
  });

  // Register share memory routes
  registerShareMemoryRoutes(app);
  
  // Register test routes
  registerTestMemoryRoutes(app);

  // Register student management routes
  app.use("/api/students", requireAuth, studentsRoutes);
  
  // Register advocate client management routes
  app.use("/api/advocate/clients", requireAuth, advocateClientsRoutes);
  
  // Advocate students endpoint - get students assigned to this advocate
  app.get("/api/advocate/students", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      if (user.role !== 'advocate') {
        return res.status(403).json({ message: 'Access denied: Advocates only' });
      }
      
      const students = await storage.getStudentsByAdvocateId(user.id);
      res.json(students);
    } catch (error: any) {
      console.error('Error fetching advocate students:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Serve uploaded files
  app.use('/uploads', requireAuth, (req, res, next) => {
    // Add file access control here if needed
    next();
  });

  // AI IEP Analysis endpoint
  app.post("/api/analyze-iep", requireAuth, async (req, res) => {
    try {
      const { content } = req.body;
      const user = req.user as any;
      
      // MVP Testing: Allow all users to access Hero features
      // if (user.planStatus !== 'heroOffer') {
      //   return res.status(403).json({ 
      //     error: "IEP Analysis is a Hero Plan exclusive feature. Please upgrade to access this tool." 
      //   });
      // }

      if (!content || content.trim().length < 100) {
        return res.status(400).json({ 
          error: "Please provide a substantial IEP document for analysis (minimum 100 characters)." 
        });
      }

      // Simulate AI analysis with structured response
      const analysisResult = await analyzeIEPWithAI(content);
      
      res.json(analysisResult);
    } catch (error: any) {
      console.error("IEP Analysis error:", error);
      res.status(500).json({ error: "Analysis failed. Please try again." });
    }
  });

  // Add Ask AI Docs endpoint
  app.post("/api/ask-docs", requireAuth, async (req, res) => {
    const { mode, docId, question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (mode === 'single' && !docId) {
      return res.status(400).json({ message: "Document ID is required for single mode" });
    }

    try {
      let text = '';

      if (mode === 'single') {
        // For single document mode, get the specific document
        const user = req.user as any;
        const documents = await storage.getDocumentsByUserId(user.id);
        const document = documents.find(doc => doc.id === docId);
        
        if (!document) {
          return res.status(404).json({ message: "Document not found" });
        }

        // In a real implementation, you would parse the document content
        // For now, we'll use a placeholder
        text = `Document: ${document.originalName}\nContent: This is placeholder content for the document. In a real implementation, this would be the actual parsed content from the uploaded file.`;
      } else {
        // For all documents mode, get all user documents
        const user = req.user as any;
        const documents = await storage.getDocumentsByUserId(user.id);
        
        if (documents.length === 0) {
          return res.status(400).json({ message: "No documents found. Please upload some documents first." });
        }

        // Combine all document content
        text = documents.map(doc => 
          `Document: ${doc.originalName}\nContent: This is placeholder content for ${doc.originalName}. In a real implementation, this would be the actual parsed content from the uploaded file.`
        ).join('\n---\n');
      }

      // Use OpenAI to analyze the documents and answer the question
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const prompt = `Answer this question based on the IEP documents below:

Question: ${question}

Documents:
${text}

Please provide a helpful, accurate answer based on the document content. If the information isn't available in the documents, please say so clearly.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const answer = response.choices[0].message.content;
      res.json({ answer });
    } catch (error: any) {
      console.error("Ask AI Docs error:", error);
      res.status(500).json({ 
        message: "Failed to analyze documents", 
        error: error.message 
      });
    }
  });

  // Smart Letter Generator route
  app.post("/api/generate-letter", requireAuth, async (req, res) => {
    try {
      const { templateId, templateTitle, formData } = req.body;
      
      if (!templateId || !templateTitle || !formData) {
        return res.status(400).json({ 
          message: 'Missing required fields: templateId, templateTitle, and formData' 
        });
      }

      // Use OpenAI to generate the letter
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const letterPrompt = generateLetterPrompt(templateId, templateTitle, formData);
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: 'user', content: letterPrompt }],
        temperature: 0.3, // Lower temperature for more consistent, formal output
        max_tokens: 1500
      });

      const letter = response.choices[0].message.content;
      res.json({ letter });
      
    } catch (error: any) {
      console.error('Letter generation error:', error);
      res.status(500).json({ 
        message: 'Letter generation failed', 
        error: error.message 
      });
    }
  });

  // Advocacy Report Generator API endpoint
  app.post("/api/generate-advocacy-report", requireAuth, async (req, res) => {
    try {
      const { studentName, gradeLevel, disability, currentServices, concerns, requestedAction, reportType, timeline, additionalInfo } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: "AI service temporarily unavailable. Please ensure OPENAI_API_KEY is configured." 
        });
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `
Generate a comprehensive advocacy report for an IEP student with the following information:

STUDENT INFORMATION:
- Name: ${studentName}
- Grade Level: ${gradeLevel}
- Primary Disability: ${disability}
- Current IEP Services: ${currentServices}

ADVOCACY REQUEST:
- Primary Concerns: ${concerns}
- Requested Action: ${requestedAction}
- Report Type: ${reportType}
- Timeline Priority: ${timeline}
- Additional Information: ${additionalInfo}

Create a professional advocacy report that includes:

1. EXECUTIVE SUMMARY
   - Brief overview of student needs and requested actions
   - Key concerns requiring immediate attention

2. STUDENT PROFILE & CURRENT STATUS
   - Educational background and current placement
   - Disability impact on learning
   - Current IEP services and effectiveness

3. AREAS OF CONCERN
   - Detailed analysis of identified issues
   - Evidence and documentation references
   - Impact on student's educational progress

4. LEGAL FRAMEWORK & RIGHTS
   - Relevant IDEA provisions
   - Section 504 considerations
   - State-specific regulations (if applicable)

5. RECOMMENDED ACTIONS
   - Specific, measurable requests
   - Timeline for implementation
   - Expected outcomes

6. SUPPORTING DOCUMENTATION
   - List of required documents
   - Evaluation recommendations
   - Data collection suggestions

7. NEXT STEPS
   - Meeting requests
   - Follow-up timeline
   - Escalation procedures if needed

Format this as a professional document suitable for school district communication, legal proceedings, or IEP team meetings. Use clear, authoritative language while maintaining a collaborative tone. Include specific legal references where appropriate.

The report should be comprehensive yet concise, approximately 2-3 pages when printed.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert IEP advocate and special education attorney. Generate professional advocacy reports that are legally sound, evidence-based, and effective for protecting student rights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const report = completion.choices[0]?.message?.content || "Failed to generate report";

      res.json({ 
        success: true, 
        report: report,
        metadata: {
          studentName,
          reportType,
          timeline,
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('Advocacy report generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to generate advocacy report" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// AI-powered IEP document analysis function
async function analyzeIEPWithAI(content: string): Promise<any> {
  const lowerContent = content.toLowerCase();
  
  // Analyze content for key IEP components
  const hasGoals = lowerContent.includes('goal') || lowerContent.includes('objective');
  const hasServices = lowerContent.includes('service') || lowerContent.includes('therapy');
  const hasAccommodations = lowerContent.includes('accommodation') || lowerContent.includes('modification');
  const hasTransition = lowerContent.includes('transition') || lowerContent.includes('post-secondary');
  const hasMeasurement = lowerContent.includes('progress') || lowerContent.includes('data') || lowerContent.includes('measure');
  
  // Calculate overall score based on components
  let score = 0;
  const components = [hasGoals, hasServices, hasAccommodations, hasTransition, hasMeasurement];
  score = Math.round((components.filter(Boolean).length / components.length) * 100);
  
  // Generate dynamic analysis based on content
  const strengths = [];
  const improvements = [];
  const recommendations = [];
  const nextSteps = [];
  
  if (hasGoals) {
    strengths.push("Clear goals and objectives are present");
    strengths.push("Measurable targets have been established");
  } else {
    improvements.push("Goals need to be more specific and measurable");
    recommendations.push("Define SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)");
  }
  
  if (hasServices) {
    strengths.push("Appropriate services are documented");
  } else {
    improvements.push("Service provision needs clarification");
    recommendations.push("Specify frequency and duration of special education services");
  }
  
  if (hasAccommodations) {
    strengths.push("Accommodations are appropriately documented");
  } else {
    improvements.push("Accommodations should be more comprehensive");
    recommendations.push("Consider additional classroom and testing accommodations");
  }
  
  if (hasTransition) {
    strengths.push("Transition planning is included");
  } else if (lowerContent.includes('age') && (lowerContent.includes('14') || lowerContent.includes('16'))) {
    improvements.push("Transition services planning is required");
    recommendations.push("Develop post-secondary transition goals and services");
  }
  
  if (hasMeasurement) {
    strengths.push("Progress monitoring methods are defined");
  } else {
    improvements.push("Progress measurement criteria need enhancement");
    recommendations.push("Establish clear data collection methods and timelines");
  }
  
  // Add general recommendations
  nextSteps.push("Schedule team meeting to discuss analysis findings");
  nextSteps.push("Evaluate need for additional assessments");
  nextSteps.push("Update parent communication plan");
  nextSteps.push("Monitor progress toward goals monthly");
  
  return {
    overallScore: Math.max(score, 45), // Minimum score for demonstration
    strengthsCount: strengths.length,
    improvementsCount: improvements.length,
    strengths,
    improvements,
    recommendations,
    nextSteps
  };
}

// Generate prompts for different letter types
function generateLetterPrompt(templateId: string, templateTitle: string, formData: any): string {
  const currentDate = new Date().toLocaleDateString();
  
  const basePrompt = `You are a professional advocate helping parents write formal, legally appropriate letters for IEP-related matters. 

Generate a professional, formal letter with the following requirements:
- Use proper business letter format with today's date (${currentDate})
- Include appropriate legal language and references to IDEA (Individuals with Disabilities Education Act) when relevant
- Be respectful but assertive in tone
- Include specific requests and timelines where appropriate
- End with professional closing and space for signature

Letter Type: ${templateTitle}
`;

  switch (templateId) {
    case 'iep-evaluation':
      return `${basePrompt}

Generate a formal letter requesting a comprehensive special education evaluation for my child ${formData.childName} at ${formData.schoolName}. Include references to IDEA, the parent's right to request an evaluation, and the need to address concerns about ${formData.concerns}. Use a professional but assertive tone.`;

    case 'fba-request':
      return `${basePrompt}

Create a letter requesting a Functional Behavior Assessment (FBA) for my child ${formData.childName} at ${formData.schoolName}. State that the child is exhibiting ${formData.behaviors} and that a formal behavior assessment is necessary to create a Behavior Intervention Plan. Cite IDEA provisions and request a written response within 10 school days.`;

    case 'progress-data':
      return `${basePrompt}

Write a professional letter requesting all available progress monitoring data and service records for my child ${formData.childName} related to their IEP goals. Ask for updates including frequency, method of data collection, and a timeline of services provided. Reference that this information is part of the parent's rights under IDEA.`;

    case 'dispute-complaint':
      return `${basePrompt}

Create a formal letter expressing concern about the school's failure to ${formData.issue} for my child ${formData.childName} at ${formData.schoolName}. State that this is a potential violation of the IEP and request a resolution meeting to address the issue. Use clear, factual language and request a written response.`;

    case 'pwn-response':
      return `${basePrompt}

Generate a parent response to a Prior Written Notice from ${formData.schoolName}. Acknowledge receipt, and clearly state that I disagree with the proposed action to ${formData.proposedAction} for my child ${formData.childName}. Request a meeting to discuss alternatives and formally note that I do not consent to this change at this time.`;

    case 'iep-meeting':
      return `${basePrompt}

Write a formal letter requesting an IEP meeting for my child ${formData.childName} at ${formData.schoolName}. State that new concerns have emerged regarding ${formData.concerns}, and I am requesting a team meeting to discuss possible updates to the IEP. Reference IDEA timelines and request a meeting within 10 school days.`;

    case 'parent-concerns':
      return `${basePrompt}

Draft a parent input statement to be attached to my child's IEP for ${formData.childName} at ${formData.schoolName}. It should outline my concerns about ${formData.specificAreas}, my hopes for the IEP team, and specific requests or suggestions I believe should be considered. Tone should be collaborative, but clear.`;

    case '504-request':
      return `${basePrompt}

Create a formal letter requesting a Section 504 Plan evaluation for my child ${formData.childName} at ${formData.schoolName}. Explain that my child has a documented diagnosis of ${formData.diagnosis} which substantially limits major life activities. Request a meeting to begin the evaluation process and determine eligibility for accommodations.`;

    case 'service-check':
      return `${basePrompt}

Write a follow-up letter asking for confirmation that all IEP services and supports for my child ${formData.childName} at ${formData.schoolName} are being implemented as written. Ask for a service delivery log or confirmation from relevant staff. Reference the school's obligation under IDEA to provide services with fidelity and transparency.`;

    case 'observation-request':
      return `${basePrompt}

Draft a respectful letter requesting an in-person observation of my child ${formData.childName} in the classroom and/or during services at ${formData.schoolName}. State that the observation will help inform my understanding of my child's needs and participation in the current environment. ${formData.availability ? `Include dates of availability: ${formData.availability}.` : ''} Request guidance on visitor policies if needed.`;

    default:
      return `${basePrompt}

Create a professional advocacy letter using the provided information and appropriate legal references for IEP-related matters.`;
  }
}

// Simple AI response generator for IEP queries
function generateIEPResponse(prompt: string, context: any): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('goal') || lowerPrompt.includes('progress')) {
    if (context.goals.length === 0) {
      return "You don't have any IEP goals recorded yet. You can add goals using the Goals section to track your child's progress.";
    }
    
    const inProgressGoals = context.goals.filter((g: any) => g.status === "In Progress");
    const completedGoals = context.goals.filter((g: any) => g.status === "Completed");
    
    return `You have ${context.goals.length} IEP goals total. ${completedGoals.length} are completed and ${inProgressGoals.length} are in progress. 

Your current goals include:
${context.goals.slice(0, 3).map((g: any) => `• ${g.title} (${g.status} - ${g.progress}% complete)`).join('\n')}

The next due date is ${context.goals.length > 0 ? new Date(context.goals[0].dueDate).toLocaleDateString() : 'not set'}.`;
  }
  
  if (lowerPrompt.includes('service') || lowerPrompt.includes('accommodation')) {
    return "Your IEP services and accommodations are detailed in your uploaded documents. You currently have " + 
           context.documentsCount + " documents on file. Please review your IEP document for specific services, " +
           "accommodations, and modifications provided to support your child's learning.";
  }
  
  if (lowerPrompt.includes('meeting') || lowerPrompt.includes('schedule')) {
    return `You have ${context.upcomingEvents} upcoming events scheduled. Regular IEP meetings typically occur annually, ` +
           "but you can request additional meetings if needed. Check your Events section for specific meeting dates and details.";
  }
  
  if (lowerPrompt.includes('team') || lowerPrompt.includes('member')) {
    return "Your IEP team typically includes general education teachers, special education teachers, school psychologist, " +
           "and related service providers. The specific team members are listed in your IEP document. You can also " +
           "communicate with team members through the Messages section.";
  }
  
  if (lowerPrompt.includes('document') || lowerPrompt.includes('file')) {
    return `You have ${context.documentsCount} documents uploaded to your account. These may include IEP documents, ` +
           "assessments, progress reports, and meeting notes. You can view and manage these in the Documents section.";
  }
  
  // Default response
  return `Based on your current IEP data: You have ${context.goals.length} goals (${context.goals.filter((g: any) => g.status === "Completed").length} completed), ` +
         `${context.documentsCount} documents, and ${context.upcomingEvents} upcoming events. ` +
         "For specific questions about services, accommodations, or team members, please refer to your IEP document or contact your school team.";
}
