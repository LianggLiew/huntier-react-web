import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { ApiResponse, SessionValidationResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = getSessionFromRequest(request)

    if (!sessionToken) {
      const response: ApiResponse<SessionValidationResponse> = {
        success: false,
        error: 'No session token provided',
        data: {
          valid: false,
          error: 'No session token provided'
        }
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Validate the session
    const validationResult = await validateSession(sessionToken)

    if (!validationResult.valid) {
      const response: ApiResponse<SessionValidationResponse> = {
        success: false,
        error: validationResult.error || 'Invalid session',
        data: validationResult
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Session is valid
    const response: ApiResponse<SessionValidationResponse> = {
      success: true,
      data: validationResult
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in validate-session API:', error)
    
    const response: ApiResponse<SessionValidationResponse> = {
      success: false,
      error: 'Internal server error',
      data: {
        valid: false,
        error: 'Session validation failed'
      }
    }

    return NextResponse.json(response, { status: 500 })
  }
}