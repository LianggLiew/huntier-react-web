import { supabaseAdmin } from './supabase'
import { cleanupExpiredBlacklist } from './blacklist'
import { cleanupExpiredOtps } from './otp-final'
import { cleanupExpiredTokens } from './auth'

export interface CleanupResult {
  success: boolean
  summary: {
    expiredOtps: number
    expiredBlacklist: number
    expiredTokens: number
    oldUsers: number
    totalCleaned: number
  }
  errors?: string[]
}

export interface CleanupConfig {
  // How old records should be before cleanup
  otpRetentionDays: number
  blacklistRetentionDays: number
  refreshTokenRetentionDays: number
  userRetentionDays: number
  
  // Batch sizes for cleanup operations
  batchSize: number
  
  // Whether to clean up unused users
  cleanupUsers: boolean
}

export const DEFAULT_CLEANUP_CONFIG: CleanupConfig = {
  otpRetentionDays: 7,        // Keep OTP records for 7 days
  blacklistRetentionDays: 30, // Keep expired blacklist for 30 days
  refreshTokenRetentionDays: 1, // Clean expired refresh tokens after 1 day
  userRetentionDays: 90,      // Keep unused users for 90 days
  batchSize: 100,
  cleanupUsers: false         // Don't auto-cleanup users by default
}

/**
 * Comprehensive cleanup of expired and old data
 */
export async function performCleanup(
  config: CleanupConfig = DEFAULT_CLEANUP_CONFIG
): Promise<CleanupResult> {
  const errors: string[] = []
  let expiredOtps = 0
  let expiredBlacklist = 0
  let expiredTokens = 0
  let oldUsers = 0

  try {
    console.log('🧹 Starting database cleanup...')

    // 1. Clean up expired OTPs
    console.log('  Cleaning expired OTPs...')
    try {
      expiredOtps = await cleanupExpiredOtps()
      console.log(`  ✅ Cleaned ${expiredOtps} expired OTPs`)
    } catch (error) {
      const errorMsg = `Failed to cleanup expired OTPs: ${error}`
      console.error(`  ❌ ${errorMsg}`)
      errors.push(errorMsg)
    }

    // 2. Clean up old OTP records (beyond retention period)
    console.log('  Cleaning old OTP records...')
    try {
      const oldOtpCount = await cleanupOldOtpRecords(config.otpRetentionDays, config.batchSize)
      console.log(`  ✅ Cleaned ${oldOtpCount} old OTP records`)
      expiredOtps += oldOtpCount
    } catch (error) {
      const errorMsg = `Failed to cleanup old OTP records: ${error}`
      console.error(`  ❌ ${errorMsg}`)
      errors.push(errorMsg)
    }

    // 3. Clean up expired blacklist entries
    console.log('  Cleaning expired blacklist entries...')
    try {
      expiredBlacklist = await cleanupExpiredBlacklist()
      console.log(`  ✅ Cleaned ${expiredBlacklist} expired blacklist entries`)
    } catch (error) {
      const errorMsg = `Failed to cleanup expired blacklist: ${error}`
      console.error(`  ❌ ${errorMsg}`)
      errors.push(errorMsg)
    }

    // 4. Clean up old blacklist records (beyond retention period)
    console.log('  Cleaning old blacklist records...')
    try {
      const oldBlacklistCount = await cleanupOldBlacklistRecords(
        config.blacklistRetentionDays, 
        config.batchSize
      )
      console.log(`  ✅ Cleaned ${oldBlacklistCount} old blacklist records`)
      expiredBlacklist += oldBlacklistCount
    } catch (error) {
      const errorMsg = `Failed to cleanup old blacklist records: ${error}`
      console.error(`  ❌ ${errorMsg}`)
      errors.push(errorMsg)
    }

    // 5. Clean up expired refresh tokens
    console.log('  Cleaning expired refresh tokens...')
    try {
      const expiredRefreshTokens = await cleanupExpiredTokens()
      console.log(`  ✅ Cleaned ${expiredRefreshTokens.deletedCount || 0} expired refresh tokens`)
      expiredTokens = expiredRefreshTokens.deletedCount || 0
    } catch (error) {
      const errorMsg = `Failed to cleanup expired refresh tokens: ${error}`
      console.error(`  ❌ ${errorMsg}`)
      errors.push(errorMsg)
    }

    // 6. Clean up old refresh token records (beyond retention period)
    console.log('  Cleaning old refresh token records...')
    try {
      const oldTokenCount = await cleanupOldRefreshTokens(
        config.refreshTokenRetentionDays, 
        config.batchSize
      )
      console.log(`  ✅ Cleaned ${oldTokenCount} old refresh token records`)
      expiredTokens += oldTokenCount
    } catch (error) {
      const errorMsg = `Failed to cleanup old refresh token records: ${error}`
      console.error(`  ❌ ${errorMsg}`)
      errors.push(errorMsg)
    }

    // 7. Clean up unused users (optional)
    if (config.cleanupUsers) {
      console.log('  Cleaning unused users...')
      try {
        oldUsers = await cleanupUnusedUsers(config.userRetentionDays, config.batchSize)
        console.log(`  ✅ Cleaned ${oldUsers} unused users`)
      } catch (error) {
        const errorMsg = `Failed to cleanup unused users: ${error}`
        console.error(`  ❌ ${errorMsg}`)
        errors.push(errorMsg)
      }
    }

    const totalCleaned = expiredOtps + expiredBlacklist + expiredTokens + oldUsers
    console.log(`🎉 Cleanup completed. Total records cleaned: ${totalCleaned}`)

    return {
      success: errors.length === 0,
      summary: {
        expiredOtps,
        expiredBlacklist,
        expiredTokens,
        oldUsers,
        totalCleaned
      },
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error) {
    console.error('❌ Cleanup process failed:', error)
    return {
      success: false,
      summary: {
        expiredOtps,
        expiredBlacklist,
        expiredTokens,
        oldUsers,
        totalCleaned: expiredOtps + expiredBlacklist + expiredTokens + oldUsers
      },
      errors: [...errors, `Cleanup process failed: ${error}`]
    }
  }
}

/**
 * Clean up old OTP records beyond retention period
 */
async function cleanupOldOtpRecords(retentionDays: number, batchSize: number): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  let totalCleaned = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabaseAdmin
      .from('otp_codes')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select('id')
      .limit(batchSize)

    if (error) {
      throw new Error(error.message)
    }

    const cleaned = data?.length || 0
    totalCleaned += cleaned
    hasMore = cleaned === batchSize

    if (cleaned > 0) {
      console.log(`    Cleaned batch of ${cleaned} old OTP records`)
    }
  }

  return totalCleaned
}

/**
 * Clean up old blacklist records beyond retention period
 */
async function cleanupOldBlacklistRecords(retentionDays: number, batchSize: number): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  let totalCleaned = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabaseAdmin
      .from('otp_blacklist')
      .delete()
      .lt('expires_at', cutoffDate.toISOString())
      .select('id')
      .limit(batchSize)

    if (error) {
      throw new Error(error.message)
    }

    const cleaned = data?.length || 0
    totalCleaned += cleaned
    hasMore = cleaned === batchSize

    if (cleaned > 0) {
      console.log(`    Cleaned batch of ${cleaned} old blacklist records`)
    }
  }

  return totalCleaned
}

/**
 * Clean up users that haven't been used recently and have no associated data
 */
async function cleanupUnusedUsers(retentionDays: number, batchSize: number): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  // Find users that are old and have no recent OTP activity
  const { data: unusedUsers, error: findError } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      created_at,
      otp_codes!inner(id)
    `)
    .lt('created_at', cutoffDate.toISOString())
    .limit(batchSize)

  if (findError) {
    throw new Error(findError.message)
  }

  if (!unusedUsers || unusedUsers.length === 0) {
    return 0
  }

  // Filter users with no recent OTP activity
  const usersToDelete = unusedUsers.filter(user => 
    !user.otp_codes || user.otp_codes.length === 0
  )

  if (usersToDelete.length === 0) {
    return 0
  }

  // Delete unused users
  const userIds = usersToDelete.map(user => user.id)
  const { error: deleteError } = await supabaseAdmin
    .from('users')
    .delete()
    .in('id', userIds)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  return usersToDelete.length
}

/**
 * Clean up old refresh token records beyond retention period
 */
async function cleanupOldRefreshTokens(retentionDays: number, batchSize: number): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  let totalCleaned = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabaseAdmin
      .from('refresh_tokens')
      .delete()
      .lt('expires_at', cutoffDate.toISOString())
      .select('id')
      .limit(batchSize)

    if (error) {
      throw new Error(error.message)
    }

    const cleaned = data?.length || 0
    totalCleaned += cleaned
    hasMore = cleaned === batchSize

    if (cleaned > 0) {
      console.log(`    Cleaned batch of ${cleaned} old refresh token records`)
    }
  }

  return totalCleaned
}

/**
 * Get cleanup statistics without performing cleanup
 */
export async function getCleanupStats(
  config: CleanupConfig = DEFAULT_CLEANUP_CONFIG
): Promise<{
  expiredOtps: number
  oldOtps: number
  expiredBlacklist: number
  oldBlacklist: number
  expiredTokens: number
  oldTokens: number
  unusedUsers: number
}> {
  const now = new Date().toISOString()
  const otpCutoff = new Date()
  otpCutoff.setDate(otpCutoff.getDate() - config.otpRetentionDays)
  
  const blacklistCutoff = new Date()
  blacklistCutoff.setDate(blacklistCutoff.getDate() - config.blacklistRetentionDays)

  const tokenCutoff = new Date()
  tokenCutoff.setDate(tokenCutoff.getDate() - config.refreshTokenRetentionDays)

  const userCutoff = new Date()
  userCutoff.setDate(userCutoff.getDate() - config.userRetentionDays)

  const [expiredOtps, oldOtps, expiredBlacklist, oldBlacklist, expiredTokens, oldTokens, unusedUsers] = await Promise.all([
    // Expired OTPs
    supabaseAdmin
      .from('otp_codes')
      .select('id', { count: 'exact', head: true })
      .lt('expires_at', now)
      .eq('is_used', false),

    // Old OTPs
    supabaseAdmin
      .from('otp_codes')
      .select('id', { count: 'exact', head: true })
      .lt('created_at', otpCutoff.toISOString()),

    // Expired blacklist
    supabaseAdmin
      .from('otp_blacklist')
      .select('id', { count: 'exact', head: true })
      .lt('expires_at', now),

    // Old blacklist
    supabaseAdmin
      .from('otp_blacklist')
      .select('id', { count: 'exact', head: true })
      .lt('expires_at', blacklistCutoff.toISOString()),

    // Expired refresh tokens
    supabaseAdmin
      .from('refresh_tokens')
      .select('id', { count: 'exact', head: true })
      .lt('expires_at', now),

    // Old refresh tokens
    supabaseAdmin
      .from('refresh_tokens')
      .select('id', { count: 'exact', head: true })
      .lt('expires_at', tokenCutoff.toISOString()),

    // Unused users
    supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })
      .lt('created_at', userCutoff.toISOString())
  ])

  return {
    expiredOtps: expiredOtps.count || 0,
    oldOtps: oldOtps.count || 0,
    expiredBlacklist: expiredBlacklist.count || 0,
    oldBlacklist: oldBlacklist.count || 0,
    expiredTokens: expiredTokens.count || 0,
    oldTokens: oldTokens.count || 0,
    unusedUsers: unusedUsers.count || 0
  }
}