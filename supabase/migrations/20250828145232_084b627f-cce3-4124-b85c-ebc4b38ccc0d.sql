-- CRITICAL SECURITY FIX: Restrict access to user_profiles table
-- Current issue: "Users can view all profiles" policy allows any user to see all personal data

-- Step 1: Drop the dangerous public access policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

-- Step 2: Create secure policies that only allow users to see their own data
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = auth_id);

-- Step 3: Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = auth_id);

-- Step 4: Update existing UPDATE policy to use auth_id consistently
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- Step 5: Allow users to delete their own profile (for GDPR compliance)
CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = auth_id);

-- Step 6: Create admin access policy (optional - only if admin functionality needed)
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.auth_id = auth.uid() 
    AND up.role = 'admin'
  )
);

-- Verify RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;