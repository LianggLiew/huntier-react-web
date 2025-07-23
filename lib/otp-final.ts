import { supabaseAdmin, OtpCode, ContactType } from './supabase'
import { addToBlacklist, DEFAULT_BLACKLIST_CONFIG, BlacklistConfig, isBlacklisted } from './blacklist'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

export type OtpRecord = OtpCode

/**
 * Generate a 6-digit OTP code
 */
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Find existing user by contact or create a new user
 */
async function findOrCreateUser(contactValue: string, contactType: ContactType): Promise<string | null> {
  try {
    // First, try to find existing user by email or phone
    const searchField = contactType === 'email' ? 'email' : 'phone'
    
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq(searchField, contactValue)
      .single()

    if (existingUser && !findError) {
      return existingUser.id
    }

    // If user doesn't exist, create a new one
    const newUserData: any = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
    }

    // Set the contact field
    if (contactType === 'email') {
      newUserData.email = contactValue
    } else {
      newUserData.phone = contactValue
    }

    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert(newUserData)
      .select('id')
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      
      // If creation failed, try to get any existing user as fallback
      const { data: fallbackUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1)
        .single()
        
      return fallbackUser?.id || null
    }

    return newUser.id
  } catch (error) {
    console.error('Error in findOrCreateUser:', error)
    
    // Final fallback: get any existing user
    try {
      const { data: fallbackUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1)
        .single()
        
      return fallbackUser?.id || null
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError)
      return null
    }
  }
}

/**
 * Create and store OTP record using actual table schema
 */
export async function createOtp(
  contactValue: string,
  contactType: ContactType,
  userId?: string,
  expirationMinutes: number = 10
): Promise<{ success: boolean; otpCode?: string; expiresAt?: string; error?: string }> {
  try {
    // Check if blacklisted first
    const blacklistCheck = await isBlacklisted(contactValue, contactType)
    if (blacklistCheck.isBlacklisted) {
      return {
        success: false,
        error: `Contact is blacklisted: ${blacklistCheck.reason}`
      }
    }

    // Check send attempts limit
    const shouldBlacklist = await checkSendAttempts(contactValue, contactType)
    if (shouldBlacklist) {
      return {
        success: false,
        error: 'Too many send attempts. Contact has been blacklisted.'
      }
    }

    const otpCode = generateOtpCode()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60 * 1000)

    // Use provided userId or find/create user based on contact
    let finalUserId = userId
    if (!finalUserId) {
      finalUserId = await findOrCreateUser(contactValue, contactType)
      if (!finalUserId) {
        return {
          success: false,
          error: 'Failed to create or find user.'
        }
      }
    }

    // Mark existing unused OTPs as used for this contact
    await supabaseAdmin
      .from('otp_codes')
      .update({ is_used: true })
      .eq('type', contactType)
      .eq('is_used', false)
      .eq('contact_value', contactValue)

    // Create new OTP record
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .insert({
        user_id: finalUserId,
        code: otpCode,
        type: contactType,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        is_used: false,
        resend_count: 0,
        contact_value: contactValue,
        contact_type: contactType
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating OTP:', error)
      return { success: false, error: 'Failed to create OTP' }
    }

    return {
      success: true,
      otpCode,
      expiresAt: expiresAt.toISOString()
    }
  } catch (error) {
    console.error('Error in createOtp:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Verify OTP code using actual table schema
 */
export async function verifyOtp(
  contactValue: string,
  contactType: ContactType,
  otpCode: string,
  config: BlacklistConfig = DEFAULT_BLACKLIST_CONFIG
): Promise<{ success: boolean; error?: string; shouldBlacklist?: boolean }> {
  try {
    // Check if blacklisted first
    const blacklistCheck = await isBlacklisted(contactValue, contactType)
    if (blacklistCheck.isBlacklisted) {
      return {
        success: false,
        error: `Contact is blacklisted: ${blacklistCheck.reason}`
      }
    }

    const now = new Date().toISOString()

    // Find the most recent valid OTP for this contact
    const { data: otpRecords, error: fetchError } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('type', contactType)
      .eq('is_used', false)
      .eq('contact_value', contactValue)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching OTP records:', fetchError)
      return { success: false, error: 'Failed to fetch OTP records' }
    }

    if (!otpRecords || otpRecords.length === 0) {
      return { success: false, error: 'No valid OTP found or OTP expired' }
    }

    const otpRecord = otpRecords[0]
    const newAttempts = otpRecord.attempts + 1

    // Check if OTP code matches
    if (otpRecord.code !== otpCode) {
      // Update attempts counter
      await supabaseAdmin
        .from('otp_codes')
        .update({ attempts: newAttempts })
        .eq('id', otpRecord.id)

      // Check if this exceeds max verify attempts
      if (newAttempts >= config.maxVerifyAttempts) {
        await addToBlacklist(contactValue, contactType, 'MAX_VERIFY_ATTEMPTS', config)
        return { 
          success: false, 
          error: 'Invalid OTP code. Contact has been blacklisted due to too many failed attempts.',
          shouldBlacklist: true
        }
      }
      
      return { 
        success: false, 
        error: `Invalid OTP code (attempt ${newAttempts}/${config.maxVerifyAttempts})`,
        shouldBlacklist: false
      }
    }

    // OTP is valid, mark as used
    const { error: updateError } = await supabaseAdmin
      .from('otp_codes')
      .update({ 
        is_used: true, 
        attempts: newAttempts
      })
      .eq('id', otpRecord.id)

    if (updateError) {
      console.error('Error updating OTP verification:', updateError)
      return { success: false, error: 'Failed to verify OTP' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in verifyOtp:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Check if send attempts exceed limit and should be blacklisted
 */
export async function checkSendAttempts(
  contactValue: string,
  contactType: ContactType,
  config: BlacklistConfig = DEFAULT_BLACKLIST_CONFIG
): Promise<boolean> {
  try {
    const windowStart = new Date()
    windowStart.setHours(windowStart.getHours() - config.attemptWindowHours)

    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .select('id')
      .eq('type', contactType)
      .eq('contact_value', contactValue)
      .gte('created_at', windowStart.toISOString())

    if (error) {
      console.error('Error checking send attempts:', error)
      return false
    }

    const attemptCount = data?.length || 0
    
    if (attemptCount >= config.maxSendAttempts) {
      await addToBlacklist(contactValue, contactType, 'MAX_SEND_ATTEMPTS', config)
      return true
    }

    return false
  } catch (error) {
    console.error('Error in checkSendAttempts:', error)
    return false
  }
}

/**
 * Clean up expired OTP records
 */
export async function cleanupExpiredOtps(): Promise<number> {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .delete()
      .lt('expires_at', now)
      .eq('is_used', false)
      .select('id')

    if (error) {
      console.error('Error cleaning up expired OTPs:', error)
      return 0
    }

    return data?.length || 0
  } catch (error) {
    console.error('Error in cleanupExpiredOtps:', error)
    return 0
  }
}