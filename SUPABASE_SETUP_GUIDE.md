# Supabase Setup Guide for My IEP Hero

## Quick Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize

### 2. Get Your Environment Variables
From your Supabase project dashboard:

**Project Settings > API:**
- `SUPABASE_URL` - Your project URL (https://[project-id].supabase.co)
- `VITE_SUPABASE_URL` - Same as above (for frontend)
- `VITE_SUPABASE_ANON_KEY` - Your anon/public key (starts with `eyJ`)
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (starts with `eyJ`)

### 3. Create Required Table
Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE advocate_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id TEXT NOT NULL,
  advocate_id TEXT,
  meeting_date TEXT,
  contact_method TEXT NOT NULL,
  parent_availability TEXT NOT NULL,
  concerns TEXT NOT NULL,
  help_areas TEXT[] NOT NULL,
  grade_level TEXT NOT NULL,
  school_district TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  document_urls TEXT[]
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE advocate_matches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role can do everything" ON advocate_matches
  USING (auth.role() = 'service_role');
```

### 4. Set Environment Variables
Update your `.env` file with your actual values:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

### 5. Optional: Slack Integration
Get your Slack webhook URL:
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create new app or use existing
3. Go to "Incoming Webhooks"
4. Add webhook to workspace
5. Copy webhook URL

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
```

## Testing the Integration

Once configured, the Advocate Matcher will:
1. ✅ Save data directly to your Supabase `advocate_matches` table
2. ✅ Send confirmation emails to parents
3. ✅ Post notifications to your Slack channel
4. ✅ Display success confirmation with all steps completed

## Verification Steps

1. **Check Supabase**: Go to Table Editor > advocate_matches to see new entries
2. **Check Slack**: Look for notifications in your configured channel
3. **Check Logs**: Server console will show "✅ Data successfully saved to Supabase!"
4. **Check Emails**: Parent receives professional confirmation email

## Troubleshooting

- **"Supabase not configured"**: Check environment variables are set correctly
- **Table doesn't exist**: Run the SQL table creation script above
- **Permission denied**: Ensure service role key is correct and RLS policies allow access
- **Slack not working**: Verify webhook URL is correct and active

Your Advocate Matcher is now production-ready with real data capture!