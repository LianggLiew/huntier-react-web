/**
 * Debug script for OTP verification issues
 * Run with: node debug-verify-otp.js
 */

import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function debugVerifyOTP() {
  console.log('🔍 Debugging OTP Verification...\n')
  
  // Test with sample data (replace with real values for testing)
  const testData = {
    userId: '550e8400-e29b-41d4-a716-446655440000', // Replace with real user ID
    code: '123456',
    type: 'email'
  }
  
  try {
    console.log('📤 Sending verify-otp request...')
    console.log('Request data:', testData)
    
    const response = await fetch('http://localhost:3001/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('\n📊 Response Status:', response.status)
    
    const responseData = await response.json()
    console.log('📝 Response Data:', responseData)
    
    if (response.ok) {
      console.log('\n✅ Verification successful!')
      console.log('User:', responseData.user)
      console.log('Access token present:', !!responseData.accessToken)
    } else {
      console.log('\n❌ Verification failed!')
      console.log('Error:', responseData.error)
    }
    
  } catch (error) {
    console.error('\n💥 Request failed:', error.message)
  }
}

// Instructions
console.log(`
🔧 Debug Instructions:

1. Complete a successful "send-otp" request first
2. Note the userId returned from send-otp
3. Update the testData.userId in this script
4. Update the testData.code with real OTP from email
5. Run: node debug-verify-otp.js

This will help identify where the verification is failing.
`)

// Uncomment to run the debug
// debugVerifyOTP()