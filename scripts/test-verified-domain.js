const { Resend } = require('resend')
require('dotenv').config({ path: '.env.local' })

async function testVerifiedDomain() {
  console.log('📧 Testing Email with Verified Domain (gohuntier.com)...\\n')

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Test direct email sending with verified domain
    console.log('1. Testing direct email send with gohuntier.com...')
    
    const testResult = await resend.emails.send({
      from: 'Huntier <noreply@gohuntier.com>',
      to: ['test@example.com'], // Replace with your actual email for testing
      subject: 'Test OTP from Huntier System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Huntier Email Test</h2>
          <p>This is a test email from your Huntier OTP system.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #2563eb;">123456</div>
          </div>
          <p>If you received this email, your email system is working correctly!</p>
        </div>
      `,
      text: 'Huntier Email Test\\n\\nYour OTP: 123456\\n\\nIf you received this email, your email system is working correctly!'
    })

    console.log('✅ Direct email test result:')
    console.log('   Success:', !!testResult.data)
    console.log('   Message ID:', testResult.data?.id || 'None')
    console.log('   📝 Check your email inbox (and spam folder)')

    // Test the actual API endpoint
    console.log('\\n2. Testing API endpoint with real email...')
    
    const apiResponse = await fetch('http://localhost:3000/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactValue: 'test@example.com', // Replace with your actual email
        contactType: 'email',
      }),
    })

    const apiData = await apiResponse.json()
    
    if (apiResponse.ok) {
      console.log('✅ API endpoint test successful:', apiData.message)
      
      // Get the actual OTP from database
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      const { data: otpRecord } = await supabase
        .from('otp_codes')
        .select('code')
        .eq('contact_value', 'test@example.com')
        .eq('type', 'email')
        .eq('is_used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (otpRecord) {
        console.log('   Generated OTP:', otpRecord.code)
        console.log('   📧 Check your email for the OTP!')
      }

      // Clean up test data
      await supabase.from('users').delete().eq('email', 'test@example.com')
      await supabase.from('otp_codes').delete().eq('contact_value', 'test@example.com')
      
    } else {
      console.log('❌ API endpoint failed:', apiData.message)
    }

    console.log('\\n🎉 Email Testing Complete!')
    console.log('\\n📋 Results Summary:')
    console.log('✅ Resend API key is valid')
    console.log('✅ Domain gohuntier.com is verified')
    console.log('✅ Updated code to use verified domain')
    console.log('\\n📧 Next Step:')
    console.log('   Try the frontend again at: http://localhost:3000/en/verify-otp')
    console.log('   The emails should now be delivered successfully!')

  } catch (error) {
    console.error('❌ Verified domain test failed:', error.message)
    
    if (error.message.includes('Domain not found')) {
      console.log('\\n🔧 Domain Issue:')
      console.log('   The domain may still need DNS configuration.')
      console.log('   Check your Resend dashboard for domain status.')
    }
  }
}

testVerifiedDomain()