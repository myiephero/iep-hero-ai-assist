-- Fix the iep_analysis_stats view to use SECURITY INVOKER instead of default SECURITY DEFINER
DROP VIEW IF EXISTS public.iep_analysis_stats;

CREATE VIEW public.iep_analysis_stats 
WITH (security_invoker = true) AS
SELECT 
  count(*) AS total_analyses,
  count(*) FILTER (WHERE (status = 'completed'::text)) AS completed_analyses,
  count(*) FILTER (WHERE (status = 'error'::text)) AS error_analyses,
  avg(EXTRACT(epoch FROM (updated_at - created_at))) AS avg_processing_time_seconds
FROM iep_analyses;