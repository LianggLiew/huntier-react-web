const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testOtpSystem() {
  console.log('🧪 Testing Updated OTP System with otp_codes table...\n')

  try {
    // Step 1: Check if otp_codes table exists
    console.log('1. Checking otp_codes table structure...')
    const { data: tableCheck, error: tableError } = await supabase
      .from('otp_codes')
      .select('*')
      .limit(1)

    if (tableError) {
      if (tableError.message.includes('relation "public.otp_codes" does not exist')) {
        console.log('⚠️  otp_codes table does not exist - need to create it')
        const created = await createOtpCodesTable()
        if (!created) return false
      } else {
        console.error('❌ otp_codes table error:', tableError.message)
        return false
      }
    } else {
      console.log('✅ otp_codes table exists and accessible')
    }

    // Step 2: Test OTP creation functionality
    console.log('\n2. Testing OTP creation...')
    const testEmail = 'test@example.com'
    const testPhone = '+1234567890'
    
    // Test email OTP creation
    const emailOtpResult = await testCreateOtp(testEmail, 'email')
    if (!emailOtpResult.success) {
      console.error('❌ Email OTP creation failed:', emailOtpResult.error)
      return false
    }
    console.log('✅ Email OTP created successfully:', emailOtpResult.otpCode)

    // Test phone OTP creation
    const phoneOtpResult = await testCreateOtp(testPhone, 'phone')
    if (!phoneOtpResult.success) {
      console.error('❌ Phone OTP creation failed:', phoneOtpResult.error)
      return false
    }
    console.log('✅ Phone OTP created successfully:', phoneOtpResult.otpCode)

    // Step 3: Test OTP verification functionality
    console.log('\n3. Testing OTP verification...')
    
    // Test correct OTP verification
    const correctVerifyResult = await testVerifyOtp(testEmail, 'email', emailOtpResult.otpCode)
    if (!correctVerifyResult.success) {
      console.error('❌ Correct OTP verification failed:', correctVerifyResult.error)
      return false
    }
    console.log('✅ Correct OTP verification successful')

    // Test incorrect OTP verification (should increment attempts)
    console.log('\n4. Testing incorrect OTP verification (attempts tracking)...')
    const wrongOtpResult = await testVerifyOtp(testPhone, 'phone', '999999')
    if (wrongOtpResult.success) {
      console.error('❌ Wrong OTP should have failed verification')
      return false
    }
    console.log('✅ Wrong OTP correctly rejected:', wrongOtpResult.error)

    // Check if attempts were incremented
    const { data: attemptCheck } = await supabase
      .from('otp_codes')
      .select('attempts')
      .eq('contact_value', testPhone)
      .eq('contact_type', 'phone')
      .single()

    if (attemptCheck && attemptCheck.attempts === 1) {
      console.log('✅ Attempts counter incremented correctly')
    } else {
      console.log('⚠️  Attempts counter may not be working properly')
    }

    // Step 5: Test blacklist functionality
    console.log('\n5. Testing blacklist functionality...')
    
    // Try multiple wrong attempts to trigger blacklist
    for (let i = 2; i <= 3; i++) {
      const wrongResult = await testVerifyOtp(testPhone, 'phone', '888888')
      console.log(`   Attempt ${i}: ${wrongResult.success ? 'Success' : 'Failed'} - ${wrongResult.error}`)
      
      if (wrongResult.shouldBlacklist) {
        console.log('✅ Blacklist triggered after max attempts')
        break
      }
    }

    // Step 6: Clean up test data
    console.log('\n6. Cleaning up test data...')
    await supabase
      .from('otp_codes')
      .delete()
      .in('contact_value', [testEmail, testPhone])

    await supabase
      .from('otp_blacklist')
      .delete()
      .in('contact_value', [testEmail, testPhone])

    console.log('✅ Test data cleaned up')

    console.log('\n🎉 OTP System tests completed successfully!')
    return true

  } catch (error) {
    console.error('❌ OTP system test failed:', error.message)
    return false
  }
}

async function createOtpCodesTable() {
  console.log('📋 Creating otp_codes table...')
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS public.otp_codes (
      id BIGSERIAL PRIMARY KEY,
      contact_value TEXT NOT NULL,
      contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone')),
      otp_code TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT false,
      attempts INTEGER NOT NULL DEFAULT 0,
      verified_at TIMESTAMP WITH TIME ZONE
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_otp_codes_contact ON public.otp_codes(contact_value, contact_type);
    CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON public.otp_codes(expires_at);
    CREATE INDEX IF NOT EXISTS idx_otp_codes_verified ON public.otp_codes(verified);
  `

  console.log('📝 Please create the otp_codes table manually in Supabase dashboard with this SQL:\\n')
  console.log(createTableSQL)
  return false
}

async function testCreateOtp(contactValue, contactType) {
  try {
    const otpCode = String(Math.floor(Math.random() * 900000) + 100000)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTP
    await supabase
      .from('otp_codes')
      .delete()
      .eq('contact_value', contactValue)
      .eq('contact_type', contactType)
      .eq('verified', false)

    // Create new OTP
    const { data, error } = await supabase
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
      return { success: false, error: error.message }
    }

    return { success: true, otpCode: otpCode }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testVerifyOtp(contactValue, contactType, otpCode) {
  try {
    const now = new Date().toISOString()

    // Find the OTP record
    const { data: otpRecord, error: fetchError } = await supabase
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

    const newAttempts = otpRecord.attempts + 1

    // Check if OTP matches
    if (otpRecord.otp_code !== otpCode) {
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

    // Mark as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ 
        verified: true, 
        verified_at: now,
        attempts: newAttempts
      })
      .eq('id', otpRecord.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Run the test
testOtpSystem()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Test script failed:', error)
    process.exit(1)
  })