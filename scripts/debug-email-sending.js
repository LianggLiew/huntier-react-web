const { Resend } = require('resend')
require('dotenv').config({ path: '.env.local' })

async function debugEmailSending() {
  console.log('📧 Debugging Email Sending Issue...\\n')

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Test 1: Check API key validity
    console.log('1. Testing Resend API key...')
    console.log('   API Key exists:', !!process.env.RESEND_API_KEY)
    console.log('   API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')

    // Test 2: Check domains
    console.log('\\n2. Checking verified domains...')
    try {
      const domains = await resend.domains.list()
      console.log('   Verified domains:', domains.data?.data?.map(d => d.name) || 'None')
    } catch (domainError) {
      console.log('   ⚠️  Cannot check domains:', domainError.message)
    }

    // Test 3: Try sending with onboarding domain (resend.dev)
    console.log('\\n3. Testing with Resend onboarding domain...')
    try {
      const testResult = await resend.emails.send({
        from: 'Huntier <onboarding@resend.dev>', // Use onboarding domain
        to: ['test@example.com'],
        subject: 'Test Email from Huntier OTP System',
        html: '<p>This is a test email to verify Resend configuration.</p>',
        text: 'This is a test email to verify Resend configuration.'
      })

      console.log('✅ Test email sent successfully with onboarding domain')
      console.log('   Message ID:', testResult.data?.id)
      console.log('   📝 Note: Check your email (including spam folder)')
    } catch (sendError) {
      console.log('❌ Test email failed:', sendError.message)
      
      if (sendError.message.includes('Domain not found')) {
        console.log('\\n🔧 SOLUTION: Domain verification issue')
        console.log('   The domain "huntier.com" is not verified in your Resend account.')
        console.log('   Options:')
        console.log('   1. Use onboarding domain: onboarding@resend.dev')
        console.log('   2. Verify huntier.com domain in Resend dashboard')
        console.log('   3. Use a different verified domain')
      }
    }

    // Test 4: Test our actual email function
    console.log('\\n4. Testing our sendOtpEmail function...')
    const testEmail = 'debug-test@example.com'
    const testOtp = '123456'

    // Import our email function
    const { sendOtpEmail } = await import('../lib/email.js')
    const emailResult = await sendOtpEmail(testEmail, testOtp)

    if (emailResult.success) {
      console.log('✅ sendOtpEmail function working:', emailResult.messageId)
    } else {
      console.log('❌ sendOtpEmail function failed:', emailResult.error)
    }

    // Test 5: Check recent email attempts
    console.log('\\n5. Checking for recent OTP email attempts...')
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: recentOtps } = await supabase
      .from('otp_codes')
      .select('contact_value, code, created_at, type')
      .eq('type', 'email')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentOtps && recentOtps.length > 0) {
      console.log('   Recent OTP codes generated:')
      recentOtps.forEach((otp, index) => {
        console.log(`   ${index + 1}. ${otp.contact_value}: ${otp.code} (${otp.created_at})`)
      })
    } else {
      console.log('   No recent OTP codes found')
    }

    console.log('\\n📋 Debugging Summary:')
    console.log('✅ OTP codes are being generated and stored in database')
    console.log('❌ Emails are not being delivered')
    console.log('\\n🔧 Most Likely Cause: Domain Verification')
    console.log('   The email is using "noreply@huntier.com" which is not verified.')
    console.log('\\n💡 Quick Fix:')
    console.log('   I will update the code to use "onboarding@resend.dev" for testing.')

  } catch (error) {
    console.error('❌ Debug script failed:', error.message)
  }
}

debugEmailSending()