import { supabaseAdmin, OtpCode, ContactType } from './supabase'
import { addToBlacklist, DEFAULT_BLACKLIST_CONFIG, BlacklistConfig } from './blacklist'
import crypto from 'crypto'

// Use the OtpCode interface from supabase.ts instead
export type OtpRecord = OtpCode

/**
 * Generate a 6-digit OTP code
 */
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Create and store OTP record
 */
export async function createOtp(
  contactValue: string,
  contactType: ContactType,
  expirationMinutes: number = 10
): Promise<{ success: boolean; otpCode?: string; expiresAt?: string; error?: string }> {
  try {
    const otpCode = generateOtpCode()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60 * 1000)

    // First, delete any existing OTP for this contact
    await supabaseAdmin
      .from('otp_codes')
      .delete()
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
      .eq('verified', false)

    // Create new OTP record
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .insert({
        contact_value: contactValue,
        contact_type: contactType,
        otp_code: otpCode,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        verified: false,
        attempts: 0
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
 * Verify OTP code
 */
export async function verifyOtp(
  contactValue: string,
  contactType: ContactType,
  otpCode: string,
  config: BlacklistConfig = DEFAULT_BLACKLIST_CONFIG
): Promise<{ success: boolean; error?: string; shouldBlacklist?: boolean }> {
  try {
    const now = new Date().toISOString()

    // Find the most recent valid OTP
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
      .eq('verified', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !otpRecord) {
      return { success: false, error: 'No valid OTP found or OTP expired' }
    }

    // Increment attempts counter
    const newAttempts = otpRecord.attempts + 1

    // Check if OTP code matches
    if (otpRecord.otp_code !== otpCode) {
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

    // OTP is valid, mark as verified
    const { error: updateError } = await supabaseAdmin
      .from('otp_codes')
      .update({ 
        verified: true, 
        verified_at: now,
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
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
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
      .eq('verified', false)
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