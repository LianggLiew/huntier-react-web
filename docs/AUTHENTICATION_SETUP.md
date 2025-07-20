# 🔐 Authentication System Setup Guide

## Phase 1 Complete ✅

Your passwordless authentication system is now ready! Here's what has been implemented:

### 📦 What's Been Created

```
├── API Routes
│   ├── /api/auth/send-otp      - Send OTP via email/SMS
│   ├── /api/auth/verify-otp    - Verify OTP & create session
│   ├── /api/auth/refresh       - Refresh access tokens
│   └── /api/auth/logout        - Logout & clear tokens
│
├── Database Schema
│   ├── users table            - User profiles
│   ├── otp_codes table         - OTP verification codes
│   └── refresh_tokens table    - Session management
│
├── Authentication System
│   ├── JWT token generation    - Access & refresh tokens
│   ├── Rate limiting           - Prevent abuse
│   ├── Auto user creation      - Passwordless registration
│   └── Security measures       - Secure cookies, expiration
│
└── Frontend Integration
    ├── Updated verify-otp page - Real API integration
    ├── Auth context           - State management
    └── Protected routes        - Access control
```

### 🚀 Next Steps to Get Running

#### 1. Set Up Supabase Database
1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql` 
4. Run the SQL to create tables and policies

#### 2. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your credentials:

```bash
# Supabase (get from Supabase Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secrets (generate random 32+ character strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters

# AWS SNS (from your AWS IAM user)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-southeast-1

# Resend (get from https://resend.com)
RESEND_API_KEY=your-resend-api-key
```

#### 3. AWS SNS Setup (for SMS)
1. Go to AWS SNS console
2. Enable SMS in your region (ap-southeast-1 for Malaysia)
3. Set up spending limits
4. Test with a phone number

#### 4. Resend Setup (for Email)
1. Sign up at https://resend.com
2. Add your domain or use their test domain
3. Get API key from dashboard

#### 5. Test the System
```bash
npm run dev
```

Visit `http://localhost:3000/en/verify-otp` and test:
- Email verification
- Phone verification (with real AWS SNS)
- Error handling

### 🔧 How It Works

1. **User enters email/phone** → Frontend validates format
2. **Send OTP clicked** → API creates user (if new) & sends OTP
3. **User enters OTP** → API verifies & creates JWT session
4. **Auto-login** → Secure cookies + localStorage token
5. **Auto-refresh** → Tokens refresh before expiration

### 🛡️ Security Features

- ✅ Rate limiting (5 attempts/hour per contact)
- ✅ OTP expiration (5 minutes)
- ✅ Attempt limits (3 tries per OTP)
- ✅ Secure HTTP-only cookies
- ✅ JWT with short expiry (15 min)
- ✅ Refresh token rotation
- ✅ Input validation & sanitization

### 📱 Frontend Usage

To protect pages, wrap components:
```typescript
import { withAuth } from '@/lib/auth-context'

export default withAuth(function ProfilePage() {
  return <div>Protected content</div>
})
```

To use auth state:
```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, logout } = useAuth()
  
  if (user) {
    return <div>Welcome {user.email}!</div>
  }
  return <div>Please log in</div>
}
```

### 🐛 Troubleshooting

**"Invalid refresh token"**
- Check Supabase RLS policies are created
- Verify environment variables are set

**SMS not sending**
- Check AWS SNS is enabled in your region
- Verify AWS credentials have SNS permissions
- Check spending limits aren't exceeded

**Email not sending**
- Verify Resend API key is correct
- Check domain configuration in Resend

### 🎯 What's Next (Phase 2)

Ready to implement:
- [ ] WeChat OAuth integration
- [ ] Enhanced middleware for route protection
- [ ] User profile management
- [ ] Session management dashboard
- [ ] Advanced security features

Let me know when you're ready for Phase 2! 🚀