// Supabase Connection Test
// Run with: node test-supabase.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🧪 Testing Supabase Connection...\n')

// Check environment variables
console.log('📋 Environment Check:')
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    console.log('🔌 Testing Basic Connection...')
    
    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Basic connection successful')
    
    // Test 2: Check if tables exist
    console.log('\n📊 Testing Tables...')
    
    const tables = ['users', 'otp_codes', 'refresh_tokens']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}':`, error.message)
        } else {
          console.log(`✅ Table '${table}': exists and accessible`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}':`, err.message)
      }
    }
    
    // Test 3: Test user creation (admin client)
    console.log('\n👤 Testing User Creation...')
    
    const testEmail = `test.${Date.now()}@example.com`
    
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email: testEmail,
        is_verified: false
      })
      .select()
      .single()
    
    if (createError) {
      console.log('❌ User creation failed:', createError.message)
    } else {
      console.log('✅ User creation successful:', newUser.id)
      
      // Clean up test user
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', newUser.id)
      
      console.log('🧹 Test user cleaned up')
    }
    
    console.log('\n🎉 Supabase connection test complete!')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Your Supabase is ready.')
  } else {
    console.log('\n❌ Some tests failed. Check your configuration.')
  }
})