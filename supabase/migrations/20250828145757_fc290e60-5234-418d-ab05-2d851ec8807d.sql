-- CRITICAL SECURITY FIX: Remove dangerous public access to goals table
-- Current issue: "Allow all operations" policy exposes all student goals and personal data

-- Step 1: Drop the extremely dangerous policy that allows anyone to access all goals
DROP POLICY IF EXISTS "Allow all operations" ON public.goals;

-- Step 2: Verify the existing secure policies are properly configured
-- These policies already exist and are secure:
-- - "Goals: owner read" - uses proper parent-student relationship via students.owner_id
-- - "Goals: owner insert/update/delete" - uses uid_txt() = "userId" for ownership

-- Step 3: Add additional security by ensuring goals can only be created for students owned by the user
CREATE POLICY "Goals: secure student ownership validation"
ON public.goals
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = goals.student_id 
    AND s.owner_id = auth.uid()
  )
);

-- Step 4: Ensure updates also validate student ownership
CREATE POLICY "Goals: secure update with student ownership"
ON public.goals
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = goals.student_id 
    AND s.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = goals.student_id 
    AND s.owner_id = auth.uid()
  )
);

-- Step 5: Secure delete policy with student ownership validation
CREATE POLICY "Goals: secure delete with student ownership"
ON public.goals
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = goals.student_id 
    AND s.owner_id = auth.uid()
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;