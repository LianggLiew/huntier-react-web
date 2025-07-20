/**
 * Test SMS functionality with AWS SNS
 * Run with: node test-sms.js
 */

import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('📱 Testing SMS/AWS SNS Configuration...\n')

// Check environment variables
console.log('📋 Environment Check:')
console.log('AWS Access Key:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing')
console.log('AWS Secret Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing')
console.log('AWS Region:', process.env.AWS_REGION || 'Using default: ap-southeast-1')

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function testSMS() {
  try {
    console.log('\n📲 Testing SMS Send...')
    
    // Test with a sample phone number (replace with your own for real test)
    const testPhoneNumber = '+1234567890'  // Replace with your phone number
    const testMessage = 'Test message from Huntier Job App. Code: 123456'
    
    console.log(`Sending test SMS to: ${testPhoneNumber}`)
    console.log(`Message: ${testMessage}`)
    
    const command = new PublishCommand({
      PhoneNumber: testPhoneNumber,
      Message: testMessage,
    })

    const result = await snsClient.send(command)
    
    console.log('✅ SMS sent successfully!')
    console.log('Message ID:', result.MessageId)
    console.log('Note: Check your phone for the test message')
    
    return true
    
  } catch (error) {
    console.error('❌ SMS test failed:', error.message)
    
    if (error.name === 'CredentialsError') {
      console.log('\n🔧 Fix: Check your AWS credentials in .env.local')
    } else if (error.name === 'InvalidParameterException') {
      console.log('\n🔧 Fix: Check phone number format (must include country code)')
    } else if (error.message.includes('not authorized')) {
      console.log('\n🔧 Fix: Your AWS account may need SMS permissions enabled')
      console.log('   - Go to AWS SNS Console')
      console.log('   - Check SMS preferences and spending limits')
    }
    
    return false
  }
}

// Run the test
testSMS().then(success => {
  if (success) {
    console.log('\n🎉 SMS test passed! AWS SNS is working.')
  } else {
    console.log('\n⚠️  SMS test failed. Check AWS configuration.')
    console.log('\n💡 For testing, you can skip SMS and use email-only for now.')
  }
})