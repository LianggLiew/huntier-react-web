import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/types/interface-contracts'

/**
 * POST /api/user/profile/resume - Upload resume file
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

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      const response: ApiResponse = {
        success: false,
        error: 'No file provided'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg'
    ]

    if (!allowedTypes.includes(file.type)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid file type. Only PDF, DOCX, and JPEG files are allowed.'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      const response: ApiResponse = {
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${userId}/${timestamp}-${sanitizedName}`

    // Convert file to buffer for Supabase storage
    const fileBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(fileBuffer)

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('resumes')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to upload file'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('resumes')
      .getPublicUrl(filename)

    // Determine file type based on MIME type
    const fileTypeMap: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'image/jpeg': 'jpeg'
    }

    const fileType = fileTypeMap[file.type] || 'unknown'

    // Update user profile with resume information
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert([{
        user_id: userId,
        resume_file_url: publicUrl,
        resume_file_name: file.name,
        resume_file_size: file.size,
        resume_file_type: fileType,
        resume_parsed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }], { onConflict: 'user_id' })
      .select()
      .single()

    if (profileError) {
      console.error('Error updating profile:', profileError)
      // Try to cleanup uploaded file
      await supabaseAdmin.storage.from('resumes').remove([filename])
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update profile'
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse = {
      success: true,
      data: {
        resumeFileUrl: publicUrl,
        resumeFileName: file.name,
        resumeFileSize: file.size,
        resumeFileType: fileType,
        resumeParsedAt: new Date().toISOString()
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in resume upload API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * DELETE /api/user/profile/resume - Delete current resume
 */
export async function DELETE(request: NextRequest) {
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

    // Get current resume info
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('resume_file_url')
      .eq('user_id', userId)
      .single()

    if (profileError || !profileData?.resume_file_url) {
      const response: ApiResponse = {
        success: false,
        error: 'No resume found to delete'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Extract filename from URL for storage deletion
    const fileUrl = profileData.resume_file_url
    const filename = fileUrl.split('/').pop()

    if (filename) {
      // Delete from storage (don't fail if file doesn't exist)
      await supabaseAdmin.storage.from('resumes').remove([`${userId}/${filename}`])
    }

    // Clear resume fields in profile
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        resume_file_url: null,
        resume_file_name: null,
        resume_file_size: null,
        resume_file_type: null,
        resume_parsed_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update profile'
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'Resume deleted successfully' }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in resume delete API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}