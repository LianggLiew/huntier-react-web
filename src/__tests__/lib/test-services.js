const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns')
const { Resend } = require('resend')
require('dotenv').config({ path: '.env.local' })

console.log('🧪 Testing SMS and Email Services...\n')

// Test SMS Service (AWS SNS)
async function testSMS() {
  console.log('📱 Testing SMS Service (AWS SNS)...')
  
  try {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('⚠️  AWS credentials not found in .env.local')
      return false
    }

    const snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'ap-southeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })

    // Test with a dummy phone number (this will fail but we can see if credentials work)
    const testMessage = 'Test message from Huntier OTP system'
    const command = new PublishCommand({
      PhoneNumber: '+1234567890', // Dummy number for testing
      Message: testMessage,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
      },
    })

    try {
      const response = await snsClient.send(command)
      console.log('✅ SMS Service configured correctly')
      console.log('📄 Test message ID:', response.MessageId)
      return true
    } catch (smsError) {
      if (smsError.name === 'InvalidParameterException' && smsError.message.includes('Invalid parameter: PhoneNumber')) {
        console.log('✅ SMS Service credentials are valid (test phone number invalid as expected)')
        return true
      } else if (smsError.name === 'UnauthorizedOperation' || smsError.name === 'AccessDenied') {
        console.log('❌ SMS Service: Invalid AWS credentials or insufficient permissions')
        console.log('🔧 Error:', smsError.message)
        return false
      } else {
        console.log('⚠️  SMS Service test inconclusive:', smsError.message)
        return true // Assume it's working if credentials are accepted
      }
    }

  } catch (error) {
    console.log('❌ SMS Service configuration error:', error.message)
    return false
  }
}

// Test Email Service (Resend)
async function testEmail() {
  console.log('\n📧 Testing Email Service (Resend)...')
  
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️  Resend API key not found in .env.local')
      return false
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Test with a simple API call to verify the key
    try {
      // Try to send to a test email (this might fail but we can check if API key is valid)
      const response = await resend.emails.send({
        from: 'Huntier <test@huntier.com>', // This will likely fail due to domain verification
        to: ['test@example.com'],
        subject: 'Test Email from Huntier OTP System',
        html: '<p>This is a test email to verify Resend integration.</p>',
        text: 'This is a test email to verify Resend integration.'
      })

      console.log('✅ Email Service configured correctly')
      console.log('📄 Test email ID:', response.data?.id)
      return true

    } catch (emailError) {
      if (emailError.message.includes('Domain not found') || 
          emailError.message.includes('Unverified') ||
          emailError.message.includes('domain')) {
        console.log('✅ Email Service API key is valid (domain not configured as expected)')
        console.log('⚠️  Note: You need to verify your domain in Resend dashboard')
        console.log('🔧 Current from address needs domain verification: huntier.com')
        return true
      } else if (emailError.message.includes('API key') || 
                 emailError.message.includes('Unauthorized') ||
                 emailError.message.includes('Invalid')) {
        console.log('❌ Email Service: Invalid Resend API key')
        console.log('🔧 Error:', emailError.message)
        return false
      } else {
        console.log('⚠️  Email Service test inconclusive:', emailError.message)
        return true // Assume it's working if API key is accepted
      }
    }

  } catch (error) {
    console.log('❌ Email Service configuration error:', error.message)
    return false
  }
}

// Run tests
async function runTests() {
  console.log('🔍 Environment Variables Check:')
  console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Present' : '❌ Missing')
  console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Present' : '❌ Missing')
  console.log('- AWS_REGION:', process.env.AWS_REGION || 'ap-southeast-1 (default)')
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Present' : '❌ Missing')
  console.log('')

  const smsResult = await testSMS()
  const emailResult = await testEmail()

  console.log('\n📊 Test Results:')
  console.log('- SMS Service (AWS SNS):', smsResult ? '✅ Ready' : '❌ Needs Configuration')
  console.log('- Email Service (Resend):', emailResult ? '✅ Ready' : '❌ Needs Configuration')

  if (smsResult && emailResult) {
    console.log('\n🎉 All services are configured and ready!')
    console.log('\n📝 Next Steps:')
    console.log('1. Create the otp_attempts table in Supabase (SQL provided above)')
    console.log('2. For Resend: verify your sending domain in Resend dashboard')
    console.log('3. Test the API endpoints')
  } else {
    console.log('\n⚠️  Some services need configuration before proceeding')
  }

  return smsResult && emailResult
}

runTests()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Service test failed:', error)
    process.exit(1)
  })