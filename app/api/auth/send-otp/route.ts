/**
 * API Route: Send OTP Verification Code
 * 
 * POST /api/auth/send-otp
 * 
 * This endpoint handles sending OTP (One-Time Password) verification codes
 * via email or SMS for passwordless authentication. It automatically creates
 * new user accounts if they don't exist (auto-registration).
 * 
 * Features:
 * - Email OTP via Resend service
 * - SMS OTP via AWS SNS
 * - Auto user creation for new contacts
 * - Rate limiting (5 attempts per hour per contact)
 * - Input validation for email/phone formats
 * - Secure OTP generation and storage
 * 
 * Request Body:
 * {
 *   \"type\": \"email\" | \"phone\",
 *   \"contact\": \"user@example.com\" | \"+1234567890\"
 * }
 * 
 * Response:
 * {
 *   \"success\": true,
 *   \"message\": \"Verification code sent to your email/phone\",
 *   \"userId\": \"uuid-string\"
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import { Resend } from 'resend'
import { dbHelpers } from '@/lib/supabase'
import { jwtUtils } from '@/lib/jwt'
import { z } from 'zod'

// Initialize AWS SNS client for SMS sending
const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',    // Default to Malaysia/Singapore region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Initialize Resend client for email sending
const resend = new Resend(process.env.RESEND_API_KEY!)

// Input validation schema using Zod
const sendOTPSchema = z.object({
  type: z.enum(['email', 'phone']),                      // Must be either 'email' or 'phone'
  contact: z.string().min(1, 'Contact is required'),     // Contact info is required
})

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>()

// Rate limiting helper
function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { attempts: 1, resetTime: now + windowMs })
    return true
  }

  if (record.attempts >= maxAttempts) {
    return false
  }

  record.attempts++
  return true
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone format (international format)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

// Send email OTP
async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'Huntier <onboarding@resend.dev>',
      to: email,
      subject: 'Your Huntier Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Huntier Job Portal</h2>
          <p>Your verification code is:</p>
          <div style="background: #f0fdf4; border: 2px solid #059669; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #059669; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('Error sending email OTP:', error)
    return false
  }
}

// Send SMS OTP
async function sendSMSOTP(phone: string, otp: string): Promise<boolean> {
  try {
    const message = `Your Huntier verification code is: ${otp}. This code will expire in 5 minutes.`
    
    const command = new PublishCommand({
      PhoneNumber: phone,
      Message: message,
    })

    await snsClient.send(command)
    return true
  } catch (error) {
    console.error('Error sending SMS OTP:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { type, contact } = sendOTPSchema.parse(body)

    // Validate contact format
    if (type === 'email' && !isValidEmail(contact)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (type === 'phone' && !isValidPhone(contact)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      )
    }

    // Rate limiting
    const rateLimitKey = `otp_${type}_${contact}`
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = jwtUtils.generateOTP()

    // Find or create user
    let user = await dbHelpers.findUser(
      type === 'email' ? contact : undefined,
      type === 'phone' ? contact : undefined
    )

    if (!user) {
      // Auto-create user for passwordless registration
      user = await dbHelpers.createUser(
        type === 'email' ? contact : undefined,
        type === 'phone' ? contact : undefined
      )

      if (!user) {
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }
    }

    // Store OTP in database
    const otpCreated = await dbHelpers.createOTP(user.id, otp, type)
    if (!otpCreated) {
      return NextResponse.json(
        { error: 'Failed to generate verification code' },
        { status: 500 }
      )
    }

    // Send OTP
    let sent = false
    if (type === 'email') {
      sent = await sendEmailOTP(contact, otp)
    } else {
      sent = await sendSMSOTP(contact, otp)
    }

    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Verification code sent to your ${type}`,
      userId: user.id, // Frontend needs this for verification
    })

  } catch (error) {
    console.error('Send OTP error:', error)

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