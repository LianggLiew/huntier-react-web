/**
 * Supabase Database Configuration and Helper Functions
 * 
 * This file sets up connections to Supabase PostgreSQL database and provides
 * helper functions for authentication-related database operations.
 * 
 * Two clients are created:
 * 1. supabase - For frontend/browser operations (respects Row Level Security)
 * 2. supabaseAdmin - For server-side operations (bypasses RLS with service role)
 */

import { createClient } from '@supabase/supabase-js'

// Load Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Public Supabase client for browser/frontend usage
 * - Uses anonymous key with Row Level Security enabled
 * - Safe for client-side operations
 * - Respects RLS policies defined in database
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Admin Supabase client for server-side operations
 * - Uses service role key that bypasses Row Level Security
 * - Should ONLY be used in API routes or server-side code
 * - Has full database access - handle with care
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,  // No need for auto-refresh in server context
    persistSession: false     // Don't persist sessions on server
  }
})

/**
 * TypeScript interfaces for database tables
 * These match the schema defined in supabase-schema.sql
 */

/** User profile information */
export interface User {
  id: string                    // UUID primary key
  email?: string               // Email address (optional, either email or phone required)
  phone?: string               // Phone number (optional, either email or phone required)
  is_verified: boolean         // Whether user has verified their contact method
  created_at: string          // Account creation timestamp
  updated_at: string          // Last update timestamp (auto-updated via trigger)
  last_login?: string         // Last successful login timestamp
}

/** OTP verification codes for passwordless authentication */
export interface OTPCode {
  id: string                   // UUID primary key
  user_id: string             // Reference to users table
  code: string                // 6-digit verification code
  type: 'email' | 'phone'     // Type of OTP (email or SMS)
  expires_at: string          // When the code expires (5 minutes after creation)
  attempts: number            // Number of verification attempts (max 3)
  is_used: boolean           // Whether the code has been successfully used
  created_at: string         // Code generation timestamp
}

/** Refresh tokens for session management */
export interface RefreshToken {
  id: string                  // UUID primary key
  user_id: string            // Reference to users table
  token: string              // JWT refresh token
  expires_at: string         // Token expiration (7 days after creation)
  created_at: string         // Token creation timestamp
  device_info?: string       // Optional device information from User-Agent
}

/**
 * Database helper functions for authentication operations
 * All functions use supabaseAdmin client for server-side operations
 */
export const dbHelpers = {
  /**
   * Find a user by email or phone number
   * @param email - Email address to search for
   * @param phone - Phone number to search for
   * @returns User object if found, null if not found or on error
   */
  async findUser(email?: string, phone?: string): Promise<User | null> {
    // Build query based on provided contact method
    let query = supabaseAdmin.from('users').select('*')
    
    if (email) {
      query = query.eq('email', email)
    } else if (phone) {
      query = query.eq('phone', phone)
    } else {
      return null  // Neither email nor phone provided
    }

    const { data, error } = await query.single()
    
    // PGRST116 is Supabase's "no rows returned" error code - this is expected when user doesn't exist
    if (error && error.code !== 'PGRST116') {
      console.error('Error finding user:', error)
      return null
    }
    return data
  },

  /**
   * Find a user by their ID
   * @param userId - User ID to search for
   * @returns User object if found, null if not found or on error
   */
  async findUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    // PGRST116 is Supabase's "no rows returned" error code - this is expected when user doesn't exist
    if (error && error.code !== 'PGRST116') {
      console.error('Error finding user by ID:', error)
      return null
    }
    return data
  },

  /**
   * Create a new user account (auto-registration for passwordless auth)
   * @param email - Email address for the new user
   * @param phone - Phone number for the new user
   * @returns Created user object or null on error
   */
  async createUser(email?: string, phone?: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        phone,
        is_verified: false,                     // User starts unverified
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return data
  },

  /**
   * Create an OTP verification code for a user
   * Automatically invalidates any existing unused codes for the same user/type
   * @param userId - User ID to create OTP for
   * @param code - 6-digit verification code
   * @param type - 'email' or 'phone' verification
   * @returns true if successful, false on error
   */
  async createOTP(userId: string, code: string, type: 'email' | 'phone'): Promise<boolean> {
    // First, invalidate any existing unused OTP codes for this user and type
    // This ensures only one active OTP per user per type at a time
    await supabaseAdmin
      .from('otp_codes')
      .update({ is_used: true })
      .eq('user_id', userId)
      .eq('type', type)
      .eq('is_used', false)

    // Create new OTP code with 5-minute expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    
    const { error } = await supabaseAdmin
      .from('otp_codes')
      .insert({
        user_id: userId,
        code,
        type,
        expires_at: expiresAt,
        attempts: 0,                    // Start with 0 attempts
        is_used: false,                 // Mark as unused
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating OTP:', error)
      return false
    }
    return true
  },

  // Verify OTP code
  async verifyOTP(userId: string, code: string, type: 'email' | 'phone'): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('type', type)
      .eq('is_used', false)
      .single()

    if (error || !data) {
      return false
    }

    // Check if OTP has expired
    if (new Date(data.expires_at) < new Date()) {
      return false
    }

    // Check attempt limits (max 3 attempts)
    if (data.attempts >= 3) {
      return false
    }

    // Increment attempts
    await supabaseAdmin
      .from('otp_codes')
      .update({ attempts: data.attempts + 1 })
      .eq('id', data.id)

    // If code matches, mark as used and verify user
    if (data.code === code) {
      await supabaseAdmin
        .from('otp_codes')
        .update({ is_used: true })
        .eq('id', data.id)

      // Mark user as verified
      await supabaseAdmin
        .from('users')
        .update({ 
          is_verified: true, 
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .eq('id', userId)

      return true
    }

    return false
  },

  // Store refresh token
  async storeRefreshToken(userId: string, token: string, deviceInfo?: string): Promise<boolean> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    
    const { error } = await supabaseAdmin
      .from('refresh_tokens')
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        device_info: deviceInfo
      })

    return !error
  },

  // Validate refresh token
  async validateRefreshToken(token: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('refresh_tokens')
      .select(`
        *,
        users (*)
      `)
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return null
    }

    return data.users as User
  },

  // Revoke refresh token
  async revokeRefreshToken(token: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('refresh_tokens')
      .delete()
      .eq('token', token)

    return !error
  }
}