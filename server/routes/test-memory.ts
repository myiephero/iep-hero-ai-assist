import type { Express } from "express";
import { storage } from "../storage";
import { insertSharedMemorySchema } from "@shared/schema";

// Mock AI Service for testing with validation
const mockAIService = {
  queryIEPMemory: async (userId: string, prompt: string): Promise<string> => {
    console.log(`[TEST] Mock AI Query - UserId: ${userId}, Prompt: ${prompt}`);
    
    // Simulate different AI responses based on prompt
    const responses = {
      "invalid": "This is not a valid IEP response without required keywords.",
      "services": "The IEP includes speech, OT, and PT services.",
      "goals": "The student has academic goals in reading comprehension and math problem solving.",
      "accommodations": "Accommodations include extended time and preferential seating.",
      "mixed": "The IEP outlines specific goals for reading and provides services like speech therapy."
    };
    
    // Return specific response based on prompt content
    if (prompt.toLowerCase().includes("invalid")) return responses.invalid;
    if (prompt.toLowerCase().includes("goals")) return responses.goals;
    if (prompt.toLowerCase().includes("accommodations")) return responses.accommodations;
    if (prompt.toLowerCase().includes("mixed")) return responses.mixed;
    
    return responses.services; // Default response
  }
};

// AI Output Validation Function
function validateAIOutput(aiResponse: string): { isValid: boolean; reason?: string } {
  const requiredKeywords = ["services", "goals", "accommodations"];
  const hasRequiredKeyword = requiredKeywords.some(keyword => 
    aiResponse.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasRequiredKeyword) {
    return {
      isValid: false,
      reason: `AI response must contain at least one of: ${requiredKeywords.join(", ")}`
    };
  }
  
  return { isValid: true };
}

// In-memory storage for duplicate prevention (60-second window)
const recentQueries = new Map<string, { timestamp: number; question: string }>();

function checkForDuplicate(userId: string, question: string): boolean {
  const key = `${userId}:${question.toLowerCase().trim()}`;
  const existing = recentQueries.get(key);
  const now = Date.now();
  
  if (existing && (now - existing.timestamp) < 60000) { // 60 seconds
    console.log(`[TEST] Duplicate question detected within 60 seconds for user ${userId}`);
    return true;
  }
  
  // Clean up old entries and add new one
  recentQueries.set(key, { timestamp: now, question });
  
  // Clean up entries older than 60 seconds
  for (const [mapKey, value] of recentQueries.entries()) {
    if (now - value.timestamp > 60000) {
      recentQueries.delete(mapKey);
    }
  }
  
  return false;
}

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

      // Validate AI output format
      const validation = validateAIOutput(aiAnswer);
      console.log(`[TEST] AI Validation:`, validation);

      if (!validation.isValid) {
        return res.status(400).json({
          error: "Invalid AI response",
          reason: validation.reason,
          aiAnswer,
          timestamp: new Date().toISOString()
        });
      }

      let sharedMemory = null;
      let shareSuccess = false;
      let duplicateDetected = false;

      // If sharing is enabled, check for duplicates and save to database
      if (share === true) {
        // Check for duplicate within 60 seconds
        duplicateDetected = checkForDuplicate(userId, prompt);
        
        if (duplicateDetected) {
          console.log(`[TEST] Duplicate prevention: Skipping database insert for duplicate question`);
          shareSuccess = false;
        } else {
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
      }

      // Return comprehensive test results
      const response = {
        success: true,
        aiAnswer,
        validation: {
          isValid: validation.isValid,
          reason: validation.reason
        },
        sharing: {
          requested: share === true,
          successful: shareSuccess,
          duplicateDetected,
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
          storageType: "memory", // Using in-memory storage for testing
          duplicateWindow: "60 seconds"
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
      console.log(`[TEST] Retrieving all shared memories...`);
      
      res.json({
        message: "Shared memories endpoint - would query database in production",
        storageType: "memory",
        note: "In production, this would query Supabase shared_answers table",
        recentQueries: Array.from(recentQueries.entries()).map(([key, value]) => ({
          key,
          question: value.question,
          timestamp: new Date(value.timestamp).toISOString(),
          secondsAgo: Math.floor((Date.now() - value.timestamp) / 1000)
        }))
      });

    } catch (error: any) {
      console.error(`[TEST] Error retrieving shared memories:`, error);
      res.status(500).json({ error: "Failed to retrieve shared memories" });
    }
  });

  // Test route for validation scenarios
  app.post("/api/test-validation", async (req, res) => {
    try {
      const { testType } = req.body;
      
      const testCases = {
        "valid-services": "What services are included?",
        "valid-goals": "What goals are set?", 
        "valid-accommodations": "What accommodations are provided?",
        "valid-mixed": "What mixed content is available?",
        "invalid": "Tell me about invalid content."
      };

      const prompt = testCases[testType as keyof typeof testCases] || testCases["valid-services"];
      const aiAnswer = await mockAIService.queryIEPMemory("test-validation-user", prompt);
      const validation = validateAIOutput(aiAnswer);

      res.json({
        testType,
        prompt,
        aiAnswer,
        validation,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error(`[TEST] Validation test error:`, error);
      res.status(500).json({ error: "Validation test failed" });
    }
  });
}