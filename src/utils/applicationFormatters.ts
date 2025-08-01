/**
 * Job Application Formatting Utilities
 * ====================================
 * 
 * Reusable functions for formatting database results into JobApplication objects.
 * Eliminates code duplication across API routes and ensures consistent formatting.
 */

import { JobApplication, ApplicationStatus } from '@/types/job-application'

/**
 * Raw application data structure from Supabase queries
 * Handles variations in job data field names across different routes
 */
export interface RawApplicationData {
  // Core application fields
  id: string
  user_id: string
  job_id: number
  status: string
  cover_letter: string
  custom_resume_url: string | null
  applied_at: string
  updated_at: string
  
  // Personal info fields (snapshot at time of application)
  applicant_first_name: string
  applicant_last_name: string
  applicant_phone: string
  nationality: string | null
  applicant_wechat_id: string | null
  
  // Job data (optional, when joined with jobs table)
  jobs?: {
    // Different routes use different field names for job ID
    id?: number           // Used in applications/[id]/route.ts
    job_id?: number       // Used in applications/route.ts and applications/status/[jobId]/route.ts
    title: string
    location: string
    employment_type: string
    companies?: {
      name: string
      logo_url?: string
    } | null
  } | null
}

/**
 * Formats raw application data from Supabase into standardized JobApplication interface
 * 
 * @param data Raw application data from database query
 * @returns Formatted JobApplication object
 */
export function formatJobApplication(data: RawApplicationData): JobApplication {
  return {
    // Core application fields
    id: data.id,
    userId: data.user_id,
    jobId: data.job_id,
    status: data.status as ApplicationStatus,
    coverLetter: data.cover_letter,
    customResumeUrl: data.custom_resume_url,
    appliedAt: data.applied_at,
    updatedAt: data.updated_at,
    
    // Personal info fields (required)
    applicantFirstName: data.applicant_first_name,
    applicantLastName: data.applicant_last_name,
    applicantPhone: data.applicant_phone,
    nationality: data.nationality,
    applicantWechatId: data.applicant_wechat_id,
    
    // Job data (optional, when available)
    job: data.jobs ? {
      // Handle different job ID field variations across routes
      jobId: data.jobs.job_id || data.jobs.id || data.job_id,
      title: data.jobs.title,
      location: data.jobs.location,
      employmentType: data.jobs.employment_type,
      company: {
        name: data.jobs.companies?.name || 'Unknown Company',
        logoUrl: data.jobs.companies?.logo_url
      }
    } : undefined
  }
}

/**
 * Formats an array of raw application data into JobApplication array
 * 
 * @param data Array of raw application data from database query
 * @returns Array of formatted JobApplication objects
 */
export function formatJobApplications(data: RawApplicationData[]): JobApplication[] {
  return data.map(formatJobApplication)
}

/**
 * Standard SELECT query fields for job applications
 * Use this to ensure consistent database queries across all routes
 */
export const APPLICATION_SELECT_FIELDS = `
  id,
  user_id,
  job_id,
  status,
  cover_letter,
  custom_resume_url,
  applied_at,
  updated_at,
  applicant_first_name,
  applicant_last_name,
  applicant_phone,
  nationality,
  applicant_wechat_id,
  jobs!job_id (
    job_id,
    title,
    location,
    employment_type,
    companies!company_id (
      name,
      logo_url
    )
  )
`

/**
 * Alternative SELECT query for routes that use jobs.id instead of jobs.job_id
 * Used in applications/[id]/route.ts
 */
export const APPLICATION_SELECT_FIELDS_ALT = `
  id,
  user_id,
  job_id,
  status,
  cover_letter,
  custom_resume_url,
  applied_at,
  updated_at,
  applicant_first_name,
  applicant_last_name,
  applicant_phone,
  nationality,
  applicant_wechat_id,
  jobs!job_id (
    id,
    title,
    location,
    employment_type,
    companies!company_id (
      name,
      logo_url
    )
  )
`

/**
 * Validates that all required personal info fields are present
 * Useful for debugging and testing
 * 
 * @param application JobApplication object to validate
 * @returns Object with validation results
 */
export function validatePersonalInfoFields(application: JobApplication) {
  const requiredFields = ['applicantFirstName', 'applicantLastName', 'applicantPhone'] as const
  const optionalFields = ['nationality', 'applicantWechatId'] as const
  
  const missing: string[] = []
  const present: string[] = []
  const optional: { field: string; hasValue: boolean }[] = []
  
  // Check required fields
  requiredFields.forEach(field => {
    if (application[field]) {
      present.push(field)
    } else {
      missing.push(field)
    }
  })
  
  // Check optional fields
  optionalFields.forEach(field => {
    optional.push({
      field,
      hasValue: Boolean(application[field])
    })
  })
  
  return {
    isValid: missing.length === 0,
    requiredFields: {
      present,
      missing
    },
    optionalFields: optional
  }
}