/**
 * USER & PROFILE TYPE DEFINITIONS
 * ================================
 * 
 * Core user data structures and authentication types.
 */

/**
 * Core User object - used throughout the application
 */
export interface User {
  /** Unique user identifier (UUID from database) */
  id: string
  
  /** User's email address (optional, may be null if phone signup) */
  email?: string | null
  
  /** User's phone number (optional, may be null if email signup) */
  phone?: string | null
  
  /** Whether user's contact method (email/phone) has been verified via OTP */
  isVerified: boolean
  
  /** Whether user is currently authenticated (has valid session) */
  isAuthenticated: boolean
  
  /** Whether user needs to complete onboarding process */
  needsOnboarding: boolean
  
  /** Timestamp when user was created */
  createdAt: string
  
  /** Timestamp when user last logged in */
  lastLogin?: string | null
}

/**
 * Extended user profile information
 */
export interface UserProfile {
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  nationality?: string | null
  location?: string | null
  major?: string | null
  highestDegree?: string | null
  avatarUrl?: string | null
  title?: string | null
  bio?: string | null
  onboardingCompleted: boolean
  profileCompletionPercentage: number
  resumeFileUrl?: string | null
  resumeFileName?: string | null
  resumeParsedAt?: string | null
  resumeFileSize?: number | null
  resumeFileType?: string | null
  wechatId?: string | null
  jobPreferences: JobPreferences
  notificationPreferences: NotificationPreferences
  experience?: ProfileExperience[]
  education?: ProfileEducation[]
  skills?: ProfileSkill[]
  certifications?: ProfileCertification[]
  projects?: ProfileProject[]
}

/**
 * User's job search preferences
 */
export interface JobPreferences {
  preferredLocations: string[]
  preferredEmploymentTypes: ('full-time' | 'part-time' | 'contract')[]
  preferredSalaryMin?: number | null
  preferredSalaryMax?: number | null
  preferredCompanySizes: string[]
  preferredIndustries: string[]
  remoteWorkPreference: 'only' | 'hybrid' | 'no_preference' | 'onsite_only'
}

/**
 * User's notification preferences
 */
export interface NotificationPreferences {
  email: boolean
  sms: boolean
  jobRecommendations: boolean
  applicationUpdates: boolean
  marketing: boolean
}

/**
 * User's work experience entry
 */
export interface ProfileExperience {
  id: string
  title: string
  company: string
  startDate: string
  endDate?: string | null
  description: string
  location?: string | null
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship' | null
}

/**
 * User's education entry
 */
export interface ProfileEducation {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string
  description?: string | null
  location?: string | null
  gpa?: string | null
}

/**
 * User's skill entry
 */
export interface ProfileSkill {
  id: string
  name: string
  category?: string | null
  proficiency: number
  yearsOfExperience?: number | null
}

/**
 * User's certification entry
 */
export interface ProfileCertification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string | null
  credentialId?: string | null
  credentialUrl?: string | null
  description?: string | null
}

/**
 * User's project entry
 */
export interface ProfileProject {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate?: string | null
  url?: string | null
  githubUrl?: string | null
  role?: string | null
  teamSize?: number | null
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (sessionToken: string, userData: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  refreshUser: () => Promise<void>
}

/**
 * Authentication hook return type
 */
export interface UseAuthReturn extends AuthContextType {}

/**
 * Session validation response
 */
export interface SessionValidationResponse {
  valid: boolean
  user?: User
  profile?: UserProfile
  error?: string
}

/**
 * OTP verification response
 */
export interface OTPVerificationResponse {
  success: boolean
  sessionToken?: string
  user?: User
  redirectTo: '/onboarding' | '/jobs' | '/profile'
  error?: string
  blacklisted?: boolean
}

/**
 * Profile update response
 */
export interface ProfileUpdateResponse {
  success: boolean
  profile?: UserProfile
  error?: string
}