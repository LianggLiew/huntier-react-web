'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { JobBookmarkButtonProps } from '@/types/saved-job'
import { ApiResponse } from '@/types/api'
import { cn } from '@/lib/utils'

export function JobBookmarkButton({
  jobId,
  isSaved: initialIsSaved = false,
  onToggle,
  variant = 'outline',
  size = 'sm',
  showText = false,
  disabled = false
}: JobBookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Check if job is saved on mount
  useEffect(() => {
    if (isAuthenticated && !initialIsSaved) {
      checkSavedStatus()
    }
  }, [isAuthenticated, jobId, initialIsSaved])

  const checkSavedStatus = async () => {
    if (!isAuthenticated) return

    setIsCheckingStatus(true)
    try {
      const response = await fetch(`/api/saved-jobs/${jobId}`, {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<{ jobId: number; isSaved: boolean; savedAt: string | null }> = await response.json()

      if (response.ok && result.success && result.data) {
        setIsSaved(result.data.isSaved)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to save jobs',
        variant: 'destructive'
      })
      return
    }

    if (isLoading || disabled) return

    setIsLoading(true)

    try {
      let response: Response
      let newIsSaved: boolean

      if (isSaved) {
        // Remove from saved jobs
        response = await fetch(`/api/saved-jobs/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        newIsSaved = false
      } else {
        // Save job
        response = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ jobId })
        })
        newIsSaved = true
      }

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${isSaved ? 'remove' : 'save'} job`)
      }

      // Update local state
      setIsSaved(newIsSaved)

      // Call the onToggle callback if provided
      onToggle?.(jobId, newIsSaved)

      // Show success toast
      toast({
        title: newIsSaved ? 'Job Saved' : 'Job Removed',
        description: newIsSaved 
          ? 'Job has been added to your saved list.'
          : 'Job has been removed from your saved list.'
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${isSaved ? 'remove' : 'save'} job`
      console.error('Error toggling bookmark:', error)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isProcessing = isLoading || isCheckingStatus
  const BookmarkIcon = isSaved ? BookmarkCheck : Bookmark

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={disabled || isProcessing || !isAuthenticated}
      className={cn(
        "transition-colors",
        isSaved 
          ? "border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950" 
          : "border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500",
        !isAuthenticated && "opacity-50 cursor-not-allowed"
      )}
      title={
        !isAuthenticated 
          ? "Login to save jobs"
          : isSaved 
            ? "Remove from saved jobs" 
            : "Save job"
      }
    >
      {isProcessing ? (
        <Loader2 className={cn("animate-spin", showText ? "mr-2" : "", size === 'sm' ? "w-3 h-3" : size === 'icon' ? "w-3 h-3" : "w-4 h-4")} />
      ) : (
        <BookmarkIcon className={cn(showText ? "mr-2" : "", size === 'sm' ? "w-3 h-3" : size === 'icon' ? "w-3 h-3" : "w-4 h-4")} />
      )}
      {showText && (
        <span>
          {isProcessing 
            ? 'Loading...' 
            : isSaved 
              ? 'Saved' 
              : 'Save'
          }
        </span>
      )}
    </Button>
  )
}

// Hook version for easier state management
export function useJobBookmark(jobId: number) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Check if job is saved on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkSavedStatus()
    }
  }, [isAuthenticated, jobId])

  const checkSavedStatus = async () => {
    if (!isAuthenticated) return

    setIsCheckingStatus(true)
    try {
      const response = await fetch(`/api/saved-jobs/${jobId}`, {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<{ jobId: number; isSaved: boolean; savedAt: string | null }> = await response.json()

      if (response.ok && result.success && result.data) {
        setIsSaved(result.data.isSaved)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const toggleBookmark = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to save jobs',
        variant: 'destructive'
      })
      return false
    }

    if (isLoading) return false

    setIsLoading(true)

    try {
      let response: Response
      let newIsSaved: boolean

      if (isSaved) {
        response = await fetch(`/api/saved-jobs/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        newIsSaved = false
      } else {
        response = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ jobId })
        })
        newIsSaved = true
      }

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${isSaved ? 'remove' : 'save'} job`)
      }

      setIsSaved(newIsSaved)

      toast({
        title: newIsSaved ? 'Job Saved' : 'Job Removed',
        description: newIsSaved 
          ? 'Job has been added to your saved list.'
          : 'Job has been removed from your saved list.'
      })

      return true

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${isSaved ? 'remove' : 'save'} job`
      console.error('Error toggling bookmark:', error)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isSaved,
    isLoading,
    isCheckingStatus,
    toggleBookmark,
    refreshStatus: checkSavedStatus
  }
}