import { Router } from "express";
import { storage } from "../storage";
import { insertAdvocateClientSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Get all clients for the authenticated advocate
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || req.user?.role !== 'advocate') {
      return res.status(401).json({ error: "Advocate authentication required" });
    }

    const clients = await storage.getAdvocateClientsByAdvocateId(userId);
    
    // Enhance the response with parent and student information
    const enhancedClients = await Promise.all(
      clients.map(async (client) => {
        const parent = await storage.getUser(client.parentId);
        const students = await storage.getStudentsByParentId(client.parentId);
        
        return {
          ...client,
          parent: parent ? {
            id: parent.id,
            email: parent.email,
            username: parent.username
          } : null,
          students: students || []
        };
      })
    );

    return res.json(enhancedClients);
  } catch (error) {
    console.error("Error fetching advocate clients:", error);
    return res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// Get client relationships for a parent
router.get("/parent", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const clients = await storage.getAdvocateClientsByParentId(userId);
    
    // Enhance with advocate information
    const enhancedClients = await Promise.all(
      clients.map(async (client) => {
        const advocate = await storage.getUser(client.advocateId);
        
        return {
          ...client,
          advocate: advocate ? {
            id: advocate.id,
            email: advocate.email,
            username: advocate.username
          } : null
        };
      })
    );

    return res.json(enhancedClients);
  } catch (error) {
    console.error("Error fetching parent advocate relationships:", error);
    return res.status(500).json({ error: "Failed to fetch relationships" });
  }
});

// Create new advocate-client relationship
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Only advocates or system admins can create relationships
    if (req.user?.role !== 'advocate' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: "Permission denied" });
    }

    // Validate the request body
    const validatedData = insertAdvocateClientSchema.parse({
      ...req.body,
      advocateId: userId
    });

    const client = await storage.createAdvocateClient(validatedData);
    return res.status(201).json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid client data", details: error.errors });
    }
    console.error("Error creating advocate client:", error);
    return res.status(500).json({ error: "Failed to create client relationship" });
  }
});

// Update advocate-client relationship
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const clientId = req.params.id;
    
    if (!userId || req.user?.role !== 'advocate') {
      return res.status(401).json({ error: "Advocate authentication required" });
    }

    // Validate the request body
    const validatedData = insertAdvocateClientSchema
      .omit({ advocateId: true, parentId: true })
      .parse(req.body);

    const updatedClient = await storage.updateAdvocateClient(clientId, validatedData);
    return res.json(updatedClient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid client data", details: error.errors });
    }
    console.error("Error updating advocate client:", error);
    return res.status(500).json({ error: "Failed to update client relationship" });
  }
});

// Delete advocate-client relationship
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const clientId = req.params.id;
    
    if (!userId || req.user?.role !== 'advocate') {
      return res.status(401).json({ error: "Advocate authentication required" });
    }

    await storage.deleteAdvocateClient(clientId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting advocate client:", error);
    return res.status(500).json({ error: "Failed to delete client relationship" });
  }
});

export default router;