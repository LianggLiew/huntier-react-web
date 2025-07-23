import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client for server-side operations with elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types for OTP blacklist
export interface OtpBlacklist {
  id: number
  blacklisted_at: string
  expires_at: string
  contact_value: string
  contact_type: 'email' | 'phone'
  reason: string
}

// Database types for OTP codes table (matching actual schema)
export interface OtpCode {
  id: string // UUID
  user_id: string // UUID
  code: string // The OTP code
  type: 'email' | 'phone' // Type of verification
  expires_at: string
  attempts: number
  is_used: boolean
  created_at: string
  resend_count: number
  contact_value?: string
  contact_type?: string
}