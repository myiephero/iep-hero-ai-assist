import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wktcfhegoxjearpzdxpz.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGNmaGVnb3hqZWFycHpkeHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5MzE1ODIsImV4cCI6MjAzMDg4NzU4Mn0.McgGftcSFTNOa8vS9ozlvkTXYhAAKqEodRFaZEn5oAY'

// Server-side Supabase client with elevated permissions for database operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey)