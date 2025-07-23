const { Resend } = require('resend')
require('dotenv').config({ path: '.env.local' })

async function debugEmailDelivery() {
  console.log('🔍 Debugging Email Delivery...\n')

  // Check environment variables
  console.log('📋 Environment Check:')
  console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`)
  console.log(`   API Key length: ${process.env.RESEND_API_KEY?.length || 0} characters`)
  console.log()

  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY is missing in .env.local file')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    console.log('📧 Testing Direct Email Send...')
    
    const testEmail = process.argv[2] || 'test@example.com'
    console.log(`   Target email: ${testEmail}`)
    console.log(`   From: Huntier <onboarding@resend.dev>`)
    
    const response = await resend.emails.send({
      from: 'Huntier <onboarding@resend.dev>',
      to: [testEmail],
      subject: 'Debug Test - Your Huntier Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Huntier Email Debug Test</h1>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">123456</span>
          </div>
          <p>This is a debug test email. If you received this, email delivery is working!</p>
          <p><strong>Time sent:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
      text: `
Huntier Email Debug Test

Your verification code is: 123456

This is a debug test email. If you received this, email delivery is working!

Time sent: ${new Date().toISOString()}
      `.trim()
    })

    console.log('✅ Email sent successfully!')
    console.log('📊 Full Response:')
    console.log(JSON.stringify(response, null, 2))
    console.log('📊 Response details:')
    console.log(`   Message ID: ${response.data?.id || response.id}`)
    console.log(`   From: ${response.data?.from || response.from}`)
    console.log(`   To: ${response.data?.to || response.to}`)
    console.log(`   Subject: ${response.data?.subject || response.subject}`)
    console.log()

    // Get domain verification status
    console.log('🔍 Checking Resend Domain Status...')
    try {
      const domains = await resend.domains.list()
      console.log('📋 Domains in your Resend account:')
      domains.data?.forEach(domain => {
        console.log(`   • ${domain.name} - Status: ${domain.status}`)
      })
    } catch (domainError) {
      console.log('⚠️  Could not fetch domain information:', domainError.message)
    }

    console.log('\n🎉 Email delivery test completed!')
    console.log('💡 Tips for troubleshooting:')
    console.log('   1. Check your spam/junk folder')
    console.log('   2. Wait a few minutes - delivery can be delayed')
    console.log('   3. Try a different email address')
    console.log('   4. Check Resend dashboard for delivery logs')
    console.log('   5. Verify your sending domain is properly configured')

  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    if (error.message.includes('API key')) {
      console.log('\n💡 API Key Issues:')
      console.log('   - Make sure your RESEND_API_KEY is correct')
      console.log('   - Check if the key has expired')
      console.log('   - Verify the key has sending permissions')
    }
    
    if (error.message.includes('domain')) {
      console.log('\n💡 Domain Issues:')
      console.log('   - Verify onboarding@resend.dev is accessible')
      console.log('   - Check domain verification in Resend dashboard')
      console.log('   - Try using a verified domain instead')
    }
  }
}

// Usage: node scripts/debug-email.js your-email@example.com
debugEmailDelivery()