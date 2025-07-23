const { Resend } = require('resend')
require('dotenv').config({ path: '.env.local' })

async function testResendAPI() {
  console.log('🔍 Testing Resend API Configuration...\n')

  // Check environment variables
  console.log('📋 Environment Check:')
  const apiKey = process.env.RESEND_API_KEY
  console.log(`   RESEND_API_KEY: ${apiKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   API Key format: ${apiKey ? apiKey.substring(0, 10) + '...' : 'N/A'}`)
  console.log(`   API Key length: ${apiKey?.length || 0} characters`)
  console.log()

  if (!apiKey) {
    console.log('❌ RESEND_API_KEY is missing in .env.local file')
    console.log('💡 Please add RESEND_API_KEY=your_api_key to .env.local')
    return
  }

  const resend = new Resend(apiKey)

  try {
    console.log('🔧 Testing API Key Validity...')
    
    // Test 1: Check API key by getting domains
    try {
      const domains = await resend.domains.list()
      console.log('✅ API Key is valid - can access domains')
      console.log(`   Found ${domains.data?.length || 0} domains`)
      
      if (domains.data && domains.data.length > 0) {
        console.log('📋 Your verified domains:')
        domains.data.forEach(domain => {
          console.log(`   • ${domain.name} - Status: ${domain.status} - Region: ${domain.region || 'N/A'}`)
        })
      } else {
        console.log('⚠️  No domains found - you may need to verify a domain')
      }
      console.log()
    } catch (domainError) {
      console.log('❌ Cannot access domains:', domainError.message)
      console.log('💡 This might indicate an invalid API key or insufficient permissions')
      console.log()
    }

    // Test 2: Try to send a simple test email
    console.log('📧 Testing Email Send...')
    
    const testPayload = {
      from: 'onboarding@resend.dev',
      to: ['test@example.com'],
      subject: 'Resend API Test',
      html: '<p>This is a test email from Resend API</p>',
      text: 'This is a test email from Resend API'
    }
    
    console.log('📤 Sending test email with payload:')
    console.log(JSON.stringify(testPayload, null, 2))
    
    const response = await resend.emails.send(testPayload)
    
    console.log('✅ Email API call succeeded!')
    console.log('📊 Full API Response:')
    console.log(JSON.stringify(response, null, 2))
    
    if (response.data?.id || response.id) {
      const messageId = response.data?.id || response.id
      console.log(`✅ Message ID: ${messageId}`)
      console.log('💡 Check your Resend dashboard for delivery status')
    } else {
      console.log('⚠️  No message ID returned - this is unusual')
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error)
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('\n💡 Authentication Error:')
      console.log('   - Check if your API key is correct')
      console.log('   - Make sure the key starts with "re_"')
      console.log('   - Verify the key hasn\'t expired')
      console.log('   - Check if you\'re using the right environment (test vs production)')
    }
    
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      console.log('\n💡 Permission Error:')
      console.log('   - Your API key might not have email sending permissions')
      console.log('   - Check your Resend account limits')
    }
    
    if (error.message.includes('domain')) {
      console.log('\n💡 Domain Error:')
      console.log('   - You might need to verify a sending domain')
      console.log('   - Try using a different "from" address')
    }
  }

  console.log('\n🔧 Troubleshooting Steps:')
  console.log('1. Log into resend.com and check:')
  console.log('   - API Keys section for valid keys')
  console.log('   - Logs section for any send attempts')
  console.log('   - Domains section for verified domains')
  console.log('2. Make sure your API key has sending permissions')
  console.log('3. Try regenerating your API key if needed')
  console.log('4. Check if you\'re hitting any rate limits')
}

testResendAPI()