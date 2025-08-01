-- Add RLS policies to iep_analysis_stats table to restrict access to admin users only
ALTER TABLE public.iep_analysis_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admin users to view stats
CREATE POLICY "Only admins can view analysis stats" 
ON public.iep_analysis_stats 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'
));

-- Create policy to allow only admin users to insert stats (for system operations)
CREATE POLICY "Only admins can insert analysis stats" 
ON public.iep_analysis_stats 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'
));

-- Create policy to allow only admin users to update stats
CREATE POLICY "Only admins can update analysis stats" 
ON public.iep_analysis_stats 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'
));

-- Create policy to allow only admin users to delete stats
CREATE POLICY "Only admins can delete analysis stats" 
ON public.iep_analysis_stats 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'
));