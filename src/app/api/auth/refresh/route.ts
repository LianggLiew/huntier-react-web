import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createToken, TokenPayload, setSessionCookies, clearSessionCookies } from '@/lib/auth'
import { ApiResponse } from '@/types'
import { randomBytes } from 'crypto'

// Session configuration
const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh-token')?.value

    if (!refreshToken) {
      const response: ApiResponse<{ message: string }> = {
        success: false,
        error: 'No refresh token provided',
        data: { message: 'Refresh token is required' }
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Validate refresh token in database
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('refresh_tokens')
      .select('user_id, expires_at')
      .eq('token', refreshToken)
      .single()

    if (tokenError || !tokenData) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Invalid refresh token',
          data: { message: 'Refresh token not found' }
        },
        { status: 401 }
      )
      clearSessionCookies(response)
      return response
    }

    // Check if refresh token is expired
    const tokenExpiry = new Date(tokenData.expires_at)
    if (tokenExpiry < new Date()) {
      // Clean up expired token
      await supabaseAdmin
        .from('refresh_tokens')
        .delete()
        .eq('token', refreshToken)

      const response = NextResponse.json(
        {
          success: false,
          error: 'Refresh token expired',
          data: { message: 'Please log in again' }
        },
        { status: 401 }
      )
      clearSessionCookies(response)
      return response
    }

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', tokenData.user_id)
      .single()

    if (userError || !userData) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'User not found',
          data: { message: 'Invalid user' }
        },
        { status: 401 }
      )
      clearSessionCookies(response)
      return response
    }

    // Create new session token
    const tokenPayload: TokenPayload = {
      userId: userData.id,
      email: userData.email,
      phone: userData.phone,
      isVerified: userData.is_verified,
      iat: Date.now(),
      exp: Date.now() + SESSION_EXPIRY
    }

    const newSessionToken = createToken(tokenPayload)

    // Create new refresh token (token rotation for security)
    const newRefreshTokenValue = randomBytes(32).toString('hex')
    const newRefreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_EXPIRY)

    // Update refresh token in database (replace old one)
    const { error: updateError } = await supabaseAdmin
      .from('refresh_tokens')
      .update({
        token: newRefreshTokenValue,
        expires_at: newRefreshTokenExpiry.toISOString()
      })
      .eq('token', refreshToken)

    if (updateError) {
      console.error('Failed to update refresh token:', updateError)
      const response = NextResponse.json(
        {
          success: false,
          error: 'Failed to refresh tokens',
          data: { message: 'Token refresh failed' }
        },
        { status: 500 }
      )
      return response
    }

    // Update user's last login timestamp
    await supabaseAdmin
      .from('users')
      .update({
        last_login: new Date().toISOString()
      })
      .eq('id', userData.id)

    // Create successful response
    const response = NextResponse.json(
      {
        success: true,
        data: {
          message: 'Tokens refreshed successfully',
          user: {
            id: userData.id,
            email: userData.email,
            phone: userData.phone,
            isVerified: userData.is_verified,
            isAuthenticated: true,
            needsOnboarding: false, // Will be determined by client
            createdAt: userData.created_at,
            lastLogin: userData.last_login
          }
        }
      },
      { status: 200 }
    )

    // Set new session cookies
    setSessionCookies(response, newSessionToken, newRefreshTokenValue)

    return response

  } catch (error) {
    console.error('Error in refresh token API:', error)
    
    const response = NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        data: { message: 'Token refresh failed' }
      },
      { status: 500 }
    )

    // Clear potentially invalid cookies
    clearSessionCookies(response)
    
    return response
  }
}