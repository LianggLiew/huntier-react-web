import { NextRequest, NextResponse } from 'next/server'
import { invalidateSession, getSessionFromRequest, clearSessionCookies, validateSession } from '@/lib/auth'
import { ApiResponse } from '@/types/interface-contracts'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = getSessionFromRequest(request)

    if (!sessionToken) {
      const response: ApiResponse<{ message: string }> = {
        success: false,
        error: 'No active session to logout',
        data: { message: 'No active session found' }
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Validate session to get user ID
    const validationResult = await validateSession(sessionToken)
    
    if (!validationResult.valid || !validationResult.user) {
      // Even if session is invalid, we should clear cookies
      const response = NextResponse.json(
        { 
          success: true, 
          data: { message: 'Logged out successfully' }
        },
        { status: 200 }
      )
      clearSessionCookies(response)
      return response
    }

    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh-token')?.value

    // Invalidate session in database
    const invalidated = await invalidateSession(validationResult.user.id, refreshToken)

    if (!invalidated) {
      console.warn('Failed to invalidate session in database, but clearing cookies anyway')
    }

    // Create response and clear cookies
    const response = NextResponse.json(
      {
        success: true,
        data: { message: 'Logged out successfully' }
      },
      { status: 200 }
    )

    // Clear session cookies
    clearSessionCookies(response)

    return response

  } catch (error) {
    console.error('Error in logout API:', error)
    
    // Even on error, attempt to clear cookies
    const response = NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
        data: { message: 'An error occurred during logout' }
      },
      { status: 500 }
    )

    // Clear cookies anyway to ensure user is logged out on client side
    clearSessionCookies(response)
    
    return response
  }
}