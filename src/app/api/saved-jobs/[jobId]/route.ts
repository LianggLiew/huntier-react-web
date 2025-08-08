import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/api'

/**
 * DELETE /api/saved-jobs/[jobId] - Remove a saved job
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
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

    // Get job ID from params
    const resolvedParams = await params
    const jobIdStr = resolvedParams.jobId
    const jobId = parseInt(jobIdStr)

    if (isNaN(jobId) || jobId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid job ID'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if the saved job exists and belongs to the user
    const { data: savedJob, error: findError } = await supabaseAdmin
      .from('saved_jobs')
      .select('id, job_id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single()

    if (findError || !savedJob) {
      const response: ApiResponse = {
        success: false,
        error: 'Saved job not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Delete the saved job
    const { error: deleteError } = await supabaseAdmin
      .from('saved_jobs')
      .delete()
      .eq('id', savedJob.id)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting saved job:', deleteError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to remove saved job'
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse = {
      success: true,
      message: 'Job removed from saved list successfully'
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in saved-jobs DELETE API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/saved-jobs/[jobId] - Check if a job is saved
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
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

    // Get job ID from params
    const resolvedParams = await params
    const jobIdStr = resolvedParams.jobId
    const jobId = parseInt(jobIdStr)

    if (isNaN(jobId) || jobId <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid job ID'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if job is saved
    const { data: savedJob, error: findError } = await supabaseAdmin
      .from('saved_jobs')
      .select('id, saved_at')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single()

    const isSaved = !findError && !!savedJob

    const response: ApiResponse = {
      success: true,
      data: {
        jobId,
        isSaved,
        savedAt: isSaved ? savedJob.saved_at : null
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in saved-jobs GET API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}