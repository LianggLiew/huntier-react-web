import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/interface-contracts'

/**
 * GET /api/user/profile/completion - Get profile completion status
 */
export async function GET(request: NextRequest) {
  try {
    // Validate session
    const sessionToken = getSessionFromRequest(request)
    if (!sessionToken) {
      const response: ApiResponse = {
        success: false,
        error: 'No session token provided'
      }
      return NextResponse.json(response, { status: 401 })
    }

    const validationResult = await validateSession(sessionToken)
    if (!validationResult.valid || !validationResult.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid session'
      }
      return NextResponse.json(response, { status: 401 })
    }

    const userId = validationResult.user.id

    // Get user profile from database
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Database error fetching profile:', profileError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch profile'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // If no profile exists, return 0% completion
    if (!profileData) {
      const response: ApiResponse<{ percentage: number; missingFields: string[] }> = {
        success: true,
        data: {
          percentage: 0,
          missingFields: [
            'firstName',
            'lastName',
            'dateOfBirth',
            'nationality',
            'location',
            'title',
            'bio',
            'resume',
            'jobPreferences'
          ]
        }
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Calculate completion status
    const fields = [
      { key: 'first_name', name: 'firstName' },
      { key: 'last_name', name: 'lastName' },
      { key: 'date_of_birth', name: 'dateOfBirth' },
      { key: 'nationality', name: 'nationality' },
      { key: 'location', name: 'location' },
      { key: 'title', name: 'title' },
      { key: 'bio', name: 'bio' }
    ]

    let filledFields = 0
    const missingFields: string[] = []

    // Check basic profile fields
    for (const field of fields) {
      if (profileData[field.key]) {
        filledFields++
      } else {
        missingFields.push(field.name)
      }
    }

    // Check resume
    if (profileData.resume_file_url) {
      filledFields++
    } else {
      missingFields.push('resume')
    }

    // Check job preferences
    const jobPrefs = profileData.job_preferences
    if (jobPrefs && (
      (jobPrefs.preferredLocations && jobPrefs.preferredLocations.length > 0) ||
      (jobPrefs.preferredEmploymentTypes && jobPrefs.preferredEmploymentTypes.length > 0) ||
      (jobPrefs.preferredIndustries && jobPrefs.preferredIndustries.length > 0)
    )) {
      filledFields++
    } else {
      missingFields.push('jobPreferences')
    }

    const totalFields = fields.length + 2 // +2 for resume and job preferences
    const percentage = Math.round((filledFields / totalFields) * 100)

    const response: ApiResponse<{ percentage: number; missingFields: string[] }> = {
      success: true,
      data: {
        percentage,
        missingFields
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in profile completion API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}