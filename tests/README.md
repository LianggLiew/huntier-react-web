# 🧪 Testing Scripts

This folder contains development and testing scripts for the Huntier Job App.

## 📋 Available Test Scripts

### **Authentication Testing**
- [`test-auth.js`](./test-auth.js) - API endpoint testing for authentication
- [`test-supabase.js`](./test-supabase.js) - Database connection and operation testing
- [`debug-verify-otp.js`](./debug-verify-otp.js) - Debug OTP verification issues

### **Service Testing**
- [`test-sms.js`](./test-sms.js) - AWS SNS SMS functionality testing
- [`test-session.js`](./test-session.js) - Session management testing (browser console)

## 🚀 How to Run Tests

### **Node.js Scripts**
```bash
# Test database connection
node tests/test-supabase.js

# Test authentication APIs
node tests/test-auth.js

# Test SMS functionality
node tests/test-sms.js

# Debug OTP issues
node tests/debug-verify-otp.js
```

### **Browser Console Scripts**
```bash
# Copy contents of test-session.js to browser console
# Run functions like:
testTokenRefresh()
testLogout()
```

## ⚙️ Prerequisites

1. **Environment Setup**: Ensure `.env.local` is configured
2. **Development Server**: Run `npm run dev` for API testing
3. **Dependencies**: Run `npm install` to install required packages

## 📊 Test Categories

### **🔌 Connection Tests**
- Database connectivity (Supabase)
- API endpoint availability
- External service integration

### **🔐 Authentication Tests**
- OTP generation and verification
- JWT token management
- Session persistence and refresh

### **🌐 Service Integration Tests**
- Email delivery (Resend)
- SMS delivery (AWS SNS)
- Error handling and edge cases

## 🛠️ Adding New Tests

When adding new features, create corresponding test scripts:

```javascript
// tests/test-new-feature.js
import dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

async function testNewFeature() {
  console.log('🧪 Testing New Feature...')
  
  try {
    // Test implementation
    console.log('✅ Test passed')
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

testNewFeature()
```

## 📝 Test Results

- ✅ **Pass**: Feature works as expected
- ❌ **Fail**: Issue identified, needs fixing
- ⚠️ **Warning**: Works but has limitations
- 🔧 **Config**: Configuration issue, check environment

Remember to test both success and failure scenarios!