import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

// Validation schema for saving a job
const SaveJobSchema = z.object({
  jobId: z.number().positive('Job ID must be a positive number')
})

// Query params schema for GET request
const GetSavedJobsSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().nullable().optional().transform(val => val === '' || val === null ? undefined : val),
  location: z.string().nullable().optional().transform(val => val === '' || val === null ? undefined : val),
  company: z.string().nullable().optional().transform(val => val === '' || val === null ? undefined : val),
  sortBy: z.enum(['saved_at', 'title', 'company']).default('saved_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Define select fields for saved jobs with job details
const SAVED_JOBS_SELECT_FIELDS = `
  id,
  job_id,
  saved_at,
  jobs:job_id (
    job_id,
    title,
    location,
    employment_type,
    salary_min,
    salary_max,
    posted_date,
    expires_at,
    status,
    description,
    requirements,
    companies:company_id (
      company_id,
      name,
      logo_url,
      description,
      niche,
      address
    )
  )
`

/**
 * POST /api/saved-jobs - Save a job
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
    const parseResult = SaveJobSchema.safeParse(body)

    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid request data',
        details: parseResult.error.flatten()
      }
      return NextResponse.json(response, { status: 400 })
    }

    const { jobId } = parseResult.data

    // Check if job exists and is active
    const { data: jobData, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('job_id, title, status')
      .eq('job_id', jobId)
      .single()

    if (jobError || !jobData) {
      const response: ApiResponse = {
        success: false,
        error: 'Job not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    if (jobData.status !== 'active') {
      const response: ApiResponse = {
        success: false,
        error: 'Job is no longer available'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if job is already saved
    const { data: existingSavedJob, error: checkError } = await supabaseAdmin
      .from('saved_jobs')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single()

    if (existingSavedJob) {
      const response: ApiResponse = {
        success: false,
        error: 'Job is already saved'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Save the job
    const { data: savedJobData, error: saveError } = await supabaseAdmin
      .from('saved_jobs')
      .insert([{
        user_id: userId,
        job_id: jobId,
        saved_at: new Date().toISOString()
      }])
      .select(SAVED_JOBS_SELECT_FIELDS)
      .single()

    if (saveError) {
      console.error('Error saving job:', saveError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to save job'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Format the response
    const formattedSavedJob = formatSavedJob(savedJobData)

    const response: ApiResponse = {
      success: true,
      data: formattedSavedJob,
      message: 'Job saved successfully'
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Error in saved-jobs POST API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/saved-jobs - Get user's saved jobs
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = {
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      search: searchParams.get('search'),
      location: searchParams.get('location'),
      company: searchParams.get('company'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder')
    }

    const parseResult = GetSavedJobsSchema.safeParse(queryParams)
    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid query parameters',
        details: parseResult.error.flatten()
      }
      return NextResponse.json(response, { status: 400 })
    }

    const { limit, offset, search, location, company, sortBy, sortOrder } = parseResult.data

    // Build query
    let query = supabaseAdmin
      .from('saved_jobs')
      .select(SAVED_JOBS_SELECT_FIELDS, { count: 'exact' })
      .eq('user_id', userId)

    // Apply filters
    if (search) {
      query = query.or(`jobs.title.ilike.%${search}%,jobs.companies.name.ilike.%${search}%`)
    }

    if (location) {
      query = query.eq('jobs.location', location)
    }

    if (company) {
      query = query.eq('jobs.companies.name', company)
    }

    // Apply sorting
    if (sortBy === 'saved_at') {
      query = query.order('saved_at', { ascending: sortOrder === 'asc' })
    } else if (sortBy === 'title') {
      query = query.order('jobs(title)', { ascending: sortOrder === 'asc' })
    } else if (sortBy === 'company') {
      query = query.order('jobs(companies(name))', { ascending: sortOrder === 'asc' })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: savedJobsData, error: savedJobsError, count } = await query

    if (savedJobsError) {
      console.error('Error fetching saved jobs:', savedJobsError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch saved jobs'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Format saved jobs
    const savedJobs = (savedJobsData || []).map(formatSavedJob)

    const total = count || 0
    const hasMore = offset + limit < total

    const response: ApiResponse = {
      success: true,
      data: {
        savedJobs,
        total,
        hasMore,
        pagination: {
          limit,
          offset,
          total,
          hasMore
        }
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

/**
 * Helper function to format saved job data
 */
function formatSavedJob(rawData: any) {
  if (!rawData || !rawData.jobs) {
    return null
  }

  const job = rawData.jobs
  const company = job.companies

  return {
    id: rawData.id,
    jobId: rawData.job_id,
    savedAt: rawData.saved_at,
    job: {
      id: job.job_id,
      title: job.title,
      location: job.location,
      employmentType: job.employment_type,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      postedDate: job.posted_date,
      expiresAt: job.expires_at,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      company: company ? {
        id: company.company_id,
        name: company.name,
        logoUrl: company.logo_url,
        description: company.description,
        industry: company.niche,
        location: company.address
      } : null
    }
  }
}