/**
 * COMPONENT TYPE DEFINITIONS
 * ==========================
 * 
 * Props and interfaces for React components.
 */

import { User, UserProfile } from './user'

/**
 * Protected Route component props
 */
export interface ProtectedRouteProps {
  /** Child components to render if authenticated */
  children: React.ReactNode
  
  /** Whether onboarding completion is required */
  requireOnboarding?: boolean
  
  /** Custom redirect path for unauthenticated users */
  redirectTo?: string
  
  /** Loading component to show while checking auth */
  loadingComponent?: React.ComponentType
  
  /** Component to show for unauthenticated users */
  fallbackComponent?: React.ComponentType
}

/**
 * Auth Provider component props
 */
export interface AuthProviderProps {
  /** Child components */
  children: React.ReactNode
  
  /** Initial auth state (for SSR) */
  initialAuth?: {
    user: User | null
    profile: UserProfile | null
  }
}

/**
 * Workflow steps for user onboarding
 */
export type WorkflowStep =
  | 'public browsing'
  | 'job_discovery'
  | 'job_application'
  | 'registration'
  | 'verification'
  | 'onboarding'
  | 'resume_upload'
  | 'job_preferences'
  | 'profile_completion'
  | 'application_tracking'
  | 'profile_optimization'