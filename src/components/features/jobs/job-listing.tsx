'use client'

import { useState, useEffect, useMemo } from "react"
import { Job, JobFilters, transformDbJobToUiJob, JobListingResponse } from "@/types/job"
import { JobCard } from "./job-card"
import { JobFiltersPanel } from "./job-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobPagination } from "@/components/ui/pagination"
import { Loader2, SlidersHorizontal, X, Search, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility"

interface JobListingProps {
  lang: string
  headerOnly?: boolean
  contentOnly?: boolean
  filters?: JobFilters
  setFilters?: (filters: JobFilters) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  sortBy?: string
  setSortBy?: (sort: string) => void
  showFilters?: boolean
  setShowFilters?: (show: boolean) => void
  getStickyContainerClasses?: (baseClasses: string, fixedClasses: string) => string
  isMobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
}

// API function to fetch jobs
async function fetchJobs(options: {
  page?: number
  limit?: number
  search?: string
  location?: string
  employmentTypes?: string[]
  recruitType?: string
  salaryMin?: number
  salaryMax?: number
  skills?: string[]
  companyNiche?: string
}): Promise<JobListingResponse> {
  const params = new URLSearchParams()
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        params.append(key, value.join(','))
      } else {
        params.append(key, value.toString())
      }
    }
  })
  
  
  const response = await fetch(`/api/jobs?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }
  
  const data = await response.json()
  
  // Transform database jobs to UI jobs
  const transformedJobs = data.jobs.map(transformDbJobToUiJob)
  
  return {
    ...data,
    jobs: transformedJobs
  }
}

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'salary-high', label: 'Salary: High to Low' },
  { value: 'salary-low', label: 'Salary: Low to High' },
  { value: 'company', label: 'Company A-Z' }
]

export function JobListing({ 
  lang, 
  headerOnly = false, 
  contentOnly = false,
  filters: externalFilters,
  setFilters: setExternalFilters,
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery,
  sortBy: externalSortBy,
  setSortBy: setExternalSortBy,
  showFilters: externalShowFilters,
  setShowFilters: setExternalShowFilters,
  getStickyContainerClasses,
  isMobileMenuOpen,
  onToggleMobileMenu
}: JobListingProps) {
  const [jobsData, setJobsData] = useState<JobListingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6
  
  // Use external state if provided, otherwise internal state
  const [internalFilters, setInternalFilters] = useState<JobFilters>({})
  const [internalSortBy, setInternalSortBy] = useState('recent')
  const [internalShowFilters, setInternalShowFilters] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  
  const filters = externalFilters ?? internalFilters
  const setFilters = setExternalFilters ?? setInternalFilters
  const sortBy = externalSortBy ?? internalSortBy
  const setSortBy = setExternalSortBy ?? setInternalSortBy
  const showFilters = externalShowFilters ?? internalShowFilters
  const setShowFilters = setExternalShowFilters ?? setInternalShowFilters
  const searchQuery = externalSearchQuery ?? internalSearchQuery
  const setSearchQuery = setExternalSearchQuery ?? setInternalSearchQuery

  // Load jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Convert UI filters to API parameters
        const employmentTypes = filters.type && filters.type.length > 0 ? filters.type : undefined
        const salaryMin = filters.salaryRange?.min
        const salaryMax = filters.salaryRange?.max
        
        // Map category to company niche (since category is derived from company.niche)
        const companyNiche = filters.category
        
        
        const response = await fetchJobs({
          page: currentPage,
          limit: jobsPerPage,
          search: searchQuery || undefined,
          employmentTypes,
          salaryMin,
          salaryMax,
          companyNiche
        })
        
        setJobsData(response)
      } catch (err) {
        console.error('Failed to load jobs:', err)
        setError('Failed to load jobs. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    loadJobs()
  }, [currentPage, searchQuery, filters, jobsPerPage])

  // Get jobs and pagination info from API response
  const jobs = jobsData?.jobs || []
  const totalJobs = jobsData?.total || 0
  const totalPages = jobsData ? Math.ceil(jobsData.total / jobsPerPage) : 0
  const hasMore = jobsData?.hasMore || false

  // Client-side filtering for category (not yet implemented in API)
  const filteredJobs = useMemo(() => {
    let filtered = jobs
    
    // Category filter (client-side for now)
    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category)
    }
    
    // Additional client-side sorting if needed
    if (sortBy && sortBy !== 'recent') {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'salary-high':
            return (b.salary?.max || 0) - (a.salary?.max || 0)
          case 'salary-low':
            return (a.salary?.min || 0) - (b.salary?.min || 0)
          case 'company':
            return a.companyName.localeCompare(b.companyName)
          case 'relevant':
          default:
            return 0
        }
      })
    }
    
    return filtered
  }, [jobs, filters.category, sortBy])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy, searchQuery])

  const handleJobClick = (jobId: string) => {
    // Navigate to job detail page
    window.location.href = `/${lang}/jobs/${jobId}`
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery) count++
    if (filters.type && filters.type.length > 0) count++
    if (filters.category) count++
    // Only count salary range if it's been modified from defaults
    if (filters.salaryRange && (filters.salaryRange.min > 0 || filters.salaryRange.max < 200000)) count++
    return count
  }, [filters, searchQuery])

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }


  if (loading && !headerOnly && !jobsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  // Header only component for sticky header
  if (headerOnly) {
    return (
      <div className="flex flex-col gap-3">
        {/* Desktop layout - all in one row */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Filter button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilters}
            className="relative h-9 sm:h-10 px-2 sm:px-4 shrink-0"
          >
            <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline text-sm">Filters</span>
            <span className="sm:hidden text-xs">Filter</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 h-9 sm:h-10 px-2 sm:px-4 shrink-0"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline text-sm">Clear filters</span>
              <span className="sm:hidden text-xs">Clear</span>
            </Button>
          )}

          {/* Job count - hidden on small screens */}
          <p className="text-gray-600 dark:text-gray-400 text-sm shrink-0 hidden md:block">
            {totalJobs} jobs found
          </p>

          {/* Search bar - flexible width */}
          <div className="relative flex-1">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
            />
          </div>
          
          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-20 sm:w-32 lg:w-48 h-9 sm:h-10 shrink-0 text-xs sm:text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">
                    {option.label.split(':')[0].split(' ')[0]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden flex flex-col gap-3">
          {/* Top row: Hamburger button and search bar */}
          <div className="flex items-center gap-3">
            {/* Hamburger button */}
            {onToggleMobileMenu && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 shrink-0"
                onClick={onToggleMobileMenu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>
          
          {/* Bottom row: Filter and Sort buttons */}
          <div className="flex items-center gap-3">
            {/* Filter button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="relative h-10 px-4 flex-1"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <span className="text-sm">Filters</span>
              {activeFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-10 flex-1 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters button for mobile */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 h-8 px-4 self-center"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="text-sm">Clear filters</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Content only component for main scrollable area
  if (contentOnly) {
    return (
      <div className="flex relative ">
        {/* Desktop Filters Sidebar - Hidden on mobile */}
        <div 
          className={cn(
            "hidden lg:block transition-all duration-300 ease-in-out overflow-hidden shrink-0",
            showFilters 
              ? "w-80 opacity-100 mr-8" 
              : "w-0 opacity-0 mr-0"
          )}
        >
          <div className={getStickyContainerClasses ? 
            getStickyContainerClasses(
              "w-80",
              "fixed top-6 left-6 w-80 z-20"
            ) : 
            "w-80 sticky self-start"
          }>
            <JobFiltersPanel 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={toggleFilters}>
            <div 
              className="absolute left-0 top-20 h-full w-full max-w-sm bg-white dark:bg-gray-950 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 lg:mb-8">
                  <h2 className="text-lg lg:text-2xl font-bold">Filter Jobs</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFilters}
                    className="h-10 w-10 lg:h-12 lg:w-12 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  >
                    <X className="w-5 h-5 lg:w-6 lg:h-6" />
                  </Button>
                </div>
                <JobFiltersPanel 
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Dynamic width based on filter panel */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out flex-1 overflow-y-auto",
            showFilters ? "flex-1" : "w-full"
          )}
        >
          {/* Loading indicator for subsequent loads */}
          {loading && jobsData && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="ml-2 text-sm text-gray-600">Loading jobs...</span>
            </div>
          )}
          
          {/* Job Cards */}
          <div className="space-y-3 sm:space-y-4">
            {error ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredJobs.length === 0 && !loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No jobs found matching your criteria
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  animationDelay={index % 4}
                  lang={lang}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <JobPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    )
  }

  // Default return (shouldn't be reached)
  return null
}