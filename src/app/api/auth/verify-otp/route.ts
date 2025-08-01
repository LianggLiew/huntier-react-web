import { NextRequest, NextResponse } from 'next/server'
import { validateContact, sanitizePhoneNumber } from '@/lib/otp-middleware'
import { verifyOtp } from '@/lib/otp-final'
import { ContactType } from '@/lib/blacklist'
import { checkVerifyRateLimit } from '@/lib/rate-limiter'
import { createUserSession, setSessionCookies } from '@/lib/auth'
import { ApiResponse, OTPVerificationResponse } from '@/types/interface-contracts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactValue, contactType, otpCode } = body

    // Validate required fields
    if (!contactValue || !contactType || !otpCode) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          message: 'Contact value, type, and OTP code are required' 
        },
        { status: 400 }
      )
    }

    // Validate contact type
    if (!['email', 'phone'].includes(contactType)) {
      return NextResponse.json(
        { 
          error: 'Invalid contact type',
          message: 'Contact type must be either email or phone' 
        },
        { status: 400 }
      )
    }

    // Validate OTP code format (6 digits)
    if (!/^\d{6}$/.test(otpCode)) {
      return NextResponse.json(
        { 
          error: 'Invalid OTP format',
          message: 'OTP code must be 6 digits' 
        },
        { status: 400 }
      )
    }

    // Validate contact format
    if (!validateContact(contactValue, contactType as ContactType)) {
      return NextResponse.json(
        { 
          error: 'Invalid contact format',
          message: contactType === 'email' 
            ? 'Please enter a valid email address' 
            : 'Please enter a valid phone number' 
        },
        { status: 400 }
      )
    }

    // Sanitize phone number if needed
    let sanitizedContact = contactValue
    if (contactType === 'phone') {
      sanitizedContact = sanitizePhoneNumber(contactValue)
    }

    // Check rate limits before verification
    const rateLimit = await checkVerifyRateLimit(sanitizedContact, contactType as ContactType)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: rateLimit.reason,
          retryAfter: rateLimit.retryAfter,
          remaining: rateLimit.remaining
        },
        { status: 429 }
      )
    }

    // Verify OTP (includes blacklist checking)
    const verificationResult = await verifyOtp(
      sanitizedContact,
      contactType as ContactType,
      otpCode
    )

    if (!verificationResult.success) {
      // Check if user should be blacklisted due to too many failed attempts
      if (verificationResult.shouldBlacklist) {
        return NextResponse.json(
          {
            error: 'Too many failed attempts',
            message: 'You have exceeded the maximum number of verification attempts. Please try again later.',
            blacklisted: true
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Verification failed',
          message: verificationResult.error || 'Invalid or expired OTP code'
        },
        { status: 400 }
      )
    }

    // OTP verified successfully - create user session
    const sessionResult = await createUserSession(sanitizedContact, contactType as ContactType)

    if (!sessionResult.success) {
      return NextResponse.json(
        { 
          error: 'Session creation failed',
          message: sessionResult.error || 'Unable to create user session'
        },
        { status: 500 }
      )
    }

    // Prepare response data according to interface contract
    const responseData: OTPVerificationResponse = {
      success: true,
      sessionToken: sessionResult.sessionToken!,
      user: sessionResult.user!,
      redirectTo: sessionResult.redirectTo!,
      blacklisted: false
    }

    const apiResponse: ApiResponse<OTPVerificationResponse> = {
      success: true,
      data: responseData
    }

    // Create response with session cookies
    const response = NextResponse.json(apiResponse, { status: 200 })
    
    // Set session cookies
    setSessionCookies(response, sessionResult.sessionToken!, sessionResult.refreshToken!)

    return response

  } catch (error) {
    console.error('Error in verify-otp API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred' 
      },
      { status: 500 }
    )
  }
}