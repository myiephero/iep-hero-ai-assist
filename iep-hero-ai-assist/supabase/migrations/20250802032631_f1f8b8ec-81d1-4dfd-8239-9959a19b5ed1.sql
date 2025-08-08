-- Fix database function search paths for security
-- This prevents potential SQL injection through search path manipulation

-- Fix update_user_profiles_updated_at function
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix update_updated_at_column function  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Add RLS policy for iep_analysis_stats table (admin access only)
CREATE POLICY "Only admins can view analysis stats"
ON public.iep_analysis_stats
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);