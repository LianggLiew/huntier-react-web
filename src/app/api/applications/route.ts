import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/api'
import { 
  JobApplication, 
  ApplicationSubmissionData,
  ApplicationStatus 
} from '@/types/job-application'
import { formatJobApplication, formatJobApplications, APPLICATION_SELECT_FIELDS } from '@/utils/applicationFormatters'
import { z } from 'zod'

// Validation schema for application submission
const ApplicationSubmissionSchema = z.object({
  jobId: z.number(),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(2000, 'Cover letter cannot exceed 2000 characters'),
  customResumeUrl: z.string().url().optional(),
  // Applicant snapshot data
  applicantInfo: z.object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
    phoneNumber: z.string().min(1, 'Phone number is required').max(20, 'Phone number too long'),
    nationality: z.string().max(100, 'Nationality too long').optional(),
    wechatId: z.string().max(100, 'WeChat ID too long').optional()
  })
})

/**
 * POST /api/applications - Submit new job application
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult2 = ApplicationSubmissionSchema.safeParse(body)

    if (!validationResult2.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid application data',
        details: validationResult2.error.flatten()
      }
      return NextResponse.json(response, { status: 400 })
    }

    const { jobId, coverLetter, customResumeUrl, applicantInfo } = validationResult2.data

    // If no custom resume URL provided, get user's primary resume from user_resumes table
    let finalResumeUrl = customResumeUrl
    if (!customResumeUrl) {
      const { data: resumeData } = await supabaseAdmin
        .from('user_resumes')
        .select('file_url')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .single()
      
      if (resumeData?.file_url) {
        finalResumeUrl = resumeData.file_url
      }
    }

    // Check if job exists
    const { data: jobData, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('job_id, title')
      .eq('job_id', jobId)
      .single()

    if (jobError || !jobData) {
      const response: ApiResponse = {
        success: false,
        error: 'Job not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Check if user already applied to this job
    const { data: existingApplication, error: checkError } = await supabaseAdmin
      .from('job_applications')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single()

    if (existingApplication) {
      const response: ApiResponse = {
        success: false,
        error: 'You have already applied to this job'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Create application
    const applicationInsertData = {
      user_id: userId,
      job_id: jobId,
      status: 'pending',
      cover_letter: coverLetter,
      custom_resume_url: finalResumeUrl || null,
      // Applicant snapshot data
      applicant_first_name: applicantInfo.firstName,
      applicant_last_name: applicantInfo.lastName,
      applicant_phone: applicantInfo.phoneNumber,
      nationality: applicantInfo.nationality || null,
      applicant_wechat_id: applicantInfo.wechatId || null,
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('job_applications')
      .insert([applicationInsertData])
      .select(APPLICATION_SELECT_FIELDS)
      .single()

    if (applicationError) {
      console.error('Error creating application:', applicationError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create application'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Format response using utility function
    const application = formatJobApplication(applicationData)

    const response: ApiResponse<JobApplication> = {
      success: true,
      data: application
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Error in applications POST API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/applications - Get user's applications
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ApplicationStatus | null
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabaseAdmin
      .from('job_applications')
      .select(APPLICATION_SELECT_FIELDS, { count: 'exact' })
      .eq('user_id', userId)
      .order('applied_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: applicationsData, error: applicationsError, count } = await query

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch applications'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Format applications using utility function
    const applications = formatJobApplications(applicationsData || [])

    const total = count || 0
    const hasMore = offset + limit < total

    const response: ApiResponse = {
      success: true,
      data: {
        applications,
        total,
        hasMore
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in applications GET API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}