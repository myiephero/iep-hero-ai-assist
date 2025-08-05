const { execSync } = require('child_process');

// Create demo messaging data
async function setupDemoMessaging() {
  console.log('🔧 Setting up demo messaging data...');
  
  try {
    // Execute SQL to create tables and demo data
    const sql = `
      -- Create messages table if not exists
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL,
        receiver_id UUID NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        read_at TIMESTAMP WITH TIME ZONE,
        is_read BOOLEAN DEFAULT FALSE
      );

      -- Create conversations table if not exists
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        parent_id UUID NOT NULL,
        advocate_id UUID NOT NULL,
        last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(parent_id, advocate_id)
      );

      -- Get user IDs
      WITH user_ids AS (
        SELECT 
          id,
          email,
          role
        FROM users 
        WHERE email IN ('parent@demo.com', 'advocate@demo.com')
      )
      
      -- Insert demo conversation
      INSERT INTO conversations (parent_id, advocate_id, last_message_at)
      SELECT 
        (SELECT id FROM user_ids WHERE email = 'parent@demo.com') as parent_id,
        (SELECT id FROM user_ids WHERE email = 'advocate@demo.com') as advocate_id,
        NOW() - INTERVAL '1 hour'
      ON CONFLICT (parent_id, advocate_id) DO NOTHING;

      -- Insert demo messages
      WITH user_ids AS (
        SELECT 
          id,
          email
        FROM users 
        WHERE email IN ('parent@demo.com', 'advocate@demo.com')
      )
      INSERT INTO messages (sender_id, receiver_id, content, created_at, is_read)
      VALUES 
        (
          (SELECT id FROM user_ids WHERE email = 'parent@demo.com'),
          (SELECT id FROM user_ids WHERE email = 'advocate@demo.com'),
          'Hi! I just generated some IEP goals for my child and would love some guidance on the next steps.',
          NOW() - INTERVAL '2 hours',
          true
        ),
        (
          (SELECT id FROM user_ids WHERE email = 'advocate@demo.com'),
          (SELECT id FROM user_ids WHERE email = 'parent@demo.com'),
          'Hello! I''d be happy to help you with your IEP process. What specific areas would you like to focus on?',
          NOW() - INTERVAL '1 hour 30 minutes',
          true
        ),
        (
          (SELECT id FROM user_ids WHERE email = 'parent@demo.com'),
          (SELECT id FROM user_ids WHERE email = 'advocate@demo.com'),
          'My child has autism and needs support with social communication. The generated goals look good but I''m not sure how to present them at the IEP meeting.',
          NOW() - INTERVAL '1 hour',
          false
        )
      ON CONFLICT DO NOTHING;
    `;

    execSync(`psql "${process.env.DATABASE_URL}" -c "${sql.replace(/"/g, '\\"')}"`, { 
      stdio: 'inherit' 
    });
    
    console.log('✅ Demo messaging data setup completed successfully');
  } catch (error) {
    console.log('ℹ️ Demo messaging setup skipped (tables may already exist)');
  }
}

module.exports = { setupDemoMessaging };

// Run if called directly
if (require.main === module) {
  setupDemoMessaging();
}