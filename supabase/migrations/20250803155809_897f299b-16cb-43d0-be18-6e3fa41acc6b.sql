-- Phase 1: Critical Database Security Fixes (Corrected)

-- 1. Enable RLS on tables missing it (excluding views)
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;  
-- Note: iep_analysis_stats is a view, cannot enable RLS

-- 2. Create RLS policies for assignments table
CREATE POLICY "Users can view their own assignments" ON public.assignments
  FOR SELECT
  USING (
    (auth.uid() = parent_id) OR 
    (auth.uid() = advocate_id)
  );

CREATE POLICY "Users can insert their own assignments" ON public.assignments
  FOR INSERT
  WITH CHECK (
    (auth.uid() = parent_id) OR 
    (auth.uid() = advocate_id)
  );

CREATE POLICY "Users can update their own assignments" ON public.assignments
  FOR UPDATE
  USING (
    (auth.uid() = parent_id) OR 
    (auth.uid() = advocate_id)
  );

-- 3. Create RLS policies for email_events table
CREATE POLICY "Users can view their own email events" ON public.email_events
  FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "System can insert email events" ON public.email_events
  FOR INSERT
  WITH CHECK (true);