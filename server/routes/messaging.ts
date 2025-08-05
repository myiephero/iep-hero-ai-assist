import type { Express } from "express";
// For development, we'll use the existing database setup
import { storage } from "../storage";

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

export function registerMessagingRoutes(app: Express) {
  // Get conversations for current user
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      
      // For demo, create a mock conversation between parent and advocate
      const demoConversations = [
        {
          id: 'demo-conversation-1',
          parent_id: user.role === 'parent' ? user.id : 'demo-advocate-id',
          advocate_id: user.role === 'advocate' ? user.id : 'demo-parent-id',
          last_message_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          otherUserName: user.role === 'parent' ? 'Sarah Johnson (Advocate)' : 'Michael Brown (Parent)',
          otherUserRole: user.role === 'parent' ? 'advocate' : 'parent',
          lastMessage: 'Thanks for the IEP guidance. When should we schedule the next meeting?',
          unreadCount: user.role === 'parent' ? 1 : 0
        }
      ];

      res.json(demoConversations);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:conversationId/messages", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { conversationId } = req.params;

      // For demo, return mock messages
      const demoMessages = [
        {
          id: 'msg-1',
          sender_id: user.role === 'parent' ? user.id : 'demo-advocate-id',
          receiver_id: user.role === 'parent' ? 'demo-advocate-id' : user.id,
          content: 'Hi! I just generated some IEP goals for my child and would love some guidance on the next steps.',
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          is_read: true,
          senderName: user.role === 'parent' ? user.username : 'Sarah Johnson',
          senderRole: 'parent'
        },
        {
          id: 'msg-2',
          sender_id: user.role === 'advocate' ? user.id : 'demo-parent-id',
          receiver_id: user.role === 'advocate' ? 'demo-parent-id' : user.id,
          content: 'Hello! I\'d be happy to help you with your IEP process. What specific areas would you like to focus on?',
          created_at: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
          is_read: true,
          senderName: user.role === 'advocate' ? user.username : 'Michael Brown',
          senderRole: 'advocate'
        },
        {
          id: 'msg-3',
          sender_id: user.role === 'parent' ? user.id : 'demo-advocate-id',
          receiver_id: user.role === 'parent' ? 'demo-advocate-id' : user.id,
          content: 'My child has autism and needs support with social communication. The generated goals look good but I\'m not sure how to present them at the IEP meeting.',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          is_read: false,
          senderName: user.role === 'parent' ? user.username : 'Sarah Johnson',
          senderRole: 'parent'
        }
      ];

      res.json(demoMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Send a message
  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { receiver_id, content } = req.body;

      if (!receiver_id || !content?.trim()) {
        return res.status(400).json({ error: 'Receiver ID and content are required' });
      }

      // For demo, simulate message creation
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender_id: user.id,
        receiver_id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
        senderName: user.username,
        senderRole: user.role
      };

      console.log('Demo message sent:', newMessage);

      res.json({ success: true, message: newMessage });
    } catch (error: any) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Mark messages as read
  app.put("/api/messages/:conversationId/read", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const { conversationId } = req.params;

      // For demo, simulate marking messages as read
      console.log(`Demo: Messages marked as read for user ${user.id} in conversation ${conversationId}`);

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ error: error.message });
    }
  });
}