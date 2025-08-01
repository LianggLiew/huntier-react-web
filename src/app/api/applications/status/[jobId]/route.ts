import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/api'
import { JobApplication, ApplicationStatus } from '@/types/job-application'
import { formatJobApplication, APPLICATION_SELECT_FIELDS } from '@/utils/applicationFormatters'

/**
 * GET /api/applications/status/[jobId] - Check if user applied to specific job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params
    const jobId = parseInt(resolvedParams.jobId)

    if (isNaN(jobId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid job ID'
      }
      return NextResponse.json(response, { status: 400 })
    }

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

    // Check if user has applied to this job
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('job_applications')
      .select(APPLICATION_SELECT_FIELDS)
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single()

    if (applicationError && applicationError.code !== 'PGRST116') {
      console.error('Error checking application status:', applicationError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to check application status'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // If no application found
    if (!applicationData) {
      const response: ApiResponse = {
        success: true,
        data: {
          hasApplied: false,
          application: null
        }
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Format application data using utility function
    const application = formatJobApplication(applicationData)

    const response: ApiResponse = {
      success: true,
      data: {
        hasApplied: true,
        application
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in application status API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}