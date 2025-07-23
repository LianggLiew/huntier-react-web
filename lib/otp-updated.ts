import { supabaseAdmin, OtpCode, ContactType } from './supabase'
import { addToBlacklist, DEFAULT_BLACKLIST_CONFIG, BlacklistConfig } from './blacklist'
import crypto from 'crypto'

// Use the OtpCode interface from supabase.ts
export type OtpRecord = OtpCode

/**
 * Generate a 6-digit OTP code
 */
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
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
    const otpCode = generateOtpCode()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60 * 1000)

    // Since contact_value might be null in your schema, we'll use user_id approach
    // If you don't have user_id, we'll use a temporary UUID or contact-based approach
    const tempUserId = userId || `temp_${contactValue.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`

    // First, mark any existing unused OTPs as used for this contact/type
    await supabaseAdmin
      .from('otp_codes')
      .update({ is_used: true })
      .eq('type', contactType)
      .eq('is_used', false)
      // We can't filter by contact_value since it's null, so we'll clean up by user_id if available
      .ilike('user_id', `%${contactValue.replace(/[^a-zA-Z0-9]/g, '_')}%`)

    // Create new OTP record
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .insert({
        user_id: tempUserId,
        code: otpCode,
        type: contactType,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        is_used: false,
        resend_count: 0,
        contact_value: contactValue, // Store for our reference even if schema allows null
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
    const now = new Date().toISOString()

    // Find the most recent valid OTP for this contact
    // Since contact_value might be null, we need to use a different approach
    const { data: otpRecords, error: fetchError } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('type', contactType)
      .eq('is_used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching OTP records:', fetchError)
      return { success: false, error: 'Failed to fetch OTP records' }
    }

    // Filter by contact_value on the client side since it might be null in DB
    const validOtps = otpRecords?.filter(otp => 
      otp.contact_value === contactValue || 
      otp.user_id.includes(contactValue.replace(/[^a-zA-Z0-9]/g, '_'))
    ) || []

    if (validOtps.length === 0) {
      return { success: false, error: 'No valid OTP found or OTP expired' }
    }

    const otpRecord = validOtps[0]
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
          error: 'Invalid OTP code',
          shouldBlacklist: true
        }
      }
      
      return { 
        success: false, 
        error: 'Invalid OTP code',
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
 * Count OTPs created in the time window
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
      .select('id, contact_value, user_id')
      .eq('type', contactType)
      .gte('created_at', windowStart.toISOString())

    if (error) {
      console.error('Error checking send attempts:', error)
      return false
    }

    // Filter by contact_value on client side
    const contactAttempts = data?.filter(otp => 
      otp.contact_value === contactValue || 
      otp.user_id.includes(contactValue.replace(/[^a-zA-Z0-9]/g, '_'))
    ) || []

    const attemptCount = contactAttempts.length
    
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
 * Check if verify attempts exceed limit and should be blacklisted
 * Note: This is now handled directly in verifyOtp function using the attempts column
 */
export async function checkVerifyAttempts(
  contactValue: string,
  contactType: ContactType,
  config: BlacklistConfig = DEFAULT_BLACKLIST_CONFIG
): Promise<boolean> {
  // This function is kept for compatibility but logic moved to verifyOtp
  // The attempts are now tracked in the otp_codes.attempts column
  return false
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