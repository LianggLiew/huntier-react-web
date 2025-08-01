/**
 * JOB APPLICATION SYSTEM TYPES
 * ============================
 * Types for job application workflow, status tracking, and application management
 */

/**
 * Application status enum
 */
export type ApplicationStatus = 
  | 'pending'     // Just submitted, waiting for review
  | 'reviewing'   // Under review by employer
  | 'interviewed' // User has been interviewed
  | 'accepted'    // Application accepted
  | 'rejected'    // Application rejected

/**
 * Job application data structure
 */
export interface JobApplication {
  /** Unique application ID */
  id: string
  
  /** ID of user who applied */
  userId: string
  
  /** ID of job being applied to */
  jobId: number
  
  /** Current application status */
  status: ApplicationStatus
  
  /** User's cover letter */
  coverLetter: string
  
  /** URL to custom resume (if uploaded) */
  customResumeUrl?: string | null
  
  /** When application was submitted */
  appliedAt: string
  
  /** When application was last updated */
  updatedAt: string
  
  /** Job details (populated when fetching applications) */
  job?: JobApplicationJobDetails
  
  /** Personal info snapshot (from Phase 1 implementation) */
  applicantFirstName: string
  applicantLastName: string
  applicantPhone: string
  nationality?: string
  applicantWechatId?: string
}

/**
 * Job details included with application
 */
export interface JobApplicationJobDetails {
  jobId: number
  title: string
  location: string
  employmentType: string
  company: {
    name: string
    logoUrl?: string
  }
}

/**
 * Application submission data
 */
export interface ApplicationSubmissionData {
  /** ID of job being applied to */
  jobId: number
  
  /** User's cover letter */
  coverLetter: string
  
  /** Applicant personal information (snapshot) */
  applicantInfo: {
    firstName: string
    lastName: string
    phoneNumber: string
    nationality?: string
    wechatId?: string
  }
  
  /** Custom resume file (optional) */
  customResumeFile?: File
  
  /** URL to custom resume (if already uploaded) */
  customResumeUrl?: string
}

/**
 * Application form props interface
 */
export interface ApplicationFormProps {
  /** Job being applied to */
  jobId: number
  
  /** Job title */
  jobTitle: string
  
  /** Company name */
  companyName: string
  
  /** Callback when application is submitted */
  onSubmit: (data: ApplicationSubmissionData) => Promise<void>
  
  /** Callback when form is cancelled */
  onCancel: () => void
  
  /** Whether form is currently submitting */
  isLoading?: boolean
  
  /** Initial cover letter text */
  initialCoverLetter?: string
}

/**
 * Application button props interface
 */
export interface ApplicationButtonProps {
  /** Job being applied to */
  jobId: number
  
  /** Job title */
  jobTitle: string
  
  /** Company name */
  companyName: string
  
  /** Current application status (if user has applied) */
  applicationStatus?: ApplicationStatus | null
  
  /** Callback when application is submitted */
  onApplicationSubmit?: () => void
  
  /** Custom button text (optional) */
  buttonText?: string
  
  /** Button variant */
  variant?: 'default' | 'outline' | 'secondary'
}