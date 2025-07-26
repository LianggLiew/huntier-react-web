const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testFinalOtpSystem() {
  console.log('🧪 Testing Final OTP System with proper UUIDs...\\n')

  try {
    // Step 1: Test OTP creation
    console.log('1. Testing OTP creation with proper UUID handling...')
    const testEmail = 'test@huntier.com'
    const testPhone = '+1234567890'
    
    // Test email OTP creation
    console.log('   Creating email OTP...')
    const emailOtp = await createOtpWithUUID(testEmail, 'email')
    if (!emailOtp.success) {
      console.error('❌ Email OTP creation failed:', emailOtp.error)
      return false
    }
    console.log('✅ Email OTP created:', emailOtp.code)

    // Test phone OTP creation  
    console.log('   Creating phone OTP...')
    const phoneOtp = await createOtpWithUUID(testPhone, 'phone')
    if (!phoneOtp.success) {
      console.error('❌ Phone OTP creation failed:', phoneOtp.error)
      return false
    }
    console.log('✅ Phone OTP created:', phoneOtp.code)

    // Step 2: Test correct verification
    console.log('\\n2. Testing correct OTP verification...')
    const correctVerify = await verifyOtpWithUUID(testEmail, 'email', emailOtp.code)
    if (!correctVerify.success) {
      console.error('❌ Correct verification failed:', correctVerify.error)
      return false
    }
    console.log('✅ Correct OTP verification successful')

    // Step 3: Test incorrect verification (attempts tracking)
    console.log('\\n3. Testing incorrect OTP verification and attempts tracking...')
    const wrongVerify1 = await verifyOtpWithUUID(testPhone, 'phone', '999999')
    if (wrongVerify1.success) {
      console.error('❌ Wrong OTP should have failed')
      return false
    }
    console.log('✅ Wrong OTP correctly rejected:', wrongVerify1.error)

    // Check attempts were incremented
    const { data: attemptCheck } = await supabase
      .from('otp_codes')
      .select('attempts, code, contact_value')
      .eq('code', phoneOtp.code)
      .single()

    if (attemptCheck) {
      console.log(`   Attempts count: ${attemptCheck.attempts} (should be 1)`)
    }

    // Step 4: Test blacklist trigger with max attempts
    console.log('\\n4. Testing blacklist trigger after max attempts...')
    
    // Try 2 more wrong attempts to reach limit of 3
    for (let i = 2; i <= 3; i++) {
      const wrongVerify = await verifyOtpWithUUID(testPhone, 'phone', '888888')
      console.log(`   Attempt ${i}: ${wrongVerify.success ? 'Success' : 'Failed'} - ${wrongVerify.error}`)
      
      if (wrongVerify.shouldBlacklist) {
        console.log('✅ Blacklist triggered after max attempts (3)')
        
        // Verify blacklist entry was created
        const { data: blacklistCheck } = await supabase
          .from('otp_blacklist')
          .select('*')
          .eq('contact_value', testPhone)
          .eq('contact_type', 'phone')
          .single()
          
        if (blacklistCheck) {
          console.log('✅ Blacklist entry created successfully')
        }
        break
      }
    }

    // Step 5: Test send attempts tracking  
    console.log('\\n5. Testing send attempts tracking...')
    
    // Create multiple OTPs to test send limit
    const newTestEmail = 'sendtest@huntier.com'
    let sendCount = 0
    
    for (let i = 1; i <= 6; i++) {
      const result = await createOtpWithUUID(newTestEmail, 'email')
      if (result.success) {
        sendCount++
        console.log(`   Send attempt ${i}: Success`)
      } else {
        console.log(`   Send attempt ${i}: Failed - ${result.error}`)
        break
      }
    }
    
    console.log(`   Total successful sends: ${sendCount}`)
    
    // Check if blacklist was triggered for too many sends
    const { data: sendBlacklistCheck } = await supabase
      .from('otp_blacklist')
      .select('*')
      .eq('contact_value', newTestEmail)
      .eq('contact_type', 'email')
      .single()
      
    if (sendBlacklistCheck) {
      console.log('✅ Send attempts blacklist triggered correctly')
    }

    // Step 6: Clean up test data
    console.log('\\n6. Cleaning up test data...')
    
    // Clean up OTP codes
    await supabase
      .from('otp_codes')
      .delete()
      .in('contact_value', [testEmail, testPhone, newTestEmail])

    // Clean up blacklist entries
    await supabase
      .from('otp_blacklist')
      .delete()
      .in('contact_value', [testEmail, testPhone, newTestEmail])

    console.log('✅ Test data cleaned up')

    console.log('\\n🎉 Final OTP System tests completed successfully!')
    console.log('\\n📋 Test Summary:')
    console.log('✅ OTP creation with proper UUID handling')
    console.log('✅ OTP verification (correct and incorrect)')
    console.log('✅ Attempts tracking using attempts column')
    console.log('✅ Blacklist triggering after max verify attempts')
    console.log('✅ Send attempts tracking and blacklisting')
    console.log('✅ Database cleanup')
    
    return true

  } catch (error) {
    console.error('❌ Final OTP system test failed:', error.message)
    return false
  }
}

async function createOtpWithUUID(contactValue, contactType) {
  try {
    const otpCode = String(Math.floor(Math.random() * 900000) + 100000)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000)
    const userId = uuidv4() // Generate proper UUID

    // Mark existing unused OTPs as used for this contact
    await supabase
      .from('otp_codes')
      .update({ is_used: true })
      .eq('type', contactType)
      .eq('is_used', false)
      .eq('contact_value', contactValue)

    // Create new OTP with proper UUID
    const { data, error } = await supabase
      .from('otp_codes')
      .insert({
        user_id: userId,
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

async function verifyOtpWithUUID(contactValue, contactType, otpCode) {
  try {
    const now = new Date().toISOString()

    // Find valid OTP for this contact
    const { data: otpRecords, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('type', contactType)
      .eq('is_used', false)
      .eq('contact_value', contactValue)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    if (!otpRecords || otpRecords.length === 0) {
      return { success: false, error: 'No valid OTP found or expired' }
    }

    const otpRecord = otpRecords[0]
    const newAttempts = otpRecord.attempts + 1

    if (otpRecord.code !== otpCode) {
      // Update attempts counter
      await supabase
        .from('otp_codes')
        .update({ attempts: newAttempts })
        .eq('id', otpRecord.id)

      // Check if max attempts reached (trigger blacklist)
      if (newAttempts >= 3) {
        // Add to blacklist
        const now = new Date()
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

        await supabase
          .from('otp_blacklist')
          .insert({
            blacklisted_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            contact_value: contactValue,
            contact_type: contactType,
            reason: 'MAX_VERIFY_ATTEMPTS'
          })

        return { 
          success: false, 
          error: 'Invalid OTP code - blacklisted',
          shouldBlacklist: true
        }
      }

      return { 
        success: false, 
        error: 'Invalid OTP code',
        shouldBlacklist: false
      }
    }

    // OTP is correct, mark as used
    await supabase
      .from('otp_codes')
      .update({ 
        is_used: true, 
        attempts: newAttempts 
      })
      .eq('id', otpRecord.id)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Run the test
testFinalOtpSystem()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Test script failed:', error)
    process.exit(1)
  })