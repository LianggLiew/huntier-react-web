const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Import cleanup functions
async function runScheduledCleanup() {
  console.log('🕐 Starting scheduled cleanup job...')
  console.log(`   Time: ${new Date().toISOString()}`)

  try {
    // Import the cleanup service
    const { performCleanup, DEFAULT_CLEANUP_CONFIG } = await import('../lib/cleanup-service.js')

    // Custom config for scheduled cleanup
    const cleanupConfig = {
      ...DEFAULT_CLEANUP_CONFIG,
      otpRetentionDays: 3,        // More aggressive cleanup for scheduled runs
      blacklistRetentionDays: 7,  // Keep blacklist history for 1 week
      userRetentionDays: 30,      // Keep unused users for 30 days
      batchSize: 50,              // Smaller batches for scheduled runs
      cleanupUsers: false         // Don't auto-cleanup users in scheduled runs
    }

    console.log('📋 Cleanup configuration:')
    console.log(`   OTP retention: ${cleanupConfig.otpRetentionDays} days`)
    console.log(`   Blacklist retention: ${cleanupConfig.blacklistRetentionDays} days`)
    console.log(`   User retention: ${cleanupConfig.userRetentionDays} days`)
    console.log(`   Batch size: ${cleanupConfig.batchSize}`)
    console.log(`   Cleanup users: ${cleanupConfig.cleanupUsers}`)

    const result = await performCleanup(cleanupConfig)

    if (result.success) {
      console.log('✅ Scheduled cleanup completed successfully!')
      console.log('📊 Summary:')
      console.log(`   Expired OTPs cleaned: ${result.summary.expiredOtps}`)
      console.log(`   Expired blacklist entries cleaned: ${result.summary.expiredBlacklist}`)
      console.log(`   Old users cleaned: ${result.summary.oldUsers}`)
      console.log(`   Total records cleaned: ${result.summary.totalCleaned}`)

      // Log to a cleanup history table if it exists
      await logCleanupHistory(result.summary)

    } else {
      console.log('⚠️  Scheduled cleanup completed with errors:')
      console.log('📊 Summary:')
      console.log(`   Total records cleaned: ${result.summary.totalCleaned}`)
      console.log('❌ Errors:')
      result.errors?.forEach(error => console.log(`   - ${error}`))
    }

    console.log(`🕐 Cleanup job finished at: ${new Date().toISOString()}`)
    return result

  } catch (error) {
    console.error('❌ Scheduled cleanup failed:', error.message)
    throw error
  }
}

async function logCleanupHistory(summary) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Try to log cleanup history (table may not exist)
    const { error } = await supabase
      .from('cleanup_history')
      .insert({
        performed_at: new Date().toISOString(),
        expired_otps: summary.expiredOtps,
        expired_blacklist: summary.expiredBlacklist,
        old_users: summary.oldUsers,
        total_cleaned: summary.totalCleaned
      })

    if (!error) {
      console.log('📝 Cleanup history logged')
    }
  } catch (error) {
    // Ignore logging errors - cleanup history table is optional
    console.log('📝 Cleanup history logging skipped (table may not exist)')
  }
}

// Check if this script is being run directly
if (require.main === module) {
  runScheduledCleanup()
    .then(() => {
      console.log('🎉 Scheduled cleanup script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Scheduled cleanup script failed:', error)
      process.exit(1)
    })
}

module.exports = { runScheduledCleanup }