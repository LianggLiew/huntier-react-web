'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSimpleNavigation } from '@/hooks/useNavigation'
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Trash2, 
  Filter,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react'
import { ProfileSidebar } from './ProfileSidebar'
import { getFullName } from '@/utils/profileUtils'
import { useApplications } from '@/hooks/useApplications'
import { ApplicationStatus } from '@/types/job-application'
import { getStatusColor, getStatusIcon } from '../jobs/ApplicationButton'
import { ApplicationDetailModal } from '../jobs/ApplicationDetailModal'
import { cn, getRelativeTime } from '@/lib/utils'

interface ApplicationsTabRealProps {
  currentUserData: any
  profile: any
  profileImage: string
  dictionary: any
  params: { lang: string }
  onPersonalInfoEdit: () => void
  onProfileImageSave: (imageData: string) => void
  onDownloadCV: () => void
  onUploadCV: () => void
}

const getStatusFilters = (dictionary: any) => [
  { value: null, label: dictionary?.profile?.applications?.filters?.allApplications || 'All Applications', icon: Briefcase },
  { value: 'pending' as ApplicationStatus, label: dictionary?.profile?.applications?.filters?.pending || 'Pending', icon: Clock },
  { value: 'reviewing' as ApplicationStatus, label: dictionary?.profile?.applications?.filters?.underReview || 'Under Review', icon: Eye },
  { value: 'interviewed' as ApplicationStatus, label: dictionary?.profile?.applications?.filters?.interviewed || 'Interviewed', icon: Users },
  { value: 'accepted' as ApplicationStatus, label: dictionary?.profile?.applications?.filters?.accepted || 'Accepted', icon: CheckCircle },
  { value: 'rejected' as ApplicationStatus, label: dictionary?.profile?.applications?.filters?.rejected || 'Rejected', icon: XCircle }
]

export function ApplicationsTabReal({
  currentUserData,
  profile,
  profileImage,
  dictionary,
  params,
  onPersonalInfoEdit,
  onProfileImageSave,
  onDownloadCV,
  onUploadCV,
}: ApplicationsTabRealProps) {
  const { push } = useSimpleNavigation(params)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const {
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
  } = useApplications({ initialLimit: 10 })

  const handleWithdraw = async (applicationId: string, jobTitle: string) => {
    const confirmMessage = dictionary?.profile?.applications?.confirmWithdraw?.replace('{jobTitle}', jobTitle) || `Are you sure you want to withdraw your application for "${jobTitle}"?`
    if (confirm(confirmMessage)) {
      await withdrawApplication(applicationId)
    }
  }

  const handleViewDetails = (applicationId: string) => {
    setSelectedApplicationId(applicationId)
    setIsDetailModalOpen(true)
  }

  const handleModalClose = () => {
    setIsDetailModalOpen(false)
    setSelectedApplicationId(null)
  }

  const formatApplicationDate = (dateString: string) => {
    return getRelativeTime(dateString)
  }

  const getStatusText = (status: ApplicationStatus) => {
    const statusTranslations = {
      'pending': dictionary?.profile?.applicationStatus?.pending || 'Applied - Pending',
      'reviewing': dictionary?.profile?.applicationStatus?.reviewing || 'Under Review',
      'interviewed': dictionary?.profile?.applicationStatus?.interviewed || 'Interviewed',
      'accepted': dictionary?.profile?.applicationStatus?.accepted || 'Congratulations!',
      'rejected': dictionary?.profile?.applicationStatus?.rejected || 'Not Selected'
    }
    return statusTranslations[status] || status
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    const icon = getStatusIcon(status)
    const colorClass = getStatusColor(status)
    
    return (
      <Badge className={cn("text-xs flex items-center gap-1", colorClass)}>
        {icon}
        {getStatusText(status)}
      </Badge>
    )
  }

  const canWithdraw = (status: ApplicationStatus) => {
    return status === 'pending' || status === 'reviewing'
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
              {dictionary?.profile?.applications?.title || dictionary?.profile?.jobApplications || 'Job Applications'}
            </h2>
            <p className="text-gray-400">
              {total > 0 ? 
                dictionary?.profile?.applications?.applicationCount?.replace('{count}', total.toString())?.replace('{plural}', total === 1 ? '' : 's') || `${total} application${total === 1 ? '' : 's'} found`
                : dictionary?.profile?.applications?.empty?.noApplications || 'No applications yet'
              }
            </p>
          </div>
          <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            {dictionary?.profile?.savedJobs?.actions?.refresh || 'Refresh'}
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {getStatusFilters(dictionary).map((filter) => {
            const Icon = filter.icon
            const isActive = currentStatus === filter.value
            return (
              <Button
                key={filter.value || 'all'}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => filterByStatus(filter.value)}
                className={cn(
                  "text-xs",
                  isActive 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                )}
              >
                <Icon className="w-3 h-3 mr-1" />
                {filter.label}
              </Button>
            )
          })}
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-800 mb-6">
            <CardContent className="p-4">
              <p className="text-red-400">{error}</p>
              <Button onClick={refresh} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && applications.length === 0 && (
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

        {/* Applications List */}
        {!loading && applications.length === 0 && !error && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {dictionary?.profile?.applications?.empty?.noApplications || 'No Applications Yet'}
              </h3>
              <p className="text-gray-400 mb-4">
                {currentStatus 
                  ? dictionary?.profile?.applications?.empty?.noFilteredApplications || `No ${currentStatus} applications found. Try a different filter.`
                  : dictionary?.profile?.applications?.empty?.noApplications || "You haven't applied to any jobs yet. Start exploring opportunities!"
                }
              </p>
              <Button variant="outline" onClick={() => currentStatus ? filterByStatus(null) : push('/jobs')}>
                {currentStatus ? 
                  dictionary?.profile?.applications?.actions?.showAll || 'Show All Applications' : 
                  dictionary?.profile?.applications?.actions?.browseJobs || 'Browse Jobs'
                }
              </Button>
            </CardContent>
          </Card>
        )}

        {applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {application.job?.title || dictionary?.profile?.applications?.jobTitleNotAvailable || 'Job Title Not Available'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{application.job?.company.name || dictionary?.profile?.applications?.unknownCompany || 'Unknown Company'}</span>
                        </div>
                        {application.job?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{application.job.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{dictionary?.profile?.applicationStatus?.applied || 'Applied'} {formatApplicationDate(application.appliedAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => handleViewDetails(application.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {dictionary?.profile?.applications?.actions?.viewDetails || 'View Details'}
                    </Button>
                    
                    {canWithdraw(application.status) && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-700 text-red-400 hover:bg-red-900/20"
                        onClick={() => handleWithdraw(application.id, application.job?.title || 'this job')}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {dictionary?.profile?.applications?.actions?.withdraw || 'Withdraw'}
                      </Button>
                    )}
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
                  {loading ? dictionary?.profile?.applications?.loading || 'Loading...' : dictionary?.profile?.applications?.actions?.loadMore || 'Load More Applications'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Application Detail Modal */}
        <ApplicationDetailModal
          applicationId={selectedApplicationId}
          open={isDetailModalOpen}
          onOpenChange={handleModalClose}
          onApplicationUpdated={refresh}
          onApplicationWithdrawn={refresh}
        />
      </div>
    </div>
  )
}