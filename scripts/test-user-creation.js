const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testUserCreation() {
  console.log('🧪 Testing User Creation and OTP Flow...\\n')

  try {
    // Test 1: Check users table structure
    console.log('1. Checking users table structure...')
    const { data: sampleUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .single()

    if (sampleUser) {
      console.log('✅ Users table structure:')
      Object.keys(sampleUser).forEach(column => {
        console.log(`   - ${column}: ${typeof sampleUser[column]}`)
      })
    } else {
      console.log('⚠️  No users found or structure unclear:', userError?.message)
    }

    // Test 2: Test the API endpoint with the updated logic
    console.log('\\n2. Testing send-otp API with user creation...')
    
    const testEmail = 'user-creation-test@huntier.com'
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactValue: testEmail,
          contactType: 'email',
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        console.log('✅ API call successful:', data.message)
        console.log('✅ User creation/finding logic working')
      } else {
        console.log('❌ API call failed:', data.message)
        console.log('📋 Full error details:', JSON.stringify(data, null, 2))
      }
    } catch (fetchError) {
      console.log('⚠️  Cannot test API directly (server may not be running)')
      console.log('   Error:', fetchError.message)
    }

    // Test 3: Check if user was created
    console.log('\\n3. Checking if user was created...')
    const { data: createdUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single()

    if (createdUser) {
      console.log('✅ User created successfully:')
      console.log(`   ID: ${createdUser.id}`)
      console.log(`   Email: ${createdUser.email}`)
    } else {
      console.log('⚠️  User not found (may not have been created):', checkError?.message)
    }

    // Test 4: Check if OTP was created
    console.log('\\n4. Checking if OTP was created...')
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('contact_value', testEmail)
      .eq('type', 'email')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (otpRecord) {
      console.log('✅ OTP created successfully:')
      console.log(`   Code: ${otpRecord.code}`)
      console.log(`   User ID: ${otpRecord.user_id}`)
      console.log(`   Expires: ${otpRecord.expires_at}`)
    } else {
      console.log('⚠️  OTP not found:', otpError?.message)
    }

    // Clean up test data
    console.log('\\n5. Cleaning up test data...')
    if (createdUser) {
      await supabase.from('users').delete().eq('id', createdUser.id)
    }
    if (otpRecord) {
      await supabase.from('otp_codes').delete().eq('id', otpRecord.id)
    }
    console.log('✅ Test data cleaned up')

    console.log('\\n🎉 User Creation Test Complete!')
    console.log('\\n📋 Next Steps:')
    console.log('1. If API test failed, restart your dev server: npm run dev')
    console.log('2. Try the frontend at: http://localhost:3000/en/verify-otp')
    console.log('3. The system should now handle user creation automatically')

  } catch (error) {
    console.error('❌ User creation test failed:', error.message)
  }
}

testUserCreation()