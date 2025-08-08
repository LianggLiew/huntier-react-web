import { supabaseAdmin } from './supabase'
import { ContactType } from './blacklist'

export interface RateLimitConfig {
  // Send limits
  maxSendPerMinute: number
  maxSendPerHour: number
  maxSendPerDay: number
  
  // Verify limits
  maxVerifyPerMinute: number
  maxVerifyPerOtp: number
  
  // Resend limits
  minResendInterval: number // seconds
  maxResendPerHour: number
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxSendPerMinute: 20,
  maxSendPerHour: 50,
  maxSendPerDay: 200,
  maxVerifyPerMinute: 5,
  maxVerifyPerOtp: 3,
  minResendInterval: 60, // 1 minute
  maxResendPerHour: 3
}

export interface RateLimitResult {
  allowed: boolean
  reason?: string
  retryAfter?: number // seconds
  remaining?: number
}

/**
 * Check rate limits for OTP sending
 */
export async function checkSendRateLimit(
  contactValue: string,
  contactType: ContactType,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG
): Promise<RateLimitResult> {
  try {
    const now = new Date()
    
    // Check minute limit
    const minuteAgo = new Date(now.getTime() - 60 * 1000)
    const { data: minuteAttempts } = await supabaseAdmin
      .from('otp_codes')
      .select('id')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .gte('created_at', minuteAgo.toISOString())

    if ((minuteAttempts?.length || 0) >= config.maxSendPerMinute) {
      return {
        allowed: false,
        reason: 'Too many requests per minute',
        retryAfter: 60,
        remaining: 0
      }
    }

    // Check hour limit
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const { data: hourAttempts } = await supabaseAdmin
      .from('otp_codes')
      .select('id')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .gte('created_at', hourAgo.toISOString())

    if ((hourAttempts?.length || 0) >= config.maxSendPerHour) {
      return {
        allowed: false,
        reason: 'Too many requests per hour',
        retryAfter: 3600,
        remaining: 0
      }
    }

    // Check day limit
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const { data: dayAttempts } = await supabaseAdmin
      .from('otp_codes')
      .select('id')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .gte('created_at', dayAgo.toISOString())

    if ((dayAttempts?.length || 0) >= config.maxSendPerDay) {
      return {
        allowed: false,
        reason: 'Daily limit exceeded',
        retryAfter: 86400,
        remaining: 0
      }
    }

    return {
      allowed: true,
      remaining: config.maxSendPerHour - (hourAttempts?.length || 0)
    }

  } catch (error) {
    console.error('Error checking send rate limit:', error)
    // Allow on error to prevent blocking legitimate users
    return { allowed: true }
  }
}

/**
 * Check rate limits for OTP verification
 */
export async function checkVerifyRateLimit(
  contactValue: string,
  contactType: ContactType,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG
): Promise<RateLimitResult> {
  try {
    const now = new Date()
    
    // Check verification attempts per minute
    const minuteAgo = new Date(now.getTime() - 60 * 1000)
    
    // Count verification attempts by looking at attempts field updates
    const { data: recentOtps } = await supabaseAdmin
      .from('otp_codes')
      .select('attempts, created_at')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .gte('created_at', minuteAgo.toISOString())
      .order('created_at', { ascending: false })

    // Calculate total verification attempts in the last minute
    const totalVerifyAttempts = recentOtps?.reduce((total, otp) => total + otp.attempts, 0) || 0

    if (totalVerifyAttempts >= config.maxVerifyPerMinute) {
      return {
        allowed: false,
        reason: 'Too many verification attempts per minute',
        retryAfter: 60,
        remaining: 0
      }
    }

    // Check attempts per current OTP
    const { data: currentOtp } = await supabaseAdmin
      .from('otp_codes')
      .select('attempts')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .eq('is_used', false)
      .gt('expires_at', now.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (currentOtp && currentOtp.attempts >= config.maxVerifyPerOtp) {
      return {
        allowed: false,
        reason: 'Too many attempts for this OTP',
        retryAfter: 0,
        remaining: 0
      }
    }

    return {
      allowed: true,
      remaining: config.maxVerifyPerOtp - (currentOtp?.attempts || 0)
    }

  } catch (error) {
    console.error('Error checking verify rate limit:', error)
    return { allowed: true }
  }
}

/**
 * Check if resend is allowed (minimum interval check)
 */
export async function checkResendRateLimit(
  contactValue: string,
  contactType: ContactType,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG
): Promise<RateLimitResult> {
  try {
    const now = new Date()
    
    // Check minimum interval since last send
    const { data: lastOtp } = await supabaseAdmin
      .from('otp_codes')
      .select('created_at')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastOtp) {
      const lastSendTime = new Date(lastOtp.created_at)
      const timeSinceLastSend = (now.getTime() - lastSendTime.getTime()) / 1000
      
      if (timeSinceLastSend < config.minResendInterval) {
        const retryAfter = config.minResendInterval - Math.floor(timeSinceLastSend)
        return {
          allowed: false,
          reason: 'Resend too soon',
          retryAfter,
          remaining: 0
        }
      }
    }

    // Check hourly resend limit
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const { data: hourlyResends } = await supabaseAdmin
      .from('otp_codes')
      .select('id')
      .eq('contact_value', contactValue)
      .eq('type', contactType)
      .gte('created_at', hourAgo.toISOString())

    if ((hourlyResends?.length || 0) >= config.maxResendPerHour) {
      return {
        allowed: false,
        reason: 'Too many resends per hour',
        retryAfter: 3600,
        remaining: 0
      }
    }

    return {
      allowed: true,
      remaining: config.maxResendPerHour - (hourlyResends?.length || 0)
    }

  } catch (error) {
    console.error('Error checking resend rate limit:', error)
    return { allowed: true }
  }
}

/**
 * Get rate limit status for a contact
 */
export async function getRateLimitStatus(
  contactValue: string,
  contactType: ContactType,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG
): Promise<{
  send: RateLimitResult
  verify: RateLimitResult
  resend: RateLimitResult
}> {
  const [send, verify, resend] = await Promise.all([
    checkSendRateLimit(contactValue, contactType, config),
    checkVerifyRateLimit(contactValue, contactType, config),
    checkResendRateLimit(contactValue, contactType, config)
  ])

  return { send, verify, resend }
}