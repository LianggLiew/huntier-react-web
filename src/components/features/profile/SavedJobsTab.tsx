'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Trash2, 
  Filter,
  Briefcase,
  Search,
  SortAsc,
  SortDesc,
  RefreshCw,
  Bookmark,
  DollarSign,
  Building2,
  Clock
} from 'lucide-react'
import { ProfileSidebar } from './ProfileSidebar'
import { getFullName } from '@/utils/profileUtils'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { SavedJobsTabProps, SavedJob, SavedJobSortBy, SortOrder } from '@/types/saved-job'
import { cn, getRelativeTime, formatCurrency } from '@/lib/utils'

const getSortOptions = (dictionary: any) => [
  { value: 'saved_at' as SavedJobSortBy, label: dictionary?.profile?.savedJobs?.sort?.dateSaved || 'Date Saved' },
  { value: 'title' as SavedJobSortBy, label: dictionary?.profile?.savedJobs?.sort?.jobTitle || 'Job Title' },
  { value: 'company' as SavedJobSortBy, label: dictionary?.profile?.savedJobs?.sort?.companyName || 'Company Name' }
]

export function SavedJobsTab({
  currentUserData,
  profile,
  profileImage,
  dictionary,
  lang,
  onPersonalInfoEdit,
  onProfileImageSave,
  onDownloadCV,
  onUploadCV,
}: SavedJobsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SavedJobSortBy>('saved_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set())
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  
  const {
    savedJobs,
    loading,
    error,
    total,
    hasMore,
    refresh,
    loadMore,
    removeSavedJob,
    applyFilters,
    clearFilters,
    removeMutipleSavedJobs
  } = useSavedJobs({ initialLimit: 10 })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters({ search: value })
  }

  const handleSortChange = (newSortBy: SavedJobSortBy) => {
    setSortBy(newSortBy)
    applyFilters({ sortBy: newSortBy, sortOrder })
  }

  const handleSortOrderToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    applyFilters({ sortBy, sortOrder: newSortOrder })
  }

  const handleRemoveSavedJob = async (jobId: number, jobTitle?: string) => {
    const confirmMessage = dictionary?.profile?.savedJobs?.confirmRemove?.replace('{jobTitle}', jobTitle || 'this job') || 'Are you sure you want to remove this job from your saved list?'
    if (confirm(confirmMessage)) {
      await removeSavedJob(jobId)
      setSelectedJobs(prev => {
        const newSet = new Set(prev)
        newSet.delete(jobId)
        return newSet
      })
    }
  }

  const handleSelectJob = (jobId: number, selected: boolean) => {
    setSelectedJobs(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(jobId)
      } else {
        newSet.delete(jobId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedJobs.size === savedJobs.length) {
      setSelectedJobs(new Set())
    } else {
      setSelectedJobs(new Set(savedJobs.map(job => job.jobId)))
    }
  }

  const handleBulkRemove = async () => {
    if (selectedJobs.size === 0) return
    
    const jobIds = Array.from(selectedJobs)
    const confirmMessage = `Are you sure you want to remove ${jobIds.length} job${jobIds.length === 1 ? '' : 's'} from your saved list?`
    
    if (confirm(confirmMessage)) {
      await removeMutipleSavedJobs(jobIds)
      setSelectedJobs(new Set())
    }
  }

  const handleViewJob = (jobId: number) => {
    // Navigate to job details page
    window.open(`/${lang}/jobs/${jobId}`, '_blank')
  }

  const handleApplyToJob = (jobId: number) => {
    // Navigate to job application
    window.open(`/${lang}/jobs/${jobId}`, '_blank')
  }

  const formatSalaryRange = (salaryMin?: number, salaryMax?: number) => {
    if (!salaryMin && !salaryMax) return null
    
    if (salaryMin && salaryMax) {
      return `${formatCurrency(salaryMin)} - ${formatCurrency(salaryMax)}`
    } else if (salaryMin) {
      return `From ${formatCurrency(salaryMin)}`
    } else if (salaryMax) {
      return `Up to ${formatCurrency(salaryMax)}`
    }
    return null
  }

  const getJobStatusBadge = (job: SavedJob) => {
    const now = new Date()
    const expiresAt = job.job.expiresAt ? new Date(job.job.expiresAt) : null
    
    if (job.job.status !== 'active') {
      return (
        <Badge variant="secondary" className="text-xs">
          Inactive
        </Badge>
      )
    }
    
    if (expiresAt && expiresAt < now) {
      return (
        <Badge variant="destructive" className="text-xs">
          Expired
        </Badge>
      )
    }
    
    return (
      <Badge className="bg-emerald-600 text-white text-xs">
        Active
      </Badge>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <ProfileSidebar
        name={getFullName(currentUserData.firstName, currentUserData.lastName)}
        title={currentUserData.title}
        location={currentUserData.location}
        nationality={profile?.nationality}
        dateOfBirth={profile?.dateOfBirth}
        education={profile?.highestDegree}
        major={profile?.major}
        profileImage={profile?.avatarUrl || (profile?.avatarUrl === null ? '' : profileImage)}
        profileCompletion={currentUserData.profileCompletion}
        completionItems={currentUserData.completionItems}
        jobPreferences={currentUserData.jobPreferences}
        onEditClick={onPersonalInfoEdit}
        onProfileImageSave={onProfileImageSave}
        onDownloadCV={onDownloadCV}
        onUploadCV={onUploadCV}
        hasResume={!!profile?.resumeFileUrl}
        dictionary={dictionary}
      />

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Tab Bar */}
        <div className="flex justify-start mb-6">
          <TabsList className="bg-gray-900 p-1 border border-gray-800">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400"
            >
              {dictionary.profile.tabs.profile}
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400"
            >
              {dictionary.profile.tabs.applications}
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400"
            >
              {dictionary.profile.tabs.savedJobs}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {dictionary?.profile?.savedJobs?.title || 'Saved Jobs'}
            </h2>
            <p className="text-gray-400">
              {total > 0 ? 
                dictionary?.profile?.savedJobs?.jobCount?.replace('{count}', total.toString())?.replace('{plural}', total === 1 ? '' : 's') || `${total} saved job${total === 1 ? '' : 's'} found`
                : dictionary?.profile?.savedJobs?.empty?.noSavedJobs || 'No saved jobs yet'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {/* <Button 
              onClick={() => setIsFiltersVisible(!isFiltersVisible)} 
              variant="outline" 
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" /> 
              {dictionary?.profile?.savedJobs?.actions?.filters || 'Filters'}
            </Button> */}
            <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              {dictionary?.profile?.savedJobs?.actions?.refresh || 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        {isFiltersVisible && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={dictionary?.profile?.savedJobs?.search?.placeholder || "Search jobs or companies..."}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={dictionary?.profile?.savedJobs?.sort?.sortBy || "Sort by"} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {getSortOptions(dictionary).map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSortOrderToggle}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {selectedJobs.size > 0 && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-white">
                  {dictionary?.profile?.savedJobs?.selectedCount?.replace('{count}', selectedJobs.size.toString())?.replace('{plural}', selectedJobs.size === 1 ? '' : 's') || `${selectedJobs.size} job${selectedJobs.size === 1 ? '' : 's'} selected`}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {selectedJobs.size === savedJobs.length ? 
                      dictionary?.profile?.savedJobs?.actions?.deselectAll || 'Deselect All' : 
                      dictionary?.profile?.savedJobs?.actions?.selectAll || 'Select All'
                    }
                  </Button>
                  <Button
                    onClick={handleBulkRemove}
                    variant="outline"
                    size="sm"
                    className="border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {dictionary?.profile?.savedJobs?.actions?.removeSelected || 'Remove Selected'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-800 mb-6">
            <CardContent className="p-4">
              <p className="text-red-400">{error}</p>
              <Button onClick={refresh} variant="outline" size="sm" className="mt-2">
                {dictionary?.profile?.savedJobs?.actions?.tryAgain || 'Try Again'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && savedJobs.length === 0 && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 mb-2 bg-gray-800" />
                      <Skeleton className="h-4 w-32 mb-2 bg-gray-800" />
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                    </div>
                    <Skeleton className="h-6 w-20 bg-gray-800" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24 bg-gray-800" />
                    <Skeleton className="h-8 w-20 bg-gray-800" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && savedJobs.length === 0 && !error && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {dictionary?.profile?.savedJobs?.empty?.noSavedJobs || 'No Saved Jobs Yet'}
              </h3>
              <p className="text-gray-400 mb-4">
                {dictionary?.profile?.savedJobs?.empty?.noSavedJobsDescription || 'You haven\'t saved any jobs yet. Start exploring opportunities and save the ones you\'re interested in!'}
              </p>
              <Button   
                variant="outline" 
                onClick={() => window.open(`/${lang}/jobs`, '_blank')}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                {dictionary?.profile?.savedJobs?.actions?.browseJobs || 'Browse Jobs'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Saved Jobs List */}
        {savedJobs.length > 0 && (
          <div className="space-y-4">
            {savedJobs.map((savedJob) => (
              <Card key={savedJob.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(savedJob.jobId)}
                      onChange={(e) => handleSelectJob(savedJob.jobId, e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-600 focus:ring-emerald-600"
                    />
                    
                    {/* Job Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {savedJob.job.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{savedJob.job.company?.name || dictionary?.profile?.applications?.unknownCompany || 'Unknown Company'}</span>
                            </div>
                            {savedJob.job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{savedJob.job.location}</span>
                              </div>
                            )}
                            {savedJob.job.employmentType && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                <span>{savedJob.job.employmentType.replace('-', ' ')}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Saved {getRelativeTime(savedJob.savedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Posted {getRelativeTime(savedJob.job.postedDate)}</span>
                            </div>
                            {formatSalaryRange(savedJob.job.salaryMin, savedJob.job.salaryMax) && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatSalaryRange(savedJob.job.salaryMin, savedJob.job.salaryMax)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {getJobStatusBadge(savedJob)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          onClick={() => handleViewJob(savedJob.jobId)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {dictionary?.profile?.savedJobs?.actions?.viewJob || 'View Details'}
                        </Button>
                        
                        {savedJob.job.status === 'active' && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleApplyToJob(savedJob.jobId)}
                          >
                            {dictionary?.profile?.savedJobs?.actions?.applyNow || 'Apply Now'}
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-700 text-red-400 hover:bg-red-900/20 ml-auto"
                          onClick={() => handleRemoveSavedJob(savedJob.jobId, savedJob.job.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {dictionary?.profile?.savedJobs?.actions?.remove || 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-6">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  disabled={loading}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {loading ? dictionary?.profile?.savedJobs?.loading || 'Loading...' : dictionary?.profile?.savedJobs?.actions?.loadMore || 'Load More Jobs'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}