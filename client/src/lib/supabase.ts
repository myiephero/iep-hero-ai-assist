import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wktcfhegoxjearpzdxpz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGNmaGVnb3hqZWFycHpkeHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MzE1ODIsImV4cCI6MjAzMDg4NzU4Mn0.McgGftcSFTNOa8vS9ozlvkTXYhAAKqEodRFaZEn5oAY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface IEPDraft {
  id: string
  user_id: string
  diagnosis: string
  suggestions: string
  created_at: string
}