'use client'

import { useState, useEffect } from "react"
import { Job, transformDbJobToUiJob } from "@/types/job"
import { ApplicationStatus } from "@/types/job-application"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SmartLogo, useSmartLogo } from "@/components/ui/smart-logo"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2,
  Users,
  ArrowLeft,
  ExternalLink,
  GraduationCap
} from "lucide-react"
import { cn, getRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { ApplicationButton } from "./ApplicationButton"
import { JobBookmarkButton } from "./JobBookmarkButton"
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
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [applicationRefreshTrigger, setApplicationRefreshTrigger] = useState(0)
  
  const { isAuthenticated } = useAuth()
  const { headerRef, getStickyContainerClasses } = useHeaderVisibility({
    dependencies: [job]
  })
  
  const { logoUrl, fallbackText, alt, preferDarkBackground } = useSmartLogo(
    job?.company?.logo_url || job?.companyLogo, 
    job?.company?.name || job?.companyName
  )

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
        
        // Application status is now handled by ApplicationButton component
      } catch (error) {
        console.error('Error fetching job:', error)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId, isAuthenticated])


  const handleApplyClick = () => {
    if (!isAuthenticated) {
      // Redirect to login - you can customize this based on your auth flow
      window.location.href = `/${lang}/verify-otp`
      return
    }
    
    // Open application modal
    setIsApplicationModalOpen(true)
  }

  const handleApplicationSuccess = () => {
    // Trigger ApplicationButton to refresh its status
    setApplicationRefreshTrigger(prev => prev + 1)
    setIsApplicationModalOpen(false)
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
      <Badge className={cn("text-xs lg:text-sm", styles[type])}>
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
      <Badge className={cn("text-xs lg:text-sm", colors[type])}>
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
    <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6 p-4 lg:p-0">
      {/* Back Button */}
      <Link href={`/${lang}/jobs`}>
        <Button variant="ghost" size="sm" className="mb-2 lg:mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      {/* Enhanced Job Header */}
      <Card ref={headerRef}>
        <CardContent className="p-4 lg:p-6 space-y-3 lg:space-y-4">
          {/* Container 1: Logo, Job Title, Company Name */}
          <div className="flex items-start gap-3 lg:gap-6">
            {/* Company Logo */}
            <SmartLogo
              src={logoUrl}
              alt={alt}
              fallbackText={fallbackText}
              preferDarkBackground={preferDarkBackground}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg"
              imageClassName="w-full h-full"
              containerClassName="text-base lg:text-xl"
            />
            
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-sm lg:text-xl text-gray-600 dark:text-gray-400 font-medium">
                    {job.company?.name || job.companyName}
                  </p>
                </div>
                {/* Desktop Action Buttons - top right */}
                <div className="hidden lg:flex items-center gap-3">
                  <JobBookmarkButton 
                    jobId={job.job_id}
                    variant="outline"
                    size="sm"
                    showText={false}
                  />
                  <ApplicationButton 
                    jobId={job.job_id}
                    lang={lang}
                    variant="button"
                    size="md"
                    onApplicationClick={handleApplyClick}
                    refreshTrigger={applicationRefreshTrigger}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Container 2: Location, Salary, Post Timestamp, Badges, Mobile Actions */}
          <div className="space-y-3">
            {/* Job Details Row */}
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
              <div className="flex items-center gap-1 lg:gap-2">
                <MapPin className="w-3 h-3 lg:w-5 lg:h-5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <DollarSign className="w-3 h-3 lg:w-5 lg:h-5" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <Clock className="w-3 h-3 lg:w-5 lg:h-5" />
                <span>Posted {getRelativeTime(job.posted_date)}</span>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {getEmploymentTypeBadge(job.employment_type)}
              {getRecruitTypeBadge(job.recruit_type)}
              {job.isRemote && (
                <Badge className="hidden lg:inline-flex text-xs lg:text-sm bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Remote
                </Badge>
              )}
              <Badge variant="outline" className="hidden lg:inline-flex text-xs lg:text-sm">
                {job.category}
              </Badge>
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="flex lg:hidden items-center gap-2">
              <ApplicationButton 
                jobId={job.job_id}
                lang={lang}
                variant="button"
                size="sm"
                onApplicationClick={handleApplyClick}
                refreshTrigger={applicationRefreshTrigger}
                className="flex-1"
              />
              <JobBookmarkButton 
                jobId={job.job_id}
                variant="outline"
                size="sm"
                showText={false}
                className="w-1/3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column - Job Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Job Overview */}
          <Card>
            <CardHeader className="p-4 lg:p-6 pb-2 lg:pb-6">
              <CardTitle className="text-lg lg:text-xl">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6 pt-0 lg:pt-0">
              {job.description && (
                <div>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2 lg:space-y-3 text-xs lg:text-sm">
                    {job.description.split('#').map((section, sectionIndex) => {
                      if (!section.trim()) return null;
                      
                      const allPoints = section.split(';').map(point => point.trim()).filter(point => point);
                      if (allPoints.length === 0) return null;
                      
                      return (
                        <div key={sectionIndex} className="mb-3 lg:mb-4 space-y-1 lg:space-y-2">
                          {/* Render all points in their original order */}
                          {allPoints.map((point, pointIndex) => {
                            if (point.startsWith('>>')) {
                              // Title point - larger font, no bullet
                              return (
                                <div key={pointIndex} className="flex items-start gap-2 lg:gap-3">
                                  <span className="text-blue-600 dark:text-blue-400 text-sm lg:text-base mt-0.5 flex-shrink-0">▼</span>
                                  <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                                    {point.replace(/^>>\s*/, '')}
                                  </span>
                                </div>
                              );
                            } else {
                              // Context point - normal size with bullet, slight indentation
                              return (
                                <div key={pointIndex} className="flex items-start gap-2 ml-4 lg:ml-6">
                                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-xs lg:text-sm">{point}</span>
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {job.requirements && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements</h4>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 text-xs lg:text-sm">
                    {job.requirements.split('#').map((section, sectionIndex) => {
                      if (!section.trim()) return null;
                      
                      const allPoints = section.split(';').map(point => point.trim()).filter(point => point);
                      if (allPoints.length === 0) return null;
                      
                      return (
                        <div key={sectionIndex} className="mb-4 space-y-2">
                          {/* Render all points in their original order */}
                          {allPoints.map((point, pointIndex) => {
                            if (point.startsWith('>>')) {
                              // Title point - larger font, no bullet
                              return (
                                <div key={pointIndex} className="flex items-start gap-3">
                                  <span className="text-emerald-600 dark:text-emerald-400 text-sm lg:text-base mt-0.5 flex-shrink-0">▼</span>
                                  <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                                    {point.replace(/^>>\s*/, '')}
                                  </span>
                                </div>
                              );
                            } else {
                              // Context point - normal size with bullet, slight indentation
                              return (
                                <div key={pointIndex} className="flex items-start gap-2 ml-6">
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-xs lg:text-sm">{point}</span>
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {job.attributes?.additional_info && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Information</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs lg:text-sm">
                    {job.attributes.additional_info}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Technologies */}
          {job.attributes?.skill_tags && job.attributes.skill_tags.length > 0 && (
            <Card>
              <CardHeader className="p-4 lg:p-6 pb-2 lg:pb-6">
                <CardTitle className="text-lg lg:text-xl">Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                  {job.attributes.skill_tags.map((skill) => (
                    <Badge key={skill} variant="secondary" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors text-xs lg:text-sm">
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

        {/* Right Column - Company & Meta Info (1/3 width) - Hidden on mobile */}
        <div className={cn(
          "hidden lg:block",
          getStickyContainerClasses(
            "space-y-6",
            "fixed top-6 right-[calc(50vw-655px)] w-97 z-10"
          )
        )}>

          {/* Job Meta Information - Sticky */}
          <div className="sticky top-6">
            <JobMetaCard 
              jobTitle={job.title}
              companyName={job.company?.name || job.companyName}
              companyLogo={job.company?.logo_url || job.companyLogo}
              salaryMin={job.salary_min}
              salaryMax={job.salary_max}
              location={job.location || 'Location not specified'}
              employmentType={job.employment_type}
              postedDate={job.posted_date}
              jobId={job.job_id}
              lang={lang}
              onApplicationClick={handleApplyClick}
              refreshTrigger={applicationRefreshTrigger}
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