import { createClient } from '@supabase/supabase-js'

// Validate and sanitize environment variables
function validateSupabaseUrl(url: string): string {
  if (!url) return ''
  
  // Remove any whitespace and quotes
  const cleanUrl = url.trim().replace(/^["']|["']$/g, '')
  
  // Check if it's a valid URL format
  try {
    new URL(cleanUrl)
    return cleanUrl
  } catch {
    console.warn('Invalid SUPABASE_URL format:', url)
    return ''
  }
}

function validateSupabaseKey(key: string): string {
  if (!key) return ''
  
  // Remove any whitespace and quotes
  const cleanKey = key.trim().replace(/^["']|["']$/g, '')
  
  // Basic JWT format validation (should start with eyJ)
  if (cleanKey.startsWith('eyJ')) {
    return cleanKey
  }
  
  console.warn('Invalid SUPABASE_ANON_KEY format')
  return ''
}

// Use environment variables with validation, fallback to demo credentials
const envUrl = validateSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '')
const envKey = validateSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY || '')

const supabaseUrl = envUrl || 'https://wktcfhegoxjearpzdxpz.supabase.co'
const supabaseAnonKey = envKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGNmaGVnb3hqZWFycHpkeHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MzE1ODIsImV4cCI6MjAzMDUwNzU4Mn0.McgGftcSFTNOa8vS9ozlvkTXYhAAKqEodRFaZEn5oAY'

// Debug logging (remove in production)
console.log('Supabase URL:', supabaseUrl)
console.log('Using environment URL:', !!envUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

export interface IEPDraft {
  id: string
  user_id: string
  diagnosis: string
  suggestions: string
  created_at: string
}