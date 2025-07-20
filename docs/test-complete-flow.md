# 🧪 Complete Authentication Flow Testing

## Test 1: First-Time User Registration
**Goal**: Test auto-registration for new users

### Steps:
1. Go to: `http://localhost:3001/en/verify-otp`
2. Switch to email verification
3. Enter NEW email: `newuser${Date.now()}@example.com`
4. Click "Send verification code"
5. Check email and enter OTP
6. Click "Login/Register"

### Expected Results:
- ✅ New user created automatically in database
- ✅ Email OTP received and verified
- ✅ JWT tokens generated and stored
- ✅ Redirect to home page
- ✅ User logged in successfully

## Test 2: Returning User Login
**Goal**: Test existing user authentication

### Steps:
1. Use same email from Test 1
2. Request new OTP
3. Verify with new code
4. Should login without creating duplicate user

### Expected Results:
- ✅ Same user ID used (no duplicate)
- ✅ Login successful
- ✅ last_login timestamp updated

## Test 3: Session Persistence
**Goal**: Test if login persists across browser refreshes

### Steps:
1. After successful login, refresh the page
2. Navigate to different pages
3. Close and reopen browser tab

### Expected Results:
- ✅ User stays logged in after refresh
- ✅ No need to login again
- ✅ Session persists until expiration

## Test 4: Token Refresh
**Goal**: Test automatic token refresh before expiration

### Steps:
1. Login successfully
2. Wait 10+ minutes (access token expires in 15 min)
3. Make authenticated request
4. Check if token auto-refreshes

### Expected Results:
- ✅ New access token generated automatically
- ✅ User doesn't notice any interruption
- ✅ Session continues smoothly

## Test 5: Logout Functionality
**Goal**: Test complete session cleanup

### Steps:
1. Login successfully
2. Trigger logout (we'll implement logout button)
3. Try to access protected content
4. Verify tokens are cleared

### Expected Results:
- ✅ All tokens cleared from browser
- ✅ Refresh token revoked in database
- ✅ Redirected to login when accessing protected content