import { NextRequest, NextResponse } from 'next/server'
import { validateContact, sanitizePhoneNumber } from '@/lib/otp-middleware'
import { createOtp } from '@/lib/otp-final'
import { sendSms, formatOtpSmsMessage } from '@/lib/sms'
import { sendOtpEmail } from '@/lib/email'
import { ContactType } from '@/lib/blacklist'
import { checkSendRateLimit } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactValue, contactType } = body

    // Validate required fields
    if (!contactValue || !contactType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          message: 'Contact value and type are required' 
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

    // Check rate limits before processing
    const rateLimit = await checkSendRateLimit(sanitizedContact, contactType as ContactType)
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

    // Create OTP (includes blacklist checking)
    const otpResult = await createOtp(sanitizedContact, contactType as ContactType)

    if (!otpResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to create OTP',
          message: otpResult.error || 'Unable to generate verification code' 
        },
        { status: 500 }
      )
    }

    // Send OTP via appropriate channel
    let sendResult
    if (contactType === 'email') {
      sendResult = await sendOtpEmail(sanitizedContact, otpResult.otpCode!, 10)
    } else {
      const message = formatOtpSmsMessage(otpResult.otpCode!, 10)
      sendResult = await sendSms(sanitizedContact, message)
    }

    if (!sendResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to send OTP',
          message: `Unable to send verification code via ${contactType}`,
          details: sendResult.error 
        },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: `Verification code sent to your ${contactType}`,
        expiresAt: otpResult.expiresAt,
        contactValue: sanitizedContact,
        contactType
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in send-otp API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred' 
      },
      { status: 500 }
    )
  }
}