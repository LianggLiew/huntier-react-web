import { NextRequest, NextResponse } from 'next/server'
import { isBlacklisted, ContactType } from './blacklist'

export interface OtpRequestBody {
  contactValue: string
  contactType: ContactType
  [key: string]: any
}

/**
 * Middleware to check if a contact is blacklisted before OTP operations
 */
export async function checkBlacklistMiddleware(
  request: NextRequest,
  body: OtpRequestBody
): Promise<NextResponse | null> {
  try {
    const { contactValue, contactType } = body

    if (!contactValue || !contactType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          message: 'Contact value and type are required' 
        },
        { status: 400 }
      )
    }

    if (!['email', 'phone'].includes(contactType)) {
      return NextResponse.json(
        { 
          error: 'Invalid contact type',
          message: 'Contact type must be either email or phone' 
        },
        { status: 400 }
      )
    }

    // Check if contact is blacklisted
    const blacklistStatus = await isBlacklisted(contactValue, contactType)
    
    if (blacklistStatus.isBlacklisted) {
      return NextResponse.json(
        {
          error: 'Contact blacklisted',
          message: 'This contact is temporarily blocked due to too many attempts',
          reason: blacklistStatus.reason,
          expiresAt: blacklistStatus.expiresAt
        },
        { status: 429 }
      )
    }

    // Not blacklisted, continue with request
    return null
  } catch (error) {
    console.error('Error in blacklist middleware:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Unable to verify blacklist status' 
      },
      { status: 500 }
    )
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone format (basic international format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, '')
  // Should be between 10-15 digits
  return digits.length >= 10 && digits.length <= 15
}

/**
 * Validate contact based on type
 */
export function validateContact(contactValue: string, contactType: ContactType): boolean {
  if (contactType === 'email') {
    return isValidEmail(contactValue)
  } else if (contactType === 'phone') {
    return isValidPhone(contactValue)
  }
  return false
}

/**
 * Sanitize phone number to E.164 format
 */
export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Add + prefix if not present and ensure proper international format
  if (!digits.startsWith('1') && digits.length === 10) {
    // Assume US number if 10 digits
    return `+1${digits}`
  } else if (digits.length > 10 && !digits.startsWith('1')) {
    // International number
    return `+${digits}`
  } else if (digits.startsWith('1') && digits.length === 11) {
    // US number with country code
    return `+${digits}`
  }
  
  return `+${digits}`
}