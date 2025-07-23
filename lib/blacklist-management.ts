import { supabaseAdmin, OtpBlacklist } from './supabase'
import { ContactType, BlacklistReason } from './blacklist'

export interface BlacklistEntry {
  id: number
  blacklisted_at: string
  expires_at: string
  contact_value: string
  contact_type: ContactType
  reason: BlacklistReason
  is_active: boolean
  time_remaining?: string
}

export interface BlacklistStats {
  total_active: number
  email_blacklisted: number
  phone_blacklisted: number
  max_send_attempts: number
  max_verify_attempts: number
  manual_blocks: number
}

/**
 * Get all active blacklist entries with pagination
 */
export async function getActiveBlacklistEntries(
  page: number = 1,
  limit: number = 50
): Promise<{ entries: BlacklistEntry[]; total: number; hasMore: boolean }> {
  try {
    const now = new Date().toISOString()
    const offset = (page - 1) * limit

    // Get total count
    const { count } = await supabaseAdmin
      .from('otp_blacklist')
      .select('*', { count: 'exact', head: true })
      .gt('expires_at', now)

    // Get entries
    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .select('*')
      .gt('expires_at', now)
      .order('blacklisted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching blacklist entries:', error)
      return { entries: [], total: 0, hasMore: false }
    }

    const entries: BlacklistEntry[] = (data || []).map(entry => ({
      id: entry.id,
      blacklisted_at: entry.blacklisted_at,
      expires_at: entry.expires_at,
      contact_value: entry.contact_value,
      contact_type: entry.contact_type as ContactType,
      reason: entry.reason as BlacklistReason,
      is_active: new Date(entry.expires_at) > new Date(),
      time_remaining: calculateTimeRemaining(entry.expires_at)
    }))

    return {
      entries,
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    }
  } catch (error) {
    console.error('Error in getActiveBlacklistEntries:', error)
    return { entries: [], total: 0, hasMore: false }
  }
}

/**
 * Get blacklist statistics
 */
export async function getBlacklistStats(): Promise<BlacklistStats> {
  try {
    const now = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .select('contact_type, reason')
      .gt('expires_at', now)

    if (error) {
      console.error('Error fetching blacklist stats:', error)
      return {
        total_active: 0,
        email_blacklisted: 0,
        phone_blacklisted: 0,
        max_send_attempts: 0,
        max_verify_attempts: 0,
        manual_blocks: 0
      }
    }

    const stats = {
      total_active: data.length,
      email_blacklisted: data.filter(entry => entry.contact_type === 'email').length,
      phone_blacklisted: data.filter(entry => entry.contact_type === 'phone').length,
      max_send_attempts: data.filter(entry => entry.reason === 'MAX_SEND_ATTEMPTS').length,
      max_verify_attempts: data.filter(entry => entry.reason === 'MAX_VERIFY_ATTEMPTS').length,
      manual_blocks: data.filter(entry => entry.reason === 'MANUAL_BLOCK').length
    }

    return stats
  } catch (error) {
    console.error('Error in getBlacklistStats:', error)
    return {
      total_active: 0,
      email_blacklisted: 0,
      phone_blacklisted: 0,
      max_send_attempts: 0,
      max_verify_attempts: 0,
      manual_blocks: 0
    }
  }
}

/**
 * Manually add contact to blacklist
 */
export async function manuallyBlacklistContact(
  contactValue: string,
  contactType: ContactType,
  durationHours: number = 24,
  reason: string = 'Manual block by admin'
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000)

    const { error } = await supabaseAdmin
      .from('otp_blacklist')
      .insert({
        blacklisted_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        contact_value: contactValue,
        contact_type: contactType,
        reason: `MANUAL_BLOCK: ${reason}`
      })

    if (error) {
      console.error('Error manually blacklisting contact:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in manuallyBlacklistContact:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Remove contact from blacklist (unblock)
 */
export async function removeFromBlacklist(
  contactValue: string,
  contactType: ContactType
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString()

    // Set expires_at to now to effectively remove from blacklist
    const { error } = await supabaseAdmin
      .from('otp_blacklist')
      .update({ expires_at: now })
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
      .gt('expires_at', now)

    if (error) {
      console.error('Error removing from blacklist:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in removeFromBlacklist:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Search blacklist entries
 */
export async function searchBlacklistEntries(
  searchTerm: string,
  contactType?: ContactType,
  reason?: BlacklistReason
): Promise<BlacklistEntry[]> {
  try {
    const now = new Date().toISOString()
    
    let query = supabaseAdmin
      .from('otp_blacklist')
      .select('*')
      .gt('expires_at', now)
      .ilike('contact_value', `%${searchTerm}%`)

    if (contactType) {
      query = query.eq('contact_type', contactType)
    }

    if (reason) {
      query = query.ilike('reason', `%${reason}%`)
    }

    const { data, error } = await query
      .order('blacklisted_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error searching blacklist entries:', error)
      return []
    }

    return (data || []).map(entry => ({
      id: entry.id,
      blacklisted_at: entry.blacklisted_at,
      expires_at: entry.expires_at,
      contact_value: entry.contact_value,
      contact_type: entry.contact_type as ContactType,
      reason: entry.reason as BlacklistReason,
      is_active: new Date(entry.expires_at) > new Date(),
      time_remaining: calculateTimeRemaining(entry.expires_at)
    }))
  } catch (error) {
    console.error('Error in searchBlacklistEntries:', error)
    return []
  }
}

/**
 * Get recent blacklist activity
 */
export async function getRecentBlacklistActivity(
  hours: number = 24,
  limit: number = 50
): Promise<BlacklistEntry[]> {
  try {
    const cutoffTime = new Date()
    cutoffTime.setHours(cutoffTime.getHours() - hours)

    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .select('*')
      .gte('blacklisted_at', cutoffTime.toISOString())
      .order('blacklisted_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent blacklist activity:', error)
      return []
    }

    return (data || []).map(entry => ({
      id: entry.id,
      blacklisted_at: entry.blacklisted_at,
      expires_at: entry.expires_at,
      contact_value: entry.contact_value,
      contact_type: entry.contact_type as ContactType,
      reason: entry.reason as BlacklistReason,
      is_active: new Date(entry.expires_at) > new Date(),
      time_remaining: calculateTimeRemaining(entry.expires_at)
    }))
  } catch (error) {
    console.error('Error in getRecentBlacklistActivity:', error)
    return []
  }
}

/**
 * Calculate time remaining until blacklist expires
 */
function calculateTimeRemaining(expiresAt: string): string {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires.getTime() - now.getTime()

  if (diffMs <= 0) {
    return 'Expired'
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}