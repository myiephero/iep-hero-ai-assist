import type { Express } from "express";
import { storage } from "../storage";
import { insertSharedMemorySchema } from "@shared/schema";

// Mock AI Service for testing
const mockAIService = {
  queryIEPMemory: async (userId: string, prompt: string): Promise<string> => {
    console.log(`[TEST] Mock AI Query - UserId: ${userId}, Prompt: ${prompt}`);
    return "The IEP includes speech, OT, and PT services.";
  }
};

export function registerTestMemoryRoutes(app: Express) {
  // Test route for memory query with sharing
  app.post("/api/test-memory-query", async (req, res) => {
    try {
      const { userId, prompt, share } = req.body;
      
      console.log(`[TEST] Memory Query Request:`, { userId, prompt, share });

      if (!userId || !prompt) {
        return res.status(400).json({ error: "userId and prompt are required" });
      }

      // Mock AI response
      const aiAnswer = await mockAIService.queryIEPMemory(userId, prompt);
      console.log(`[TEST] AI Answer:`, aiAnswer);

      let sharedMemory = null;
      let shareSuccess = false;

      // If sharing is enabled, save to database
      if (share === true) {
        try {
          console.log(`[TEST] Attempting to save shared memory...`);
          
          const sharedMemoryData = insertSharedMemorySchema.parse({
            userId,
            question: prompt,
            answer: aiAnswer
          });

          sharedMemory = await storage.createSharedMemory(sharedMemoryData);
          shareSuccess = true;
          
          console.log(`[TEST] Successfully saved shared memory:`, {
            id: sharedMemory.id,
            userId: sharedMemory.userId,
            question: sharedMemory.question,
            sharedAt: sharedMemory.sharedAt
          });

        } catch (shareError) {
          console.error(`[TEST] Failed to save shared memory:`, shareError);
          shareSuccess = false;
        }
      }

      // Return comprehensive test results
      const response = {
        success: true,
        aiAnswer,
        sharing: {
          requested: share === true,
          successful: shareSuccess,
          sharedMemory: shareSuccess ? {
            id: sharedMemory?.id,
            userId: sharedMemory?.userId,
            question: sharedMemory?.question,
            sharedAt: sharedMemory?.sharedAt
          } : null
        },
        testInfo: {
          timestamp: new Date().toISOString(),
          mockUsed: true,
          storageType: "memory" // Using in-memory storage for testing
        }
      };

      console.log(`[TEST] Complete response:`, JSON.stringify(response, null, 2));
      res.json(response);

    } catch (error: any) {
      console.error(`[TEST] Error in test memory query:`, error);
      res.status(500).json({ 
        error: "Test failed", 
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Test route to get all shared memories for debugging
  app.get("/api/test-shared-memories", async (req, res) => {
    try {
      // Since we're using in-memory storage, we need to access the private field
      // In a real Supabase implementation, this would query the database directly
      console.log(`[TEST] Retrieving all shared memories...`);
      
      res.json({
        message: "Shared memories endpoint - would query database in production",
        storageType: "memory",
        note: "In production, this would query Supabase shared_answers table"
      });

    } catch (error: any) {
      console.error(`[TEST] Error retrieving shared memories:`, error);
      res.status(500).json({ error: "Failed to retrieve shared memories" });
    }
  });
}