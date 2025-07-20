// Quick API test script
// Run with: node test-auth.js

const testAuth = async () => {
  const baseUrl = 'http://localhost:3001'
  
  console.log('🧪 Testing Authentication APIs...\n')
  
  try {
    // Test 1: Send OTP (this will fail without real services, but should show proper error)
    console.log('📧 Testing Send OTP API...')
    const sendResponse = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'email',
        contact: 'test@example.com'
      })
    })
    
    const sendData = await sendResponse.json()
    console.log('Status:', sendResponse.status)
    console.log('Response:', sendData)
    console.log('')
    
    // Test 2: Invalid request format
    console.log('❌ Testing invalid request...')
    const invalidResponse = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'invalid',
        contact: ''
      })
    })
    
    const invalidData = await invalidResponse.json()
    console.log('Status:', invalidResponse.status)
    console.log('Response:', invalidData)
    console.log('')
    
    // Test 3: Check refresh endpoint
    console.log('🔄 Testing refresh endpoint...')
    const refreshResponse = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST'
    })
    
    const refreshData = await refreshResponse.json()
    console.log('Status:', refreshResponse.status)
    console.log('Response:', refreshData)
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

// Run if server is running
testAuth()