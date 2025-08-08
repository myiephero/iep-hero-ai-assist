-- Phase 1: Critical Database Security Fixes

-- 1. Enable RLS on unprotected tables and create policies

-- Documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents" 
ON public.documents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Memory table (AI/RAG memory - user-specific)
ALTER TABLE public.memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own memory" 
ON public.memory 
FOR ALL 
USING (auth.uid()::text = user_id);

-- Profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Reminders table
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminders" 
ON public.reminders 
FOR ALL 
USING (auth.uid() = user_id);

-- Subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (current_setting('role', true) = 'service_role');

-- Tool logs table (admin access only)
ALTER TABLE public.tool_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all tool logs" 
ON public.tool_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.id = auth.uid() AND up.role = 'admin'
));

CREATE POLICY "System can insert tool logs" 
ON public.tool_logs 
FOR INSERT 
WITH CHECK (true);

-- User feedback table
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own feedback" 
ON public.user_feedback 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" 
ON public.user_feedback 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- 2. Create missing RLS policies for tables with RLS enabled but no policies

-- Advocate matches table (admin only)
CREATE POLICY "Admins can manage advocate matches" 
ON public.advocate_matches 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- Children table (parents can manage their own children)
CREATE POLICY "Parents can manage their own children" 
ON public.children 
FOR ALL 
USING (auth.uid() = parent_id);

CREATE POLICY "Advocates can view assigned children" 
ON public.children 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM advocate_assignments aa 
  WHERE aa.parent_id = children.parent_id 
  AND aa.advocate_id = auth.uid() 
  AND aa.status = 'active'
));

-- Shared answers table (public read, admin write)
CREATE POLICY "Anyone can view shared answers" 
ON public.shared_answers 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage shared answers" 
ON public.shared_answers 
FOR INSERT, UPDATE, DELETE 
USING (EXISTS (
  SELECT 1 FROM user_profiles up 
  WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- 3. Tighten overly permissive policies

-- Replace overly broad policies on critical tables
DROP POLICY IF EXISTS "Allow all operations" ON public.goals;
CREATE POLICY "Users can manage their own goals" 
ON public.goals 
FOR ALL 
USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Allow all operations" ON public.reminder_emails;
CREATE POLICY "Users can view their own reminder emails" 
ON public.reminder_emails 
FOR SELECT 
USING (auth.uid()::text = "userId");

CREATE POLICY "System can manage reminder emails" 
ON public.reminder_emails 
FOR INSERT, UPDATE, DELETE 
WITH CHECK (current_setting('role', true) = 'service_role');

-- Restrict AI reviews to be more secure
DROP POLICY IF EXISTS "Allow public access" ON public.ai_reviews;
CREATE POLICY "Users can manage their own AI reviews" 
ON public.ai_reviews 
FOR ALL 
USING (auth.uid()::text = user_id);

-- Restrict smart uploads
DROP POLICY IF EXISTS "Allow public access" ON public.smart_uploads;
CREATE POLICY "Users can manage their own uploads" 
ON public.smart_uploads 
FOR ALL 
USING (auth.uid()::text = user_id);

-- 4. Fix any remaining database functions missing search_path
CREATE OR REPLACE FUNCTION public.call_send_advocate_match_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  response text;
begin
  perform
    net.http_post(
      url := 'https://wktcfhegoxjearpzdxpz.supabase.co/functions/v1/swift-task',
      headers := json_build_object('Content-Type', 'application/json'),
      body := json_build_object(
        'parent_id', NEW.parent_id,
        'advocate_id', NEW.advocate_id
      )::text
    );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_pending_reminders()
RETURNS TABLE(reminder_id text, user_id text, title text, meeting_date timestamp with time zone, days_until integer, reminder_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as reminder_id,
    r."userId" as user_id,
    r.title,
    r."meetingDate" as meeting_date,
    EXTRACT(DAY FROM r."meetingDate" - NOW())::INTEGER as days_until,
    CASE 
      WHEN EXTRACT(DAY FROM r."meetingDate" - NOW()) <= 1 THEN '1_day'
      WHEN EXTRACT(DAY FROM r."meetingDate" - NOW()) <= 3 THEN '3_day'
      WHEN EXTRACT(DAY FROM r."meetingDate" - NOW()) <= 7 THEN '7_day'
      ELSE 'none'
    END as reminder_type
  FROM reminders r
  WHERE r."isActive" = true
    AND r."meetingDate" > NOW()
    AND EXTRACT(DAY FROM r."meetingDate" - NOW()) <= 7;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE email = user_email AND role = 'admin'
  );
END;
$function$;

-- 5. Remove or restrict dangerous views
DROP VIEW IF EXISTS public.user_roles_view;

-- Create a secure version if needed (admin only)
CREATE VIEW public.admin_user_roles_view 
WITH (security_barrier = true) AS
SELECT id, email, role, created_at
FROM user_profiles
WHERE EXISTS (
  SELECT 1 FROM user_profiles admin_check 
  WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
);