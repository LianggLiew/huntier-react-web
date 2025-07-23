import { supabaseAdmin, OtpBlacklist } from './supabase'

export type ContactType = 'email' | 'phone'
export type BlacklistReason = 'MAX_SEND_ATTEMPTS' | 'MAX_VERIFY_ATTEMPTS' | 'MANUAL_BLOCK'

export interface BlacklistConfig {
  maxSendAttempts: number
  maxVerifyAttempts: number
  blacklistDurationHours: number
  attemptWindowHours: number
}

export const DEFAULT_BLACKLIST_CONFIG: BlacklistConfig = {
  maxSendAttempts: 5,
  maxVerifyAttempts: 3,
  blacklistDurationHours: 24,
  attemptWindowHours: 1
}

/**
 * Check if a contact (email/phone) is currently blacklisted
 */
export async function isBlacklisted(
  contactValue: string,
  contactType: ContactType
): Promise<{ isBlacklisted: boolean; reason?: string; expiresAt?: string }> {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .select('*')
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
      .gt('expires_at', now)
      .order('blacklisted_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error checking blacklist:', error)
      return { isBlacklisted: false }
    }

    if (data && data.length > 0) {
      return {
        isBlacklisted: true,
        reason: data[0].reason,
        expiresAt: data[0].expires_at
      }
    }

    return { isBlacklisted: false }
  } catch (error) {
    console.error('Error in isBlacklisted:', error)
    return { isBlacklisted: false }
  }
}

/**
 * Add a contact to the blacklist
 */
export async function addToBlacklist(
  contactValue: string,
  contactType: ContactType,
  reason: BlacklistReason,
  config: BlacklistConfig = DEFAULT_BLACKLIST_CONFIG
): Promise<boolean> {
  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + config.blacklistDurationHours * 60 * 60 * 1000)

    const { error } = await supabaseAdmin
      .from('otp_blacklist')
      .insert({
        blacklisted_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        contact_value: contactValue,
        contact_type: contactType,
        reason: reason
      })

    if (error) {
      console.error('Error adding to blacklist:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in addToBlacklist:', error)
    return false
  }
}

/**
 * Remove expired blacklist entries
 */
export async function cleanupExpiredBlacklist(): Promise<number> {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .delete()
      .lt('expires_at', now)
      .select('id')

    if (error) {
      console.error('Error cleaning up blacklist:', error)
      return 0
    }

    return data?.length || 0
  } catch (error) {
    console.error('Error in cleanupExpiredBlacklist:', error)
    return 0
  }
}

/**
 * Get blacklist status for admin interface
 */
export async function getBlacklistStatus(
  contactValue: string,
  contactType: ContactType
): Promise<OtpBlacklist | null> {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .select('*')
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
      .gt('expires_at', now)
      .order('blacklisted_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error getting blacklist status:', error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error in getBlacklistStatus:', error)
    return null
  }
}