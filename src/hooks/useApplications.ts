import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { JobApplication, ApplicationStatus } from '@/types/job-application'
import { ApiResponse } from '@/types/api'

interface ApplicationsResponse {
  applications: JobApplication[]
  total: number
  hasMore: boolean
}

interface UseApplicationsOptions {
  initialLimit?: number
  status?: ApplicationStatus | null
}

interface UseApplicationsReturn {
  applications: JobApplication[]
  loading: boolean
  error: string | null
  total: number
  hasMore: boolean
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  filterByStatus: (status: ApplicationStatus | null) => void
  withdrawApplication: (applicationId: string) => Promise<boolean>
  currentStatus: ApplicationStatus | null
}

export const useApplications = (options: UseApplicationsOptions = {}): UseApplicationsReturn => {
  const { initialLimit = 10, status: initialStatus = null } = options
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus | null>(initialStatus)
  const [offset, setOffset] = useState(0)

  const fetchApplications = useCallback(async (
    newOffset: number = 0, 
    statusFilter: ApplicationStatus | null = currentStatus,
    append: boolean = false
  ) => {
    if (!isAuthenticated) {
      setApplications([])
      setTotal(0)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: initialLimit.toString(),
        offset: newOffset.toString()
      })

      if (statusFilter) {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/applications?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<ApplicationsResponse> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch applications')
      }

      const data = result.data!

      if (append) {
        setApplications(prev => [...prev, ...data.applications])
      } else {
        setApplications(data.applications)
      }
      
      setTotal(data.total)
      setHasMore(data.hasMore)
      setOffset(newOffset)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch applications'
      setError(errorMessage)
      console.error('Error fetching applications:', err)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, initialLimit, currentStatus, toast])

  const refresh = useCallback(async () => {
    await fetchApplications(0, currentStatus, false)
  }, [fetchApplications, currentStatus])

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return
    const newOffset = offset + initialLimit
    await fetchApplications(newOffset, currentStatus, true)
  }, [hasMore, loading, offset, initialLimit, fetchApplications, currentStatus])

  const filterByStatus = useCallback((status: ApplicationStatus | null) => {
    setCurrentStatus(status)
    setOffset(0)
    fetchApplications(0, status, false)
  }, [fetchApplications])

  const withdrawApplication = useCallback(async (applicationId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to withdraw applications',
        variant: 'destructive'
      })
      return false
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to withdraw application')
      }

      // Remove from local state
      setApplications(prev => prev.filter(app => app.id !== applicationId))
      setTotal(prev => prev - 1)

      toast({
        title: 'Application Withdrawn',
        description: 'Your application has been successfully withdrawn.'
      })

      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw application'
      setError(errorMessage)
      
      toast({
        title: 'Withdrawal Failed',
        description: errorMessage,
        variant: 'destructive'
      })

      return false
    }
  }, [isAuthenticated, toast])

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications(0, currentStatus, false)
    }
  }, [isAuthenticated, currentStatus, fetchApplications])

  return {
    applications,
    loading,
    error,
    total,
    hasMore,
    refresh,
    loadMore,
    filterByStatus,
    withdrawApplication,
    currentStatus
  }
}