import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from './supabase'
import { User, UserProfile, SessionValidationResponse, ApiResponse } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { createHash, randomBytes } from 'crypto'

// Session configuration
const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

// Simple JWT-like token structure without external dependencies
interface TokenPayload {
  userId: string
  email?: string | null
  phone?: string | null
  isVerified: boolean
  iat: number
  exp: number
}

/**
 * Create a simple signed token using HMAC
 */
function createToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHash('sha256').update(`${header}.${body}.${secret}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

/**
 * Verify and decode a simple signed token
 */
function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
    const [header, body, signature] = token.split('.')
    
    if (!header || !body || !signature) return null
    
    // Verify signature
    const expectedSignature = createHash('sha256').update(`${header}.${body}.${secret}`).digest('base64url')
    if (signature !== expectedSignature) return null
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    
    // Check expiration
    if (payload.exp < Date.now()) return null
    
    return payload
  } catch {
    return null
  }
}

/**
 * Create a new user session after successful OTP verification
 */
export async function createUserSession(contactValue: string, contactType: 'email' | 'phone'): Promise<{
  success: boolean
  user?: User
  profile?: UserProfile
  sessionToken?: string
  refreshToken?: string
  redirectTo?: '/onboarding' | '/jobs' | '/profile'
  error?: string
}> {
  try {
    // Check if user already exists
    let userData
    if (contactType === 'email') {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', contactValue)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      userData = data
    } else {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('phone', contactValue)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      userData = data
    }

    let user: User
    let isNewUser = false

    if (!userData) {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert([{
          email: contactType === 'email' ? contactValue : null,
          phone: contactType === 'phone' ? contactValue : null,
          is_verified: true,
          last_login: new Date().toISOString()
        }])
        .select()
        .single()

      if (createError) throw createError
      userData = newUser
      isNewUser = true
    } else {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          is_verified: true,
          last_login: new Date().toISOString()
        })
        .eq('id', userData.id)
        .select()
        .single()

      if (updateError) throw updateError
      userData = updatedUser
    }

    // Format user data according to interface contract
    user = {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      isVerified: userData.is_verified,
      isAuthenticated: true,
      needsOnboarding: isNewUser, // New users need onboarding
      createdAt: userData.created_at,
      lastLogin: userData.last_login
    }

    // Create session token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      iat: Date.now(),
      exp: Date.now() + SESSION_EXPIRY
    }

    const sessionToken = createToken(tokenPayload)

    // Create refresh token
    const refreshTokenValue = randomBytes(32).toString('hex')
    const refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_EXPIRY)

    await supabaseAdmin
      .from('refresh_tokens')
      .insert([{
        user_id: user.id,
        token: refreshTokenValue,
        expires_at: refreshTokenExpiry.toISOString()
      }])

    // Determine redirect destination
    let redirectTo: '/onboarding' | '/jobs' | '/profile' = '/jobs'
    if (isNewUser) {
      redirectTo = '/onboarding'
    }

    // Try to get user profile for existing users
    let profile: UserProfile | undefined
    if (!isNewUser) {
      try {
        const { data: profileData } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileData) {
          profile = {
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            dateOfBirth: profileData.date_of_birth,
            nationality: profileData.nationality,
            location: profileData.location,
            avatarUrl: profileData.avatar_url,
            title: profileData.title,
            bio: profileData.bio,
            onboardingCompleted: profileData.onboarding_completed || false,
            profileCompletionPercentage: profileData.profile_completion_percentage || 0,
            resumeFileUrl: profileData.resume_file_url,
            resumeFileName: profileData.resume_file_name,
            resumeParsedAt: profileData.resume_parsed_at,
            resumeFileSize: profileData.resume_file_size,
            resumeFileType: profileData.resume_file_type,
            wechatId: profileData.wechat_id,
            jobPreferences: profileData.job_preferences || {
              preferredLocations: [],
              preferredEmploymentTypes: [],
              preferredCompanySizes: [],
              preferredIndustries: [],
              remoteWorkPreference: 'no_preference'
            },
            notificationPreferences: profileData.notification_preferences || {
              email: true,
              sms: false,
              jobRecommendations: true,
              applicationUpdates: true,
              marketing: false
            },
            experience: profileData.experience || [],
            education: profileData.education || [],
            skills: profileData.skills || [],
            certifications: profileData.certifications || [],
            projects: profileData.projects || []
          }

          // If profile incomplete, redirect to profile completion
          if (!profile.onboardingCompleted) {
            redirectTo = '/onboarding'
          }
        }
      } catch (error) {
        // Profile doesn't exist yet, user needs onboarding
        redirectTo = '/onboarding'
      }
    }

    return {
      success: true,
      user,
      profile,
      sessionToken,
      refreshToken: refreshTokenValue,
      redirectTo
    }

  } catch (error) {
    console.error('Error creating user session:', error)
    return {
      success: false,
      error: 'Failed to create user session'
    }
  }
}

/**
 * Validate an existing session token
 */
export async function validateSession(sessionToken: string): Promise<SessionValidationResponse> {
  try {
    const payload = verifyToken(sessionToken)
    if (!payload) {
      return {
        valid: false,
        error: 'Invalid or expired session token'
      }
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single()

    if (userError || !userData) {
      return {
        valid: false,
        error: 'User not found'
      }
    }

    // Format user data
    const user: User = {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      isVerified: userData.is_verified,
      isAuthenticated: true,
      needsOnboarding: false, // Will be updated based on profile
      createdAt: userData.created_at,
      lastLogin: userData.last_login
    }

    // Try to get user profile
    let profile: UserProfile | undefined
    try {
      const { data: profileData } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        // Get user's primary resume
        const { data: resumeData } = await supabaseAdmin
          .from('user_resumes')
          .select('file_url, file_name, file_size, file_type, uploaded_at')
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .single()

        profile = {
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          dateOfBirth: profileData.date_of_birth,
          nationality: profileData.nationality,
          location: profileData.location,
          major: profileData.major,
          highestDegree: profileData.highest_degree,
          avatarUrl: profileData.avatar_url,
          title: profileData.title,
          bio: profileData.bio,
          onboardingCompleted: profileData.onboarding_completed || false,
          profileCompletionPercentage: profileData.profile_completion_percentage || 0,
          resumeFileUrl: resumeData?.file_url || null,
          resumeFileName: resumeData?.file_name || null,
          resumeParsedAt: resumeData?.uploaded_at || null,
          resumeFileSize: resumeData?.file_size || null,
          resumeFileType: resumeData?.file_type || null,
          wechatId: profileData.wechat_id,
          jobPreferences: profileData.job_preferences || {
            preferredLocations: [],
            preferredEmploymentTypes: [],
            preferredCompanySizes: [],
            preferredIndustries: [],
            remoteWorkPreference: 'no_preference'
          },
          notificationPreferences: profileData.notification_preferences || {
            email: true,
            sms: false,
            jobRecommendations: true,
            applicationUpdates: true,
            marketing: false
          },
          experience: profileData.experience || [],
          education: profileData.education || [],
          skills: profileData.skills || [],
          certifications: profileData.certifications || [],
          projects: profileData.projects || []
        }

        user.needsOnboarding = !profile.onboardingCompleted
      } else {
        user.needsOnboarding = true
      }
    } catch {
      user.needsOnboarding = true
    }

    return {
      valid: true,
      user,
      profile
    }

  } catch (error) {
    console.error('Error validating session:', error)
    return {
      valid: false,
      error: 'Session validation failed'
    }
  }
}

/**
 * Invalidate a user session (logout)
 */
export async function invalidateSession(userId: string, refreshToken?: string): Promise<boolean> {
  try {
    if (refreshToken) {
      // Remove specific refresh token
      await supabaseAdmin
        .from('refresh_tokens')
        .delete()
        .eq('user_id', userId)
        .eq('token', refreshToken)
    } else {
      // Remove all refresh tokens for user (logout from all devices)
      await supabaseAdmin
        .from('refresh_tokens')
        .delete()
        .eq('user_id', userId)
    }

    return true
  } catch (error) {
    console.error('Error invalidating session:', error)
    return false
  }
}

/**
 * Get session token from request cookies
 */
export function getSessionFromRequest(request: NextRequest): string | null {
  return request.cookies.get('session-token')?.value || null
}

/**
 * Set session cookies in response
 */
export function setSessionCookies(response: NextResponse, sessionToken: string, refreshToken: string): void {
  // Set session token (HTTP-only, secure in production)
  response.cookies.set('session-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY / 1000, // Convert to seconds
    path: '/'
  })

  // Set refresh token (HTTP-only, secure in production)
  response.cookies.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY / 1000, // Convert to seconds
    path: '/'
  })
}

/**
 * Clear session cookies
 */
export function clearSessionCookies(response: NextResponse): void {
  response.cookies.delete('session-token')
  response.cookies.delete('refresh-token')
}

/**
 * Check if user has required permissions (placeholder for future use)
 */
export function hasPermission(user: User, permission: string): boolean {
  // Placeholder for future role-based permissions
  return user.isVerified && user.isAuthenticated
}