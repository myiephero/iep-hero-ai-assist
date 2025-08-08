-- Fix the remaining database functions missing search_path

-- Fix auto_assign_advocate_to_review function
CREATE OR REPLACE FUNCTION public.auto_assign_advocate_to_review(review_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    auto_assign_enabled BOOLEAN := FALSE;
    parent_uuid UUID;
    assigned_advocate_id UUID;
BEGIN
    -- Check if auto-assign is enabled
    SELECT (setting_value->>'enabled')::BOOLEAN INTO auto_assign_enabled
    FROM admin_settings 
    WHERE setting_key = 'auto_assign_advocate';
    
    IF NOT auto_assign_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Get the parent_id from the review
    SELECT parent_id INTO parent_uuid FROM ai_reviews WHERE id = review_id;
    
    -- Check if parent already has an assigned advocate
    SELECT advocate_id INTO assigned_advocate_id
    FROM advocate_assignments 
    WHERE parent_id = parent_uuid AND status = 'active'
    LIMIT 1;
    
    -- If advocate found, assign to review
    IF assigned_advocate_id IS NOT NULL THEN
        UPDATE ai_reviews 
        SET advocate_id = assigned_advocate_id
        WHERE id = review_id;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$function$;

-- Fix get_ai_review_with_advocate function
CREATE OR REPLACE FUNCTION public.get_ai_review_with_advocate(review_id uuid)
 RETURNS TABLE(review_data json, advocate_info json, assignment_info json)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        row_to_json(ar.*) as review_data,
        CASE 
            WHEN ar.advocate_id IS NOT NULL THEN row_to_json(adv.*)
            ELSE NULL
        END as advocate_info,
        CASE 
            WHEN ar.advocate_id IS NOT NULL THEN row_to_json(aa.*)
            ELSE NULL
        END as assignment_info
    FROM ai_reviews ar
    LEFT JOIN user_profiles adv ON ar.advocate_id = adv.id AND adv.role = 'advocate'
    LEFT JOIN advocate_assignments aa ON ar.advocate_id = aa.advocate_id AND ar.parent_id = aa.parent_id
    WHERE ar.id = review_id;
END;
$function$;

-- Fix get_assigned_parents function
CREATE OR REPLACE FUNCTION public.get_assigned_parents(advocate_uuid uuid)
 RETURNS TABLE(parent_id uuid, full_name text, email text, assigned_at timestamp with time zone, assignment_status text, total_documents integer, total_preps integer, total_letters integer, upcoming_meetings integer, last_activity timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as parent_id,
        p.full_name,
        p.email,
        aa.assigned_at,
        aa.status as assignment_status,
        0 as total_documents,
        0 as total_preps,
        0 as total_letters,
        0 as upcoming_meetings,
        p.created_at as last_activity
    FROM user_profiles p
    JOIN advocate_assignments aa ON p.id = aa.parent_id
    WHERE aa.advocate_id = advocate_uuid 
    AND aa.status = 'active'
    AND p.role = 'parent'
    ORDER BY aa.assigned_at DESC;
END;
$function$;

-- Fix get_parent_case_data function
CREATE OR REPLACE FUNCTION public.get_parent_case_data(advocate_uuid uuid, parent_uuid uuid)
 RETURNS TABLE(parent_info json, documents json, meeting_preps json, letters json, meetings json, advocate_notes json)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        row_to_json(p.*) as parent_info,
        '[]'::json as documents,
        '[]'::json as meeting_preps,
        '[]'::json as letters,
        '[]'::json as meetings,
        '[]'::json as advocate_notes
    FROM user_profiles p
    WHERE p.id = parent_uuid AND p.role = 'parent';
END;
$function$;

-- Fix update_advocate_assignments_updated_at function
CREATE OR REPLACE FUNCTION public.update_advocate_assignments_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix update_advocate_notes_updated_at function
CREATE OR REPLACE FUNCTION public.update_advocate_notes_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix update_ai_reviews_updated_at function
CREATE OR REPLACE FUNCTION public.update_ai_reviews_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;