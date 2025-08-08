/**
 * SAVED JOBS SYSTEM TYPES
 * ========================
 * Types for saved jobs functionality, bookmarking, and user job collections
 */

/**
 * Saved job sort options
 */
export type SavedJobSortBy = 'saved_at' | 'title' | 'company'
export type SortOrder = 'asc' | 'desc'

/**
 * Company information for saved jobs
 */
export interface SavedJobCompany {
  id: number
  name: string
  logoUrl?: string
  description?: string
  industry?: string  // Maps to 'niche' in database
  location?: string  // Maps to 'address' in database
}

/**
 * Job details for saved jobs
 */
export interface SavedJobDetails {
  id: number
  title: string
  location?: string
  employmentType?: 'full-time' | 'part-time' | 'contract'
  salaryMin?: number
  salaryMax?: number
  postedDate: string
  expiresAt?: string
  status: 'active' | 'inactive' | 'expired'
  description?: string
  requirements?: string
  benefits?: string
  company: SavedJobCompany | null
}

/**
 * Main saved job interface
 */
export interface SavedJob {
  /** Unique saved job record ID */
  id: string
  
  /** ID of the job that was saved */
  jobId: number
  
  /** When the job was saved */
  savedAt: string
  
  /** Complete job details */
  job: SavedJobDetails
}

/**
 * Saved jobs API response structure
 */
export interface SavedJobsResponse {
  savedJobs: SavedJob[]
  total: number
  hasMore: boolean
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

/**
 * Saved job bookmark status
 */
export interface SavedJobStatus {
  jobId: number
  isSaved: boolean
  savedAt?: string
}

/**
 * Options for fetching saved jobs
 */
export interface SavedJobsOptions {
  limit?: number
  offset?: number
  search?: string
  location?: string
  company?: string
  sortBy?: SavedJobSortBy
  sortOrder?: SortOrder
}

/**
 * Hook options for useSavedJobs
 */
export interface UseSavedJobsOptions {
  initialLimit?: number
  initialSortBy?: SavedJobSortBy
  initialSortOrder?: SortOrder
}

/**
 * Return type for useSavedJobs hook
 */
export interface UseSavedJobsReturn {
  /** List of saved jobs */
  savedJobs: SavedJob[]
  
  /** Loading state */
  loading: boolean
  
  /** Error message if any */
  error: string | null
  
  /** Total number of saved jobs */
  total: number
  
  /** Whether there are more jobs to load */
  hasMore: boolean
  
  /** Current search/filter options */
  currentOptions: SavedJobsOptions
  
  /** Refresh the saved jobs list */
  refresh: () => Promise<void>
  
  /** Load more saved jobs */
  loadMore: () => Promise<void>
  
  /** Save a job */
  saveJob: (jobId: number) => Promise<boolean>
  
  /** Remove a saved job */
  removeSavedJob: (jobId: number) => Promise<boolean>
  
  /** Check if a job is saved */
  isJobSaved: (jobId: number) => boolean
  
  /** Apply filters and search */
  applyFilters: (options: Partial<SavedJobsOptions>) => void
  
  /** Clear all filters */
  clearFilters: () => void
  
  /** Remove multiple saved jobs */
  removeMutipleSavedJobs: (jobIds: number[]) => Promise<number>
}

/**
 * Saved job filter options for UI
 */
export interface SavedJobFilters {
  search: string
  location: string
  company: string
  sortBy: SavedJobSortBy
  sortOrder: SortOrder
}

/**
 * Props for SavedJobCard component
 */
export interface SavedJobCardProps {
  savedJob: SavedJob
  onRemove: (jobId: number) => Promise<void>
  onApply: (jobId: number) => void
  onView: (jobId: number) => void
  isRemoving?: boolean
}

/**
 * Props for SavedJobsTab component
 */
export interface SavedJobsTabProps {
  currentUserData: any
  profile: any
  profileImage: string
  dictionary: any
  lang: string
  onPersonalInfoEdit: () => void
  onProfileImageSave: (imageData: string) => void
  onDownloadCV: () => void
  onUploadCV: () => void
}

/**
 * Bulk operations result
 */
export interface BulkOperationResult {
  successful: number
  failed: number
  errors: string[]
}

/**
 * Save job request data
 */
export interface SaveJobRequest {
  jobId: number
}

/**
 * Filter state for saved jobs
 */
export interface SavedJobFilterState {
  search: string
  location: string
  company: string
  sortBy: SavedJobSortBy
  sortOrder: SortOrder
  isFilterActive: boolean
}

/**
 * Job bookmark button props
 */
export interface JobBookmarkButtonProps {
  jobId: number
  isSaved?: boolean
  onToggle?: (jobId: number, isSaved: boolean) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'lg' | 'icon'
  showText?: boolean
  disabled?: boolean
}