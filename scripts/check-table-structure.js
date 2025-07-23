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

async function checkTableStructure() {
  console.log('🔍 Checking actual otp_codes table structure...\n')

  try {
    // Try to get a sample record to see the structure
    console.log('1. Checking existing data structure...')
    const { data: sampleData, error: sampleError } = await supabase
      .from('otp_codes')
      .select('*')
      .limit(1)

    if (sampleError) {
      console.error('❌ Error accessing otp_codes table:', sampleError.message)
      return
    }

    if (sampleData && sampleData.length > 0) {
      console.log('✅ Found existing data. Current structure:')
      console.log('📋 Columns in otp_codes table:')
      Object.keys(sampleData[0]).forEach(column => {
        console.log(`   - ${column}: ${typeof sampleData[0][column]} (${sampleData[0][column]})`)
      })
    } else {
      console.log('⚠️  No existing data found. Attempting to insert test record to discover structure...')
      
      // Try minimal insert to see what columns are required
      const testInserts = [
        // Test 1: Minimal structure
        { contact_value: 'test@example.com', contact_type: 'email' },
        // Test 2: With otp_code
        { contact_value: 'test@example.com', contact_type: 'email', otp_code: '123456' },
        // Test 3: With code instead of otp_code
        { contact_value: 'test@example.com', contact_type: 'email', code: '123456' },
        // Test 4: With other common fields
        { contact_value: 'test@example.com', contact_type: 'email', otp: '123456', attempts: 0 }
      ]

      for (let i = 0; i < testInserts.length; i++) {
        console.log(`\\n   Test ${i + 1}: Trying structure:`, Object.keys(testInserts[i]).join(', '))
        
        const { data, error } = await supabase
          .from('otp_codes')
          .insert(testInserts[i])
          .select()

        if (!error && data) {
          console.log('✅ Success! Table accepts this structure:')
          console.log('📋 Columns in otp_codes table:')
          Object.keys(data[0]).forEach(column => {
            console.log(`   - ${column}: ${typeof data[0][column]}`)
          })
          
          // Clean up test record
          await supabase
            .from('otp_codes')
            .delete()
            .eq('contact_value', 'test@example.com')
            
          break
        } else {
          console.log(`❌ Failed: ${error?.message || 'Unknown error'}`)
        }
      }
    }

    // Also check otp_blacklist structure for comparison
    console.log('\\n2. Checking otp_blacklist table structure for reference...')
    const { data: blacklistData, error: blacklistError } = await supabase
      .from('otp_blacklist')
      .select('*')
      .limit(1)

    if (!blacklistError && blacklistData && blacklistData.length > 0) {
      console.log('📋 otp_blacklist table columns:')
      Object.keys(blacklistData[0]).forEach(column => {
        console.log(`   - ${column}: ${typeof blacklistData[0][column]}`)
      })
    }

    console.log('\\n📝 Next steps:')
    console.log('1. Please share the actual column names from your otp_codes table')
    console.log('2. I will update the code to match your existing structure')
    console.log('3. Then we can test the updated OTP functionality')

  } catch (error) {
    console.error('❌ Failed to check table structure:', error.message)
  }
}

checkTableStructure()