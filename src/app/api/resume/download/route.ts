import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateSession, getSessionFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    // Get user's primary resume
    const { data: resumeData, error: resumeError } = await supabaseAdmin
      .from('user_resumes')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single()

    if (resumeError || !resumeData) {
      console.error('Resume query error:', resumeError)
      console.log('User ID:', user.id)
      
      // Try to find any resume for this user (debugging)
      const { data: allResumes } = await supabaseAdmin
        .from('user_resumes')
        .select('*')
        .eq('user_id', user.id)
      
      console.log('All resumes for user:', allResumes)
      
      return NextResponse.json(
        { success: false, error: 'No resume found', debug: { userId: user.id, resumeError, allResumes } },
        { status: 404 }
      )
    }

    // Extract file path from the public URL
    const urlParts = resumeData.file_url.split('/')
    const filePath = urlParts.slice(-3).join('/') // Gets "user_id/original/filename"

    // Create signed URL for secure download (expires in 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('resumes')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        fileUrl: signedUrlData.signedUrl,
        fileName: resumeData.file_name,
        fileSize: resumeData.file_size,
        uploadedAt: resumeData.uploaded_at
      }
    })

  } catch (error) {
    console.error('Resume download error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}