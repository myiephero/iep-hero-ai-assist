import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { registerShareMemoryRoutes } from "./routes/share-memory";
import { registerTestMemoryRoutes } from "./routes/test-memory";
import { insertUserSchema, insertGoalSchema, insertDocumentSchema, insertEventSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { analyzeIEPDocument, generateIEPGoals, generateIEPGoalsFromArea } from "./ai-document-analyzer";

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
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'iep-hero-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
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
        res.json({ 
          user: { 
            id: user.id, 
            email: user.email, 
            username: user.username, 
            role: user.role,
            planStatus: user.subscriptionTier || user.planStatus || 'heroOffer',
            subscriptionTier: user.subscriptionTier || 'heroOffer'
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

  app.get("/api/me", requireAuth, (req, res) => {
    const user = req.user as any;
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        role: user.role, 
        subscriptionTier: user.subscriptionTier,
        planStatus: user.subscriptionTier || user.planStatus || 'free'
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

  app.post("/api/documents", requireAuth, upload.single('file'), async (req, res) => {
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

  // Register share memory routes
  registerShareMemoryRoutes(app);
  
  // Register test routes
  registerTestMemoryRoutes(app);

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
