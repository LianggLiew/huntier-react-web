import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getSessionFromRequest } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ApiResponse, UserProfile, ProfileUpdateResponse, ProfileExperience, ProfileEducation, ProfileSkill, ProfileCertification, ProfileProject } from '@/types'
import { z } from 'zod'

// Validation schema for profile updates
const ProfileUpdateSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
  highestDegree: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  onboardingCompleted: z.boolean().optional(),
  resumeFileUrl: z.string().url().nullable().optional(),
  resumeFileName: z.string().nullable().optional(),
  resumeParsedAt: z.string().nullable().optional(),
  resumeFileSize: z.number().nullable().optional(),
  resumeFileType: z.string().nullable().optional(),
  wechatId: z.string().nullable().optional(),
  jobPreferences: z.object({
    preferredLocations: z.array(z.string()).optional(),
    preferredEmploymentTypes: z.array(z.enum(['full-time', 'part-time', 'contract'])).optional(),
    preferredSalaryMin: z.number().nullable().optional(),
    preferredSalaryMax: z.number().nullable().optional(),
    preferredCompanySizes: z.array(z.string()).optional(),
    preferredIndustries: z.array(z.string()).optional(),
    remoteWorkPreference: z.enum(['only', 'hybrid', 'no_preference', 'onsite_only']).optional()
  }).optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    jobRecommendations: z.boolean().optional(),
    applicationUpdates: z.boolean().optional(),
    marketing: z.boolean().optional()
  }).optional(),
  additionalContactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional()
  }).optional(),
  experience: z.array(z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable().optional(),
    description: z.string(),
    location: z.string().nullable().optional(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).nullable().optional()
  })).optional(),
  education: z.array(z.object({
    id: z.string(),
    degree: z.string(),
    institution: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    gpa: z.string().nullable().optional()
  })).optional(),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string().nullable().optional(),
    proficiency: z.number().min(1).max(100),
    yearsOfExperience: z.number().nullable().optional()
  })).optional(),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    expiryDate: z.string().nullable().optional(),
    credentialId: z.string().nullable().optional(),
    credentialUrl: z.string().url().nullable().optional(),
    description: z.string().nullable().optional()
  })).optional(),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string().nullable().optional(),
    url: z.string().url().nullable().optional(),
    githubUrl: z.string().url().nullable().optional(),
    role: z.string().nullable().optional(),
    teamSize: z.number().nullable().optional()
  })).optional()
})

/**
 * GET /api/user/profile - Get current user's profile
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

    // Get user profile from database
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Database error fetching profile:', profileError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch profile'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // If no profile exists, return null
    if (!profileData) {
      const response: ApiResponse<UserProfile | null> = {
        success: true,
        data: null
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Get user's primary resume
    const { data: resumeData } = await supabaseAdmin
      .from('user_resumes')
      .select('file_url, file_name, file_size, file_type, uploaded_at')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single()

    // Format profile data according to interface contract
    const profile: UserProfile = {
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      dateOfBirth: profileData.date_of_birth,
      nationality: profileData.nationality,
      location: profileData.location,
      major: profileData.major,
      highestDegree: profileData.highest_degree,
      avatarUrl: profileData.avatar_url,
      title: profileData.title,
      bio: profileData.bio,
      onboardingCompleted: profileData.onboarding_completed || false,
      profileCompletionPercentage: profileData.profile_completion_percentage || 0,
      resumeFileUrl: resumeData?.file_url || null,
      resumeFileName: resumeData?.file_name || null,
      resumeParsedAt: resumeData?.uploaded_at || null,
      resumeFileSize: resumeData?.file_size || null,
      resumeFileType: resumeData?.file_type || null,  
      wechatId: profileData.wechat_id,
      jobPreferences: profileData.job_preferences || {
        preferredLocations: [],
        preferredEmploymentTypes: [],
        preferredCompanySizes: [],
        preferredIndustries: [],
        remoteWorkPreference: 'no_preference'
      },
      notificationPreferences: profileData.notification_preferences || {
        email: true,
        sms: false,
        jobRecommendations: true,
        applicationUpdates: true,
        marketing: false
      },
      experience: profileData.experience || [],
      education: profileData.education || [],
      skills: profileData.skills || [],
      certifications: profileData.certifications || [],
      projects: profileData.projects || []
    }

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: profile
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in user profile GET API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * PUT /api/user/profile - Update user's profile
 */
export async function PUT(request: NextRequest) {
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
    const validationResult2 = ProfileUpdateSchema.safeParse(body)

    if (!validationResult2.success) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid profile data',
        details: validationResult2.error.flatten()
      }
      return NextResponse.json(response, { status: 400 })
    }

    const updates = validationResult2.data

    // Handle additional contact info if provided
    if (updates.additionalContactInfo) {
      const userUpdates: any = {}
      if (updates.additionalContactInfo.email) {
        userUpdates.email = updates.additionalContactInfo.email
      }
      if (updates.additionalContactInfo.phone) {
        userUpdates.phone = updates.additionalContactInfo.phone
      }

      if (Object.keys(userUpdates).length > 0) {
        const { error: userUpdateError } = await supabaseAdmin
          .from('users')
          .update(userUpdates)
          .eq('id', userId)

        if (userUpdateError) {
          console.error('Error updating user contact info:', userUpdateError)
        }
      }
    }

    // Calculate profile completion percentage
    const profileForCompletion: Partial<UserProfile> = {
      firstName: updates.firstName ?? null,
      lastName: updates.lastName ?? null,
      dateOfBirth: updates.dateOfBirth ?? null,
      nationality: updates.nationality ?? null,
      location: updates.location ?? null,
      major: updates.major ?? null,
      highestDegree: updates.highestDegree ?? null,
      title: updates.title ?? null,
      bio: updates.bio ?? null,
      experience: updates.experience,
      education: updates.education,
      skills: updates.skills,
      certifications: updates.certifications,
      projects: updates.projects,
      resumeFileUrl: updates.resumeFileUrl
      //jobPreferences: updates.jobPreferences
    }
    
    const profileCompletionPercentage = calculateProfileCompletion(profileForCompletion)

    // Prepare database update object
    const dbUpdate: any = {
      user_id: userId,
      first_name: updates.firstName,
      last_name: updates.lastName,
      date_of_birth: updates.dateOfBirth,
      nationality: updates.nationality,
      location: updates.location,
      major: updates.major,
      highest_degree: updates.highestDegree,
      avatar_url: updates.avatarUrl,
      title: updates.title,
      bio: updates.bio,
      onboarding_completed: updates.onboardingCompleted,
      profile_completion_percentage: profileCompletionPercentage,
      resume_file_url: updates.resumeFileUrl,
      resume_file_name: updates.resumeFileName,
      resume_parsed_at: updates.resumeParsedAt,
      resume_file_size: updates.resumeFileSize,
      resume_file_type: updates.resumeFileType,
      wechat_id: updates.wechatId,
      job_preferences: updates.jobPreferences,
      notification_preferences: updates.notificationPreferences,
      experience: updates.experience,
      education: updates.education,
      skills: updates.skills,
      certifications: updates.certifications,
      projects: updates.projects,
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(dbUpdate).forEach(key => {
      if (dbUpdate[key] === undefined) {
        delete dbUpdate[key]
      }
    })

    // Upsert profile (insert or update)
    const { data: profileData, error: upsertError } = await supabaseAdmin
      .from('user_profiles')
      .upsert([dbUpdate], { onConflict: 'user_id' })
      .select()
      .single()

    if (upsertError) {
      console.error('Database error upserting profile:', upsertError)
      const response: ApiResponse = {
        success: false,
        error: 'Failed to update profile'
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Get user's primary resume for response
    const { data: resumeData } = await supabaseAdmin
      .from('user_resumes')
      .select('file_url, file_name, file_size, file_type, uploaded_at')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single()

    // Format response data
    const updatedProfile: UserProfile = {
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      dateOfBirth: profileData.date_of_birth,
      nationality: profileData.nationality,
      location: profileData.location,
      major: profileData.major,
      highestDegree: profileData.highest_degree,
      avatarUrl: profileData.avatar_url,
      title: profileData.title,
      bio: profileData.bio,
      onboardingCompleted: profileData.onboarding_completed || false,
      profileCompletionPercentage: profileData.profile_completion_percentage || 0,
      resumeFileUrl: resumeData?.file_url || null,
      resumeFileName: resumeData?.file_name || null,
      resumeParsedAt: resumeData?.uploaded_at || null,
      resumeFileSize: resumeData?.file_size || null,
      resumeFileType: resumeData?.file_type || null,  
      wechatId: profileData.wechat_id,
      jobPreferences: profileData.job_preferences || {
        preferredLocations: [],
        preferredEmploymentTypes: [],
        preferredCompanySizes: [],
        preferredIndustries: [],
        remoteWorkPreference: 'no_preference'
      },
      notificationPreferences: profileData.notification_preferences || {
        email: true,
        sms: false,
        jobRecommendations: true,
        applicationUpdates: true,
        marketing: false
      },
      experience: profileData.experience || [],
      education: profileData.education || [],
      skills: profileData.skills || [],
      certifications: profileData.certifications || [],
      projects: profileData.projects || []
    }

    const response: ApiResponse<ProfileUpdateResponse> = {
      success: true,
      data: {
        success: true,
        profile: updatedProfile
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error in user profile PUT API:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * Calculate profile completion percentage based on filled fields
 */
function calculateProfileCompletion(profile: Partial<UserProfile>): number {
  const basicFields = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'nationality',
    'location',
    'title',
    'bio'
  ]

  let filledFields = 0
  
  // Count basic fields
  for (const field of basicFields) {
    if (profile[field as keyof UserProfile]) {
      filledFields++
    }
  }

  // Add points for resume
  if (profile.resumeFileUrl) filledFields++

  // Add points for job preferences
  if (profile.jobPreferences?.preferredLocations?.length) filledFields++

  // Add points for experience (1 or more entries)
  if (profile.experience && profile.experience.length > 0) filledFields++

  // Add points for education (1 or more entries)
  if (profile.education && profile.education.length > 0) filledFields++

  // Add points for skills (3 or more entries for full credit)
  if (profile.skills && profile.skills.length >= 3) filledFields++

  // Add points for certifications (1 or more entries)
  if (profile.certifications && profile.certifications.length > 0) filledFields++

  // Add points for projects (1 or more entries)
  if (profile.projects && profile.projects.length > 0) filledFields++

  const totalFields = basicFields.length + 7 // +7 for resume, job preferences, experience, education, skills, certifications, projects
  return Math.round((filledFields / totalFields) * 100)
}