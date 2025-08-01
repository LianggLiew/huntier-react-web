import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { 
  ApplicationSubmissionData, 
  JobApplication, 
  ApplicationStatus
} from '@/types/job-application'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

// Validation schema for application form
const ApplicationFormSchema = z.object({
  jobId: z.number(),
  coverLetter: z.string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter cannot exceed 2000 characters'),
  applicantInfo: z.object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
    phoneNumber: z.string().min(1, 'Phone number is required').max(20, 'Phone number too long'),
    nationality: z.string().max(100, 'Nationality too long').optional(),
    wechatId: z.string().max(100, 'WeChat ID too long').optional()
  }),
  customResumeUrl: z.string().url().optional()
})

interface UseJobApplicationOptions {
  onSuccess?: (application: JobApplication) => void
  onError?: (error: string) => void
  showToasts?: boolean
}

interface UseJobApplicationReturn {
  submitApplication: (data: ApplicationSubmissionData) => Promise<JobApplication | null>
  checkApplicationStatus: (jobId: number) => Promise<ApplicationStatus | null>
  isSubmitting: boolean
  isCheckingStatus: boolean
  error: string | null
  validateForm: (data: ApplicationSubmissionData) => { isValid: boolean; errors?: any }
}

export const useJobApplication = (options: UseJobApplicationOptions = {}): UseJobApplicationReturn => {
  const { onSuccess, onError, showToasts = true } = options
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = useCallback((data: ApplicationSubmissionData) => {
    const result = ApplicationFormSchema.safeParse(data)
    return {
      isValid: result.success,
      errors: result.success ? undefined : result.error.flatten()
    }
  }, [])

  const submitApplication = useCallback(async (data: ApplicationSubmissionData): Promise<JobApplication | null> => {
    if (!isAuthenticated) {
      const errorMsg = 'You must be logged in to apply for jobs'
      setError(errorMsg)
      if (showToasts) {
        toast({
          title: 'Authentication Required',
          description: errorMsg,
          variant: 'destructive'
        })
      }
      onError?.(errorMsg)
      return null
    }

    // Validate form data
    const validation = validateForm(data)
    if (!validation.isValid) {
      const errorMsg = 'Please fix the form errors before submitting'
      setError(errorMsg)
      if (showToasts) {
        toast({
          title: 'Form Validation Error',
          description: errorMsg,
          variant: 'destructive'
        })
      }
      onError?.(errorMsg)
      return null
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      const result: ApiResponse<JobApplication> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit application')
      }

      const application = result.data!

      if (showToasts) {
        toast({
          title: 'Application Submitted',
          description: `Your application for ${application.job?.title} has been submitted successfully.`
        })
      }

      onSuccess?.(application)
      return application

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application'
      setError(errorMessage)
      
      if (showToasts) {
        toast({
          title: 'Application Failed',
          description: errorMessage,
          variant: 'destructive'
        })
      }
      
      onError?.(errorMessage)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [isAuthenticated, validateForm, showToasts, toast, onSuccess, onError])

  const checkApplicationStatus = useCallback(async (jobId: number): Promise<ApplicationStatus | null> => {
    if (!isAuthenticated) {
      return null
    }

    setIsCheckingStatus(true)
    setError(null)

    try {
      const response = await fetch(`/api/applications/status/${jobId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.status === 404) {
        // No application found for this job
        return null
      }

      const result: ApiResponse<{ status: ApplicationStatus }> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to check application status')
      }

      return result.data?.status || null

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check application status'
      setError(errorMessage)
      console.error('Error checking application status:', err)
      return null
    } finally {
      setIsCheckingStatus(false)
    }
  }, [isAuthenticated])

  return {
    submitApplication,
    checkApplicationStatus,
    isSubmitting,
    isCheckingStatus,
    error,
    validateForm
  }
}