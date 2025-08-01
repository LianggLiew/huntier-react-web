/**
 * MAIN TYPES EXPORT
 * ==================
 * 
 * Re-exports all types for easy importing throughout the application.
 * 
 * Usage Examples:
 *   import { User, UserProfile } from '@/types'
 *   import { JobApplication, ApplicationStatus } from '@/types'
 *   import { ApiResponse } from '@/types'
 */

// User & Authentication types
export type {
  User,
  UserProfile,
  JobPreferences,
  NotificationPreferences,
  ProfileExperience,
  ProfileEducation,
  ProfileSkill,
  ProfileCertification,
  ProfileProject,
  AuthContextType,
  UseAuthReturn,
  SessionValidationResponse,
  OTPVerificationResponse,
  ProfileUpdateResponse
} from './user'

// Core Job types
export type {
  Job,
  DbJob,
  Company,
  JobAttributes,
  JobFilters,
  JobListingResponse,
} from './job'

export { transformDbJobToUiJob } from './job'

// Job Application types
export type {
  JobApplication,
  ApplicationStatus,
  JobApplicationJobDetails,
  ApplicationSubmissionData,
  ApplicationFormProps,
  ApplicationButtonProps
} from './job-application'

// API types
export type {
  ApiResponse,
  UserAuthAPI,
  UserProfileAPI,
  JobApplicationAPI
} from './api'

// Component types
export type {
  ProtectedRouteProps,
  AuthProviderProps,
  WorkflowStep
} from './components'