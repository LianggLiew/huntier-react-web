import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/api'
import { 
  JobApplication, 
  ApplicationStatus 
} from '@/types/job-application'
import { formatJobApplication, APPLICATION_SELECT_FIELDS_ALT } from '@/utils/applicationFormatters'
import { z } from 'zod'

// Validation schema for application updates
const ApplicationUpdateSchema = z.object({
  coverLetter: z.string().min(1).optional()
})

/**
 * GET /api/applications/[id] - Get specific application
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params
    const applicationId = resolvedParams.id

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

    // Get application
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('job_applications')
      .select(APPLICATION_SELECT_FIELDS_ALT)
      .eq('id', applicationId)
      .eq('user_id', userId) // Ensure user can only access their own applications
      .single()

    if (applicationError || !applicationData) {
      const response: ApiResponse = {
        success: false,
        error: 'Application not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Format response using utility function
    const application = formatJobApplication(applicationData)

    const response: ApiResponse<JobApplication> = {
      success: true,
      data: application
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in application GET API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * PUT /api/applications/[id] - Update application (limited fields)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params
    const applicationId = resolvedParams.id

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

    // Parse and validate request body
    const body = await request.json()
    const validationResult2 = ApplicationUpdateSchema.safeParse(body)

    if (!validationResult2.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid update data',
        details: validationResult2.error.flatten()
      }
      return NextResponse.json(response, { status: 400 })
    }

    const updates = validationResult2.data

    // Check if application exists and belongs to user
    const { data: existingApplication, error: checkError } = await supabaseAdmin
      .from('job_applications')
      .select('id, status')
      .eq('id', applicationId)
      .eq('user_id', userId)
      .single()

    if (checkError || !existingApplication) {
      const response: ApiResponse = {
        success: false,
        error: 'Application not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Only allow updates if application is still pending
    if (existingApplication.status !== 'pending') {
      const response: ApiResponse = {
        success: false,
        error: 'Cannot update application that is no longer pending'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Update application
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('job_applications')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .eq('user_id', userId)
      .select(APPLICATION_SELECT_FIELDS_ALT)
      .single()

    if (updateError) {
      console.error('Error updating application:', updateError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update application'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Format response using utility function
    const application = formatJobApplication(updatedData)

    const response: ApiResponse<JobApplication> = {
      success: true,
      data: application
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in application PUT API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * DELETE /api/applications/[id] - Withdraw application
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params
    const applicationId = resolvedParams.id

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

    // Check if application exists and belongs to user
    const { data: existingApplication, error: checkError } = await supabaseAdmin
      .from('job_applications')
      .select('id, status')
      .eq('id', applicationId)
      .eq('user_id', userId)
      .single()

    if (checkError || !existingApplication) {
      const response: ApiResponse = {
        success: false,
        error: 'Application not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Only allow withdrawal if application is pending or reviewing
    if (!['pending', 'reviewing'].includes(existingApplication.status)) {
      const response: ApiResponse = {
        success: false,
        error: 'Cannot withdraw application in current status'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Delete application
    const { error: deleteError } = await supabaseAdmin
      .from('job_applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting application:', deleteError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to withdraw application'
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'Application withdrawn successfully' }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in application DELETE API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}