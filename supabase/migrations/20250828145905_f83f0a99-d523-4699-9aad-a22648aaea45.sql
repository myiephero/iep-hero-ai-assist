-- CRITICAL SECURITY FIX: Remove only the dangerous policy exposing all student goals
-- Issue: "Allow all operations" policy with qual:true exposes all student data

DROP POLICY IF EXISTS "Allow all operations" ON public.goals;