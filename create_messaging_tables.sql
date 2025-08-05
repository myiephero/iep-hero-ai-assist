-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  advocate_id UUID NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, advocate_id)
);

-- Create typing_indicators table
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, conversation_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_parent ON conversations(parent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_advocate ON conversations(advocate_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_typing_user_conversation ON typing_indicators(user_id, conversation_id);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages table
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their received messages" ON messages;
CREATE POLICY "Users can update their received messages" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- RLS Policies for conversations table
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = advocate_id);

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = parent_id OR auth.uid() = advocate_id);

DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (auth.uid() = parent_id OR auth.uid() = advocate_id);

-- RLS Policies for typing_indicators table
DROP POLICY IF EXISTS "Users can manage their typing status" ON typing_indicators;
CREATE POLICY "Users can manage their typing status" ON typing_indicators
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view typing status in their conversations" ON typing_indicators;
CREATE POLICY "Users can view typing status in their conversations" ON typing_indicators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = typing_indicators.conversation_id 
      AND (conversations.parent_id = auth.uid() OR conversations.advocate_id = auth.uid())
    )
  );
