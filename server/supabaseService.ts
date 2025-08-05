import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_DATABASE_URL?.replace('postgresql://', 'https://') || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export interface SupabaseAdvocateMatch {
  parent_id: string;
  meeting_date?: string;
  contact_method: string;
  parent_availability: string;
  concerns: string;
  help_areas: string[];
  grade_level: string;
  school_district: string;
  status?: string;
  document_urls?: string[];
}

export const submitAdvocateMatch = async (formData: any, userId: string) => {
  if (!supabaseAdmin) {
    console.log('Supabase not configured, using local database');
    return { success: false, error: 'Supabase not configured' };
  }

  const { error } = await supabaseAdmin.from("advocate_matches").insert([
    {
      parent_id: userId,
      meeting_date: formData.meetingDate,
      contact_method: formData.contactMethod,
      parent_availability: formData.availability,
      concerns: formData.concerns,
      help_areas: formData.helpAreas,
      grade_level: formData.gradeLevel,
      school_district: formData.schoolDistrict,
      status: "pending",
      document_urls: formData.uploadedFiles || [],
    }
  ]);

  if (error) {
    console.error("Error submitting match:", error);
    return { success: false, error };
  }

  return { success: true };
};