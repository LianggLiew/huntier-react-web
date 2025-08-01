import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateSession, getSessionFromRequest } from '@/lib/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

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
        { success: false, error: 'Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.' },
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
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `avatar_${Date.now()}.${fileExtension}`
    const filePath = `${user.id}/${fileName}`

    // Check if user already has an avatar, delete the old one
    const { data: currentProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('avatar_url')
      .eq('user_id', user.id)
      .single()

    if (currentProfile?.avatar_url) {
      // Extract file path from the current avatar URL to delete old avatar
      try {
        const oldFilePath = currentProfile.avatar_url.split('/').slice(-2).join('/')
        await supabaseAdmin.storage
          .from('avatars')
          .remove([oldFilePath])
      } catch (error) {
        console.warn('Could not delete old avatar:', error)
        // Continue with upload even if old file deletion fails
      }
    }

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload avatar' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Update user profile with new avatar URL
    const { data: profileData, error: dbError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database update fails
      await supabaseAdmin.storage
        .from('avatars')
        .remove([filePath])
      
      return NextResponse.json(
        { success: false, error: 'Failed to update profile with avatar URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        avatarUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}