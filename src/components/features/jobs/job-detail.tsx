'use client'

import { useState, useEffect } from "react"
import { Job, transformDbJobToUiJob } from "@/types/job"
import { ApplicationStatus } from "@/types/job-application"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2,
  Users,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  ExternalLink,
  GraduationCap,
  CheckCircle,
  Eye,
  Clock3,
  UserCheck,
  XCircle
} from "lucide-react"
import { cn, getRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useJobApplication } from "@/hooks/useJobApplication"
import { BenefitsCard } from "./benefits-card"
import { CompanyInfoCard } from "./company-info-card"
import { JobMetaCard } from "./job-meta-card"
import { ApplicationModal } from "./ApplicationModal"
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility"

interface JobDetailProps {
  jobId: string
  lang: string
}

// Note: Job data now comes from database API

export function JobDetail({ jobId, lang }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  
  const { isAuthenticated } = useAuth()
  const { checkApplicationStatus, isCheckingStatus } = useJobApplication()
  const { headerRef, getStickyContainerClasses } = useHeaderVisibility({
    dependencies: [job]
  })

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        
        // Fetch job from database API
        const response = await fetch(`/api/jobs/${jobId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setJob(null)
            setLoading(false)
            return
          }
          throw new Error('Failed to fetch job')
        }
        
        const dbJob = await response.json()
        const uiJob = transformDbJobToUiJob(dbJob)
        
        setJob(uiJob)
        setIsBookmarked(uiJob.isBookmarked || false)
        
        // Check application status if user is authenticated
        if (isAuthenticated) {
          const status = await checkApplicationStatus(parseInt(jobId))
          setApplicationStatus(status)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId, isAuthenticated, checkApplicationStatus])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      // Redirect to login - you can customize this based on your auth flow
      window.location.href = `/${lang}/verify-otp`
      return
    }
    
    if (applicationStatus === null) {
      setIsApplicationModalOpen(true)
    }
  }

  const handleApplicationSuccess = () => {
    // Refresh application status after successful submission
    if (isAuthenticated) {
      checkApplicationStatus(parseInt(jobId)).then(setApplicationStatus)
    }
  }

  const getApplicationButtonContent = () => {
    if (!isAuthenticated) {
      return {
        text: 'Apply Now',
        icon: null,
        variant: 'default' as const,
        disabled: false,
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }
    }

    if (isCheckingStatus) {
      return {
        text: 'Checking...',
        icon: <Clock3 className="w-4 h-4 mr-2" />,
        variant: 'outline' as const,
        disabled: true,
        className: ''
      }
    }

    switch (applicationStatus) {
      case 'pending':
        return {
          text: 'Applied - Pending',
          icon: <Clock3 className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
        }
      case 'reviewing':
        return {
          text: 'Under Review',
          icon: <Eye className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
        }
      case 'interviewed':
        return {
          text: 'Interviewed',
          icon: <UserCheck className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20'
        }
      case 'accepted':
        return {
          text: 'Congratulations!',
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
        }
      case 'rejected':
        return {
          text: 'Not Selected',
          icon: <XCircle className="w-4 h-4 mr-2" />,
          variant: 'outline' as const,
          disabled: true,
          className: 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
        }
      default:
        return {
          text: 'Apply Now',
          icon: null,
          variant: 'default' as const,
          disabled: false,
          className: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }
    }
  }

  const formatSalary = (salaryMin?: number, salaryMax?: number) => {
    if (!salaryMin && !salaryMax) return 'Salary not specified'
    if (salaryMin && salaryMax) {
      return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`
    }
    if (salaryMin) return `From $${salaryMin.toLocaleString()}`
    if (salaryMax) return `Up to $${salaryMax.toLocaleString()}`
    return 'Salary not specified'
  }

  const getRecruitTypeBadge = (type?: 'campus' | 'social') => {
    if (!type) return null
    
    const styles = {
      campus: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      social: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    }
    
    const labels = {
      campus: 'Campus Recruitment',
      social: 'Social Recruitment'
    }

    return (
      <Badge className={cn("text-sm", styles[type])}>
        {type === 'campus' && <GraduationCap className="w-3 h-3 mr-1" />}
        {labels[type]}
      </Badge>
    )
  }

  const getEmploymentTypeBadge = (type?: Job['employment_type']) => {
    if (!type) return null
    
    const colors = {
      'full-time': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
      'part-time': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'contract': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
    }
    return (
      <Badge className={cn("text-sm", colors[type])}>
        {type.replace('-', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Job Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Link href={`/${lang}/jobs`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href={`/${lang}/jobs`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      {/* Enhanced Job Header */}
      <Card ref={headerRef}>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-emerald-600 dark:text-emerald-300 text-xl font-semibold">
                {job.company?.name?.substring(0, 2).toUpperCase() || job.companyName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                      {job.company?.name || job.companyName}
                    </p>
                    {job.company?.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(job.company!.website, '_blank')}
                        className="p-1 h-auto"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-emerald-600" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className="text-gray-400 hover:text-emerald-600"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </Button>
                  <Button 
                    variant={getApplicationButtonContent().variant}
                    className={getApplicationButtonContent().className}
                    onClick={handleApplyClick}
                    disabled={getApplicationButtonContent().disabled}
                  >
                    {getApplicationButtonContent().icon}
                    {getApplicationButtonContent().text}
                  </Button>
                </div>
              </div>
              
              {/* Job Details Row */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Posted {getRelativeTime(job.posted_date)}</span>
                </div>
                {job.applicationCount && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{job.applicationCount} applicants</span>
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {getEmploymentTypeBadge(job.employment_type)}
                {getRecruitTypeBadge(job.recruit_type)}
                {job.isRemote && (
                  <Badge className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    Remote
                  </Badge>
                )}
                <Badge variant="outline" className="text-sm">
                  {job.experienceLevel} level
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {job.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {job.description}
                </p>
              </div>
              
              {job.requirements && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements</h4>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {job.requirements.split(',').map((req, index) => (
                      <div key={index} className="flex items-start gap-2 mb-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{req.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {job.attributes?.additional_info && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Information</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {job.attributes.additional_info}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Technologies */}
          {job.attributes?.skill_tags && job.attributes.skill_tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.attributes.skill_tags.map((skill) => (
                    <Badge key={skill} variant="secondary" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Info Card */}
          {job.company && (
            <CompanyInfoCard company={job.company} />
          )}

          {/* Benefits & Perks */}
          {job.company?.benefits && job.company.benefits.length > 0 && (
            <BenefitsCard benefits={job.company.benefits} />
          )}
        </div>

        {/* Right Column - Company & Meta Info (1/3 width) */}
        <div className={getStickyContainerClasses(
          "space-y-6",
          "fixed top-6 right-[calc(50vw-655px)] w-97 z-10"
        )}>

          {/* Job Meta Information - Sticky */}
          <div className="sticky top-6">
            <JobMetaCard 
              jobTitle={job.title}
              companyName={job.company?.name || job.companyName}
              companyLogo={job.companyLogo}
              salaryMin={job.salary_min}
              salaryMax={job.salary_max}
              location={job.location || 'Location not specified'}
              employmentType={job.employment_type}
              postedDate={job.posted_date}
            />
          </div>
        </div>
      </div>

      {/* Application Deadline Warning */}
      {job.applicationDeadline && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Modal */}
      {job && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          jobId={parseInt(jobId)}
          jobTitle={job.title}
          companyName={job.company?.name || job.companyName}
          location={job.location}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
}