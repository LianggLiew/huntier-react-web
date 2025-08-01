/**
 * API TYPE DEFINITIONS
 * ====================
 * 
 * Standard API response formats and endpoint contracts.
 */

import { User, UserProfile, OTPVerificationResponse, SessionValidationResponse, ProfileUpdateResponse } from './user'
import { JobApplication, ApplicationSubmissionData, ApplicationStatus } from './job-application'

/**
 * Standard API response wrapper
 * All API endpoints should return this format
 */
export interface ApiResponse<T = any> {
  /** Whether request was successful */
  success: boolean
  
  /** Response data (if successful) */
  data?: T
  
  /** Error message (if failed) */
  error?: string
  
  /** Additional error details */
  details?: any
}

/**
 * User Authentication API endpoints
 */
export interface UserAuthAPI {
  /** POST /api/auth/send-otp - Send OTP code */
  sendOTP(data: {
    contactValue: string
    contactType: 'email' | 'phone'
  }): Promise<ApiResponse<{ message: string }>>
  
  /** POST /api/auth/verify-otp - Verify OTP and create session */
  verifyOTP(data: {
    contactValue: string
    contactType: 'email' | 'phone'
    otpCode: string
  }): Promise<ApiResponse<OTPVerificationResponse>>
  
  /** GET /api/auth/validate-session - Validate current session */
  validateSession(): Promise<ApiResponse<SessionValidationResponse>>
  
  /** POST /api/auth/logout - Logout current user */
  logout(): Promise<ApiResponse<{ message: string }>>
}

/**
 * User Profile API endpoints
 */
export interface UserProfileAPI {
  /** GET /api/user/profile - Get current user's profile */
  getProfile(): Promise<ApiResponse<UserProfile>>
  
  /** PUT /api/user/profile - Update user's profile */
  updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<ProfileUpdateResponse>>
  
  /** GET /api/user/profile/completion - Get profile completion status */
  getProfileCompletion(): Promise<ApiResponse<{ percentage: number, missingFields: string[] }>>
}

/**
 * Job Application API endpoints
 */
export interface JobApplicationAPI {
  /** POST /api/applications - Submit new job application */
  submitApplication(data: ApplicationSubmissionData): Promise<ApiResponse<JobApplication>>
  
  /** GET /api/applications - Get user's applications */
  getUserApplications(params?: {
    status?: ApplicationStatus
    limit?: number
    offset?: number
  }): Promise<ApiResponse<{
    applications: JobApplication[]
    total: number
    hasMore: boolean
  }>>
  
  /** GET /api/applications/[id] - Get specific application */
  getApplication(applicationId: string): Promise<ApiResponse<JobApplication>>
  
  /** PUT /api/applications/[id] - Update application (limited fields) */
  updateApplication(
    applicationId: string, 
    updates: { coverLetter?: string }
  ): Promise<ApiResponse<JobApplication>>
  
  /** DELETE /api/applications/[id] - Withdraw application */
  withdrawApplication(applicationId: string): Promise<ApiResponse<{ message: string }>>
  
  /** GET /api/applications/status/[jobId] - Check if user applied to specific job */
  getApplicationStatus(jobId: number): Promise<ApiResponse<{
    hasApplied: boolean
    application?: JobApplication
  }>>
}