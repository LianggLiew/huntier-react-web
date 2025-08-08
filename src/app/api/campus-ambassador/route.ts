import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CampusAmbassadorDB } from '@/lib/campus-ambassador-db'

interface CampusAmbassadorApplication {
  firstName: string
  lastName: string
  university: string
  faculty: string
  studentId: string
  graduationYear: string
  resumeFile?: File
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const university = formData.get('university') as string
    const faculty = formData.get('faculty') as string
    const studentId = formData.get('studentId') as string
    const graduationYear = formData.get('graduationYear') as string
    const resumeFile = formData.get('resume') as File | null

    // Validate required fields
    if (!firstName || !lastName || !university || !faculty || !studentId || !graduationYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle resume file upload if provided
    let resumeFileName: string | null = null
    let resumeFilePath: string | null = null
    let resumeFileSize: number | null = null
    let resumeMimeType: string | null = null

    if (resumeFile && resumeFile.size > 0) {
      // Validate file size (5MB limit)
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        )
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: 'Only PDF, DOC, and DOCX files are allowed' },
          { status: 400 }
        )
      }

      // Create unique filename
      const timestamp = Date.now()
      const fileExtension = resumeFile.name.split('.').pop()
      resumeFileName = `${firstName}_${lastName}_${studentId}_${timestamp}.${fileExtension}`
      resumeFileSize = resumeFile.size
      resumeMimeType = resumeFile.type

      // Upload to Supabase Storage
      const storagePath = `campus-ambassador/${resumeFileName}`
      const fileBuffer = await resumeFile.arrayBuffer()
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('resumes')
        .upload(storagePath, fileBuffer, {
          contentType: resumeFile.type,
          upsert: true
        })

      if (uploadError) {
        console.error('Resume upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload resume file' },
          { status: 500 }
        )
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('resumes')
        .getPublicUrl(storagePath)

      resumeFilePath = publicUrl
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || null
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIP || 'unknown'

    // Check if student has already applied to prevent duplicates
    const existingApplication = await CampusAmbassadorDB.checkExistingApplication(studentId, university)
    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already submitted an application for this university' },
        { status: 409 }
      )
    }

    // Insert into database
    const applicationData = await CampusAmbassadorDB.createApplication({
      first_name: firstName,
      last_name: lastName,
      university,
      faculty,
      student_id: studentId,
      graduation_year: graduationYear,
      resume_filename: resumeFileName,
      resume_file_path: resumeFilePath,
      resume_file_size: resumeFileSize,
      resume_mime_type: resumeMimeType,
      language_preference: 'en', // You can get this from request headers or form data
      user_agent: userAgent,
      ip_address: ipAddress
    })

    console.log('Campus Ambassador Application Created:', {
      applicationId: applicationData.id,
      firstName,
      lastName,
      university,
      faculty,
      timestamp: new Date().toISOString()
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: applicationData.id,
      data: {
        firstName,
        lastName,
        university,
        faculty,
        studentId,
        graduationYear,
        resumeUploaded: !!resumeFile,
        status: applicationData.application_status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Campus Ambassador Application Error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method to retrieve applications (for admin use)
export async function GET(request: NextRequest) {
  try {
    // Add authentication check here for admin access
    // const isAuthenticated = await checkAdminAuth(request)
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'submitted'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const university = searchParams.get('university') || undefined
    const graduationYear = searchParams.get('graduation_year') || undefined

    // Get applications from database
    const result = await CampusAmbassadorDB.getApplications({
      status,
      limit,
      offset,
      university,
      graduation_year: graduationYear
    })

    return NextResponse.json({
      success: true,
      applications: result.applications.map(app => ({
        id: app.id,
        firstName: app.first_name,
        lastName: app.last_name,
        university: app.university,
        faculty: app.faculty,
        studentId: app.student_id,
        graduationYear: app.graduation_year,
        status: app.application_status,
        hasResume: !!app.resume_filename,
        createdAt: app.created_at
      })),
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore
      }
    })

  } catch (error) {
    console.error('Get Applications Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}