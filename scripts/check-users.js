const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkUsers() {
  console.log('👥 Checking users table and existing user_ids...\\n')

  try {
    // Check if there's a users table and get some sample user IDs
    console.log('1. Checking for users table...')
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(5)

    if (usersError) {
      console.log('⚠️  No users table found or accessible:', usersError.message)
    } else {
      console.log('✅ Users table found. Sample user IDs:')
      usersData.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.id}`)
      })
    }

    // Check what user_id exists in the current otp_codes table
    console.log('\\n2. Checking existing user_ids in otp_codes table...')
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('user_id')
      .limit(5)

    if (!otpError && otpData && otpData.length > 0) {
      console.log('✅ Found existing user_ids in otp_codes:')
      const uniqueUserIds = [...new Set(otpData.map(otp => otp.user_id))]
      uniqueUserIds.forEach((userId, index) => {
        console.log(`   ${index + 1}. ${userId}`)
      })
      
      // Test with an existing user_id
      console.log('\\n3. Testing OTP creation with existing user_id...')
      const testUserId = uniqueUserIds[0]
      const testResult = await testOtpWithExistingUser(testUserId)
      
      if (testResult.success) {
        console.log('✅ OTP creation successful with existing user_id!')
        console.log('🎯 Use this user_id for testing:', testUserId)
        
        // Clean up
        await supabase
          .from('otp_codes')
          .delete()
          .eq('code', testResult.code)
      } else {
        console.log('❌ OTP creation failed:', testResult.error)
      }
    } else {
      console.log('⚠️  No existing OTP records found')
    }

    // Check auth.users (Supabase auth table)
    console.log('\\n4. Checking auth.users table...')
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (!authError && authUsers.users && authUsers.users.length > 0) {
        console.log('✅ Found auth users:')
        authUsers.users.slice(0, 3).forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.id} (${user.email || 'no email'})`)
        })
        
        console.log('\\n🎯 Recommendation: Use one of these auth user IDs for testing')
      } else {
        console.log('⚠️  No auth users found or accessible')
      }
    } catch (authError) {
      console.log('⚠️  Cannot access auth.users:', authError.message)
    }

  } catch (error) {
    console.error('❌ Failed to check users:', error.message)
  }
}

async function testOtpWithExistingUser(userId) {
  try {
    const otpCode = String(Math.floor(Math.random() * 900000) + 100000)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000)

    const { data, error } = await supabase
      .from('otp_codes')
      .insert({
        user_id: userId,
        code: otpCode,
        type: 'email',
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        is_used: false,
        resend_count: 0,
        contact_value: 'test@example.com',
        contact_type: 'email'
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, code: otpCode, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

checkUsers()