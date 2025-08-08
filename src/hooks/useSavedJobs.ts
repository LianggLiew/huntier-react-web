import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { 
  SavedJob, 
  SavedJobsResponse, 
  SavedJobsOptions,
  UseSavedJobsOptions,
  UseSavedJobsReturn,
  SavedJobSortBy,
  SortOrder
} from '@/types/saved-job'
import { ApiResponse } from '@/types/api'

const DEFAULT_LIMIT = 10
const DEFAULT_SORT_BY: SavedJobSortBy = 'saved_at'
const DEFAULT_SORT_ORDER: SortOrder = 'desc'

export const useSavedJobs = (options: UseSavedJobsOptions = {}): UseSavedJobsReturn => {
  const { 
    initialLimit = DEFAULT_LIMIT,
    initialSortBy = DEFAULT_SORT_BY,
    initialSortOrder = DEFAULT_SORT_ORDER
  } = options
  
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  
  const [currentOptions, setCurrentOptions] = useState<SavedJobsOptions>({
    limit: initialLimit,
    offset: 0,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  })

  const fetchSavedJobs = useCallback(async (
    newOffset: number = 0,
    options: Partial<SavedJobsOptions> = {},
    append: boolean = false
  ) => {
    if (!isAuthenticated) {
      setSavedJobs([])
      setTotal(0)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: (options.limit || currentOptions.limit || initialLimit).toString(),
        offset: newOffset.toString()
      })

      // Add filter parameters
      if (options.search || currentOptions.search) {
        params.append('search', options.search || currentOptions.search || '')
      }
      
      if (options.location || currentOptions.location) {
        params.append('location', options.location || currentOptions.location || '')
      }
      
      if (options.company || currentOptions.company) {
        params.append('company', options.company || currentOptions.company || '')
      }
      
      if (options.sortBy || currentOptions.sortBy) {
        params.append('sortBy', options.sortBy || currentOptions.sortBy || DEFAULT_SORT_BY)
      }
      
      if (options.sortOrder || currentOptions.sortOrder) {
        params.append('sortOrder', options.sortOrder || currentOptions.sortOrder || DEFAULT_SORT_ORDER)
      }

      const response = await fetch(`/api/saved-jobs?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<SavedJobsResponse> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch saved jobs')
      }

      const data = result.data!

      if (append) {
        setSavedJobs(prev => [...prev, ...data.savedJobs])
      } else {
        setSavedJobs(data.savedJobs)
      }
      
      setTotal(data.total)
      setHasMore(data.hasMore)
      setOffset(newOffset)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch saved jobs'
      setError(errorMessage)
      console.error('Error fetching saved jobs:', err)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, currentOptions, initialLimit, toast])

  const refresh = useCallback(async () => {
    await fetchSavedJobs(0, currentOptions, false)
  }, [fetchSavedJobs, currentOptions])

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return
    const newOffset = offset + (currentOptions.limit || initialLimit)
    await fetchSavedJobs(newOffset, currentOptions, true)
  }, [hasMore, loading, offset, currentOptions, initialLimit, fetchSavedJobs])

  const applyFilters = useCallback((newOptions: Partial<SavedJobsOptions>) => {
    const updatedOptions = { ...currentOptions, ...newOptions, offset: 0 }
    setCurrentOptions(updatedOptions)
    setOffset(0)
    fetchSavedJobs(0, updatedOptions, false)
  }, [currentOptions, fetchSavedJobs])

  const clearFilters = useCallback(() => {
    const clearedOptions = {
      limit: initialLimit,
      offset: 0,
      sortBy: initialSortBy,
      sortOrder: initialSortOrder
    }
    setCurrentOptions(clearedOptions)
    setOffset(0)
    fetchSavedJobs(0, clearedOptions, false)
  }, [initialLimit, initialSortBy, initialSortOrder, fetchSavedJobs])

  const saveJob = useCallback(async (jobId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to save jobs',
        variant: 'destructive'
      })
      return false
    }

    try {
      const response = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ jobId })
      })

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save job')
      }

      // Refresh the saved jobs list to include the new one
      await refresh()

      toast({
        title: 'Job Saved',
        description: 'Job has been added to your saved list.'
      })

      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save job'
      setError(errorMessage)
      
      toast({
        title: 'Save Failed',
        description: errorMessage,
        variant: 'destructive'
      })

      return false
    }
  }, [isAuthenticated, toast, refresh])

  const removeSavedJob = useCallback(async (jobId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to remove saved jobs',
        variant: 'destructive'
      })
      return false
    }

    try {
      const response = await fetch(`/api/saved-jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to remove saved job')
      }

      // Remove from local state immediately for better UX
      setSavedJobs(prev => prev.filter(savedJob => savedJob.jobId !== jobId))
      setTotal(prev => prev - 1)

      toast({
        title: 'Job Removed',
        description: 'Job has been removed from your saved list.'
      })

      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove saved job'
      setError(errorMessage)
      
      toast({
        title: 'Removal Failed',
        description: errorMessage,
        variant: 'destructive'
      })

      return false
    }
  }, [isAuthenticated, toast])

  const isJobSaved = useCallback((jobId: number): boolean => {
    return savedJobs.some(savedJob => savedJob.jobId === jobId)
  }, [savedJobs])

  const removeMutipleSavedJobs = useCallback(async (jobIds: number[]): Promise<number> => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to remove saved jobs',
        variant: 'destructive'
      })
      return 0
    }

    let successCount = 0
    const errors: string[] = []

    // Process removals in parallel but limit concurrency
    const batchSize = 3
    for (let i = 0; i < jobIds.length; i += batchSize) {
      const batch = jobIds.slice(i, i + batchSize)
      
      const promises = batch.map(async (jobId) => {
        try {
          const response = await fetch(`/api/saved-jobs/${jobId}`, {
            method: 'DELETE',
            credentials: 'include'
          })

          const result: ApiResponse = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || 'Failed to remove saved job')
          }

          return { success: true, jobId }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          errors.push(`Job ${jobId}: ${errorMessage}`)
          return { success: false, jobId }
        }
      })

      const results = await Promise.all(promises)
      
      // Update local state for successful removals
      const successfulJobIds = results
        .filter(result => result.success)
        .map(result => result.jobId)
      
      if (successfulJobIds.length > 0) {
        setSavedJobs(prev => prev.filter(savedJob => !successfulJobIds.includes(savedJob.jobId)))
        setTotal(prev => prev - successfulJobIds.length)
        successCount += successfulJobIds.length
      }
    }

    // Show result toast
    if (successCount > 0) {
      toast({
        title: 'Bulk Removal Complete',
        description: `Successfully removed ${successCount} of ${jobIds.length} jobs.`,
        variant: errors.length > 0 ? 'destructive' : 'default'
      })
    }

    if (errors.length > 0) {
      console.error('Bulk removal errors:', errors)
    }

    return successCount
  }, [isAuthenticated, toast])

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedJobs(0, currentOptions, false)
    }
  }, [isAuthenticated, fetchSavedJobs, currentOptions])

  return {
    savedJobs,
    loading,
    error,
    total,
    hasMore,
    currentOptions,
    refresh,
    loadMore,
    saveJob,
    removeSavedJob,
    isJobSaved,
    applyFilters,
    clearFilters,
    removeMutipleSavedJobs
  }
}