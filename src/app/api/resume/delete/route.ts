import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateSession, getSessionFromRequest } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
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
      return NextResponse.json(
        { success: false, error: 'No resume found' },
        { status: 404 }
      )
    }

    // Extract file path from the public URL
    const urlParts = resumeData.file_url.split('/')
    const filePath = urlParts.slice(-3).join('/') // Gets "user_id/original/filename"

    // Delete file from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('resumes')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete database record
    const { error: dbError } = await supabaseAdmin
      .from('user_resumes')
      .delete()
      .eq('id', resumeData.id)

    if (dbError) {
      console.error('Database deletion error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete resume record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    })

  } catch (error) {
    console.error('Resume deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}