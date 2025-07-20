/**
 * Session Management Testing Script
 * Run in browser console to test token refresh
 */

async function testTokenRefresh() {
  console.log('🧪 Testing Token Refresh...\n')
  
  // Check if user is logged in
  const accessToken = localStorage.getItem('access-token')
  if (!accessToken) {
    console.log('❌ No access token found. Please login first.')
    return
  }
  
  console.log('✅ Access token found')
  
  try {
    // Test refresh endpoint
    console.log('🔄 Testing token refresh...')
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Token refresh successful!')
      console.log('New access token saved to localStorage')
      console.log('User info:', data.user)
    } else {
      console.log('❌ Token refresh failed:', response.status)
    }
    
  } catch (error) {
    console.log('❌ Error testing refresh:', error.message)
  }
}

async function testLogout() {
  console.log('🚪 Testing Logout...\n')
  
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.ok) {
      console.log('✅ Logout API successful')
      localStorage.removeItem('access-token')
      console.log('✅ Local storage cleared')
      console.log('🔄 Redirecting to login...')
      window.location.href = '/en/verify-otp'
    } else {
      console.log('❌ Logout failed:', response.status)
    }
  } catch (error) {
    console.log('❌ Error testing logout:', error.message)
  }
}

// Display available test functions
console.log(`
🧪 Session Testing Functions Available:

testTokenRefresh() - Test automatic token refresh
testLogout() - Test logout functionality

Example usage:
> testTokenRefresh()
> testLogout()
`);