import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/supabase'
import { jwtUtils } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh-token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const decoded = jwtUtils.verifyRefreshToken(refreshToken)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Validate refresh token in database
    const user = await dbHelpers.validateRefreshToken(refreshToken)
    if (!user) {
      return NextResponse.json(
        { error: 'Refresh token not found or expired' },
        { status: 401 }
      )
    }

    // Generate new access token
    const accessToken = jwtUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      isVerified: user.is_verified,
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        lastLogin: user.last_login,
      },
    })

    // Update access token cookie
    response.cookies.set('access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}