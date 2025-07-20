import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/supabase'
import { jwtUtils } from '@/lib/jwt'
import { z } from 'zod'

// Validation schema
const verifyOTPSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  code: z.string().length(6, 'OTP code must be 6 digits'),
  type: z.enum(['email', 'phone']),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { userId, code, type } = verifyOTPSchema.parse(body)

    // Verify OTP
    const isValidOTP = await dbHelpers.verifyOTP(userId, code, type)
    
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Get updated user information by ID
    const user = await dbHelpers.findUserById(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate JWT tokens
    const accessToken = jwtUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      isVerified: user.is_verified,
    })

    const { token: refreshToken, tokenId } = jwtUtils.generateRefreshToken(user.id)

    // Store refresh token in database
    const deviceInfo = request.headers.get('user-agent') || 'Unknown'
    await dbHelpers.storeRefreshToken(user.id, refreshToken, deviceInfo)

    // Create response with secure cookies
    const response = NextResponse.json({
      success: true,
      message: 'Verification successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        lastLogin: user.last_login,
      },
      accessToken, // For frontend use
    })

    // Set secure HTTP-only cookies for refresh token
    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Set access token cookie (optional - for server-side rendering)
    response.cookies.set('access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Verify OTP error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

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