import { Router } from "express";
import { storage } from "../storage";
import { insertStudentSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Get all students for the authenticated user (parent)
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const students = await storage.getStudentsByParentId(userId);
    return res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Get students assigned to advocate
router.get("/advocate", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || req.user?.role !== 'advocate') {
      return res.status(401).json({ error: "Advocate authentication required" });
    }

    const students = await storage.getStudentsByAdvocateId(userId);
    return res.json(students);
  } catch (error) {
    console.error("Error fetching advocate students:", error);
    return res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Create new student
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate the request body
    const validatedData = insertStudentSchema.parse({
      ...req.body,
      parentId: userId
    });

    const student = await storage.createStudent(validatedData);
    return res.status(201).json(student);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid student data", details: error.errors });
    }
    console.error("Error creating student:", error);
    return res.status(500).json({ error: "Failed to create student" });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const studentId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate the request body (exclude parentId from updates)
    const validatedData = insertStudentSchema.omit({ parentId: true }).parse(req.body);

    const updatedStudent = await storage.updateStudent(studentId, validatedData);
    return res.json(updatedStudent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid student data", details: error.errors });
    }
    console.error("Error updating student:", error);
    return res.status(500).json({ error: "Failed to update student" });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const studentId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await storage.deleteStudent(studentId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).json({ error: "Failed to delete student" });
  }
});

// Get documents for a specific student
router.get("/:id/documents", async (req, res) => {
  try {
    const userId = req.user?.id;
    const studentId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const documents = await storage.getDocumentsByStudentId(studentId);
    return res.json(documents);
  } catch (error) {
    console.error("Error fetching student documents:", error);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
});

export default router;