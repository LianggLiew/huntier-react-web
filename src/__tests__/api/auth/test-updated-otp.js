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

async function testUpdatedOtpSystem() {
  console.log('🧪 Testing Updated OTP System with actual table schema...\\n')

  try {
    // Step 1: Test OTP creation
    console.log('1. Testing OTP creation with actual schema...')
    const testEmail = 'test@huntier.com'
    const testPhone = '+1234567890'
    
    // Test email OTP creation
    console.log('   Creating email OTP...')
    const emailOtp = await createOtpWithSchema(testEmail, 'email')
    if (!emailOtp.success) {
      console.error('❌ Email OTP creation failed:', emailOtp.error)
      return false
    }
    console.log('✅ Email OTP created:', emailOtp.code)

    // Test phone OTP creation
    console.log('   Creating phone OTP...')
    const phoneOtp = await createOtpWithSchema(testPhone, 'phone')
    if (!phoneOtp.success) {
      console.error('❌ Phone OTP creation failed:', phoneOtp.error)
      return false
    }
    console.log('✅ Phone OTP created:', phoneOtp.code)

    // Step 2: Test correct verification
    console.log('\\n2. Testing correct OTP verification...')
    const correctVerify = await verifyOtpWithSchema(testEmail, 'email', emailOtp.code)
    if (!correctVerify.success) {
      console.error('❌ Correct verification failed:', correctVerify.error)
      return false
    }
    console.log('✅ Correct OTP verification successful')

    // Step 3: Test incorrect verification (attempts tracking)
    console.log('\\n3. Testing incorrect OTP verification...')
    const wrongVerify1 = await verifyOtpWithSchema(testPhone, 'phone', '999999')
    if (wrongVerify1.success) {
      console.error('❌ Wrong OTP should have failed')
      return false
    }
    console.log('✅ Wrong OTP correctly rejected:', wrongVerify1.error)

    // Check attempts were incremented
    const { data: attemptCheck } = await supabase
      .from('otp_codes')
      .select('attempts, code')
      .eq('code', phoneOtp.code)
      .single()

    if (attemptCheck) {
      console.log(`   Attempts count: ${attemptCheck.attempts} (should be 1)`)
    }

    // Step 4: Test multiple wrong attempts
    console.log('\\n4. Testing multiple wrong attempts...')
    for (let i = 2; i <= 3; i++) {
      const wrongVerify = await verifyOtpWithSchema(testPhone, 'phone', '888888')
      console.log(`   Attempt ${i}: ${wrongVerify.success ? 'Success' : 'Failed'} - ${wrongVerify.error}`)
      
      if (wrongVerify.shouldBlacklist) {
        console.log('✅ Blacklist triggered after max attempts')
        break
      }
    }

    // Step 5: Test send attempts tracking
    console.log('\\n5. Testing send attempts tracking...')
    const sendAttempts = await checkSendAttemptsWithSchema(testEmail, 'email')
    console.log(`   Send attempts check: ${sendAttempts ? 'Would blacklist' : 'Within limits'}`)

    // Step 6: Clean up test data
    console.log('\\n6. Cleaning up test data...')
    const testCodes = [emailOtp.code, phoneOtp.code]
    for (const code of testCodes) {
      await supabase
        .from('otp_codes')
        .delete()
        .eq('code', code)
    }

    // Clean up any blacklist entries
    await supabase
      .from('otp_blacklist')
      .delete()
      .in('contact_value', [testEmail, testPhone])

    console.log('✅ Test data cleaned up')

    console.log('\\n🎉 Updated OTP System tests completed successfully!')
    return true

  } catch (error) {
    console.error('❌ Updated OTP system test failed:', error.message)
    return false
  }
}

async function createOtpWithSchema(contactValue, contactType) {
  try {
    const otpCode = String(Math.floor(Math.random() * 900000) + 100000)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000)
    const tempUserId = `temp_${contactValue.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`

    // Mark existing unused OTPs as used
    await supabase
      .from('otp_codes')
      .update({ is_used: true })
      .eq('type', contactType)
      .eq('is_used', false)
      .eq('contact_value', contactValue)

    // Create new OTP
    const { data, error } = await supabase
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
        contact_value: contactValue,
        contact_type: contactType
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

async function verifyOtpWithSchema(contactValue, contactType, otpCode) {
  try {
    const now = new Date().toISOString()

    // Find valid OTP
    const { data: otpRecords, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('type', contactType)
      .eq('is_used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // Filter by contact_value
    const validOtps = otpRecords?.filter(otp => otp.contact_value === contactValue) || []

    if (validOtps.length === 0) {
      return { success: false, error: 'No valid OTP found or expired' }
    }

    const otpRecord = validOtps[0]
    const newAttempts = otpRecord.attempts + 1

    if (otpRecord.code !== otpCode) {
      // Update attempts
      await supabase
        .from('otp_codes')
        .update({ attempts: newAttempts })
        .eq('id', otpRecord.id)

      return { 
        success: false, 
        error: 'Invalid OTP code',
        shouldBlacklist: newAttempts >= 3
      }
    }

    // Mark as used
    await supabase
      .from('otp_codes')
      .update({ is_used: true, attempts: newAttempts })
      .eq('id', otpRecord.id)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function checkSendAttemptsWithSchema(contactValue, contactType) {
  try {
    const windowStart = new Date()
    windowStart.setHours(windowStart.getHours() - 1) // 1 hour window

    const { data, error } = await supabase
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
    return attemptCount >= 5 // Max 5 attempts
  } catch (error) {
    console.error('Error in checkSendAttempts:', error)
    return false
  }
}

// Run the test
testUpdatedOtpSystem()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Test script failed:', error)
    process.exit(1)
  })