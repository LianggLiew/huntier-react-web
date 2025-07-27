import { NextRequest, NextResponse } from 'next/server'
import { JobDatabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const location = searchParams.get('location') || undefined
    const employmentTypes = searchParams.get('employmentTypes')?.split(',') || undefined
    const recruitType = searchParams.get('recruit_type') || undefined
    const salaryMin = searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined
    const salaryMax = searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined
    const skills = searchParams.get('skills')?.split(',') || undefined
    const companyNiche = searchParams.get('companyNiche') || undefined

    const result = await JobDatabase.getJobs({
      page,
      limit,
      search,
      location,
      employmentTypes,
      recruitType,
      salaryMin,
      salaryMax,
      skills,
      companyNiche
    })


    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job, attributes } = body

    // Validate required fields
    if (!job.title || !job.company_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, company_id' },
        { status: 400 }
      )
    }

    const newJob = await JobDatabase.createJob(job, attributes)
    
    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}