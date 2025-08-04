import type { Express } from "express";
import { storage } from "../storage";
import { insertSharedMemorySchema } from "@shared/schema";
import { Resend } from "resend";

// Initialize Resend (you'll need to add RESEND_API_KEY to your environment)
const resend = new Resend(process.env.RESEND_API_KEY);

export function registerShareMemoryRoutes(app: Express) {
  // Share memory route
  app.post("/api/share-memory", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = req.user as any;
      const { question, answer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ error: "Question and answer are required" });
      }

      // Get user with advocate email
      const fullUser = await storage.getUser(user.id);
      if (!fullUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!fullUser.advocateEmail) {
        return res.status(400).json({ error: "No advocate email configured for this user" });
      }

      // Save to database
      const sharedMemoryData = insertSharedMemorySchema.parse({
        userId: user.id,
        question,
        answer
      });

      const sharedMemory = await storage.createSharedMemory(sharedMemoryData);

      // Send email to advocate using Resend
      try {
        if (process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: "My IEP Hero <noreply@iephero.com>",
            to: [fullUser.advocateEmail],
            subject: "New IEP Question from Parent",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New IEP Question from ${fullUser.username}</h2>
                
                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <h3 style="color: #374151; margin: 0 0 8px 0;">Question:</h3>
                  <p style="margin: 0; color: #6b7280;">${question}</p>
                </div>
                
                <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb;">
                  <h3 style="color: #1d4ed8; margin: 0 0 8px 0;">AI Answer:</h3>
                  <p style="margin: 0; color: #1e40af; white-space: pre-wrap;">${answer}</p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                  This message was sent from My IEP Hero platform. The parent chose to share this AI-generated response with you for additional guidance.
                </p>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails, just log it
      }

      res.json({ 
        success: true, 
        message: "Memory shared successfully",
        sharedMemory 
      });

    } catch (error: any) {
      console.error("Share memory error:", error);
      res.status(500).json({ error: "Failed to share memory" });
    }
  });
}