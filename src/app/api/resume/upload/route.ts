import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateSession, getSessionFromRequest } from '@/lib/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function POST(request: NextRequest) {
  try {
    // Validate session
    const sessionToken = getSessionFromRequest(request)
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session token provided' },
        { status: 401 }
      )
    }

    const validationResult = await validateSession(sessionToken)
    if (!validationResult.valid || !validationResult.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    const user = validationResult.user

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF and DOC/DOCX files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate file path
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const fileName = `resume_${Date.now()}.${fileExtension}`
    const filePath = `${user.id}/original/${fileName}`

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('resumes')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('resumes')
      .getPublicUrl(filePath)

    // Check if user already has a resume, delete the old one
    const { data: existingResume } = await supabaseAdmin
      .from('user_resumes')
      .select('file_url, id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single()

    if (existingResume) {
      // Delete old file from storage if it exists
      const oldFilePath = existingResume.file_url.split('/').slice(-3).join('/')
      await supabaseAdmin.storage
        .from('resumes')
        .remove([oldFilePath])

      // Delete old database record
      await supabaseAdmin
        .from('user_resumes')
        .delete()
        .eq('id', existingResume.id)
    }

    // Save resume metadata to database
    const { data: resumeData, error: dbError } = await supabaseAdmin
      .from('user_resumes')
      .insert({
        user_id: user.id,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: fileExtension,
        is_primary: true,
        version: 1
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage
        .from('resumes')
        .remove([filePath])
      
      return NextResponse.json(
        { success: false, error: 'Failed to save resume metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        resumeId: resumeData.id,
        fileUrl: resumeData.file_url,
        fileName: resumeData.file_name,
        version: resumeData.version,
        isPrimary: resumeData.is_primary
      }
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}