import Link from "next/link"
import { MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SmartLogo, useSmartLogo } from "@/components/ui/smart-logo"
import { getRelativeTime } from "@/lib/utils"
import { ApplicationButton } from "./ApplicationButton"
import { JobBookmarkButton } from "./JobBookmarkButton"
import { Job } from "@/types/job"

type JobCardProps = {
  job: Job
  animationDelay?: number
  lang: string
}

export function JobCard({
  job,
  animationDelay = 0,
  lang
}: JobCardProps) {
  const { logoUrl, fallbackText, alt, preferDarkBackground } = useSmartLogo(
    job.company?.logo_url || job.companyLogo, 
    job.company?.name || job.companyName
  )
  
  const locationText = job.isRemote 
    ? `Remote${job.location !== "Remote" ? ` - ${job.location}` : ""}`
    : job.location?.toLowerCase().includes('hybrid')
    ? `Hybrid - ${job.location}` 
    : job.location
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return ""
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}/per month`
    if (min) return `From $${min.toLocaleString()}/per month`
    if (max) return `Up to $${max.toLocaleString()}/per month`
    return "Competitive"
  }

  // Animation delay classes
  const delayClass =
    animationDelay === 0
      ? "animate-fade-in"
      : animationDelay === 1
        ? "animate-fade-in-delay-1"
        : animationDelay === 2
          ? "animate-fade-in-delay-2"
          : "animate-fade-in-delay-3"

  return (
    <div className="relative">
      {/* Save Job Button (Bookmark) - Desktop: Top Right, Mobile: Bottom Right */}
      <div className="absolute right-4 top-4 sm:block hidden z-10">
        <JobBookmarkButton 
          jobId={job.job_id}
          variant="ghost"
          size="icon"
        />
      </div>
      
      {/* Save Job Button (Bookmark) - Mobile Only: Bottom Right */}
      <div className="absolute right-4 bottom-4 sm:hidden block z-10">
        <JobBookmarkButton 
          jobId={job.job_id}
          variant="ghost"
          size="icon"
        />
      </div>

      {/* Application Button - Always Top Right */}
      <div className="absolute right-16 top-4 z-10">
        <ApplicationButton 
          jobId={job.job_id} 
          lang={lang} 
          variant="badge"
          size="sm"
        />
      </div>
      
      <Link href={`/${lang}/jobs/${job.job_id}`} className="block">
        <Card className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900/70 ${delayClass} cursor-pointer`}>
        <CardContent className="p-5 sm:p-6 relative">
        
        <div className="flex gap-4">
          {/* Company Logo */}
          <SmartLogo
            src={logoUrl}
            alt={alt}
            fallbackText={fallbackText}
            preferDarkBackground={preferDarkBackground}
            className="flex h-10 w-10 sm:h-14 sm:w-14 rounded-full group-hover:shadow-md group-hover:scale-105 transition-all duration-300"
            imageClassName="w-full h-full rounded-full"
            containerClassName="text-sm sm:text-lg"
          />
          
          <div className="flex-1">
            {/* Job Title & Company */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 ">
                    {job.title}
                  </h3>
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">{job.companyName}</div>
              </div>
            </div>
            
            {/* Job Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground mt-1 mb-3">
              {locationText && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{locationText}</span>
                </div>
              )}
              {formatSalary(job.salary_min, job.salary_max) && (
                <div className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>
              )}
              {job.posted_date && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>posted {getRelativeTime(job.posted_date)}</span>
                </div>
              )}
            </div>
            
            
            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(job.skills || []).slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="bg-white/70 dark:bg-gray-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors border-emerald-100 dark:border-emerald-900/30">
                  {skill}
                </Badge>
              ))}
              {(job.skills || []).length > 4 && (
                <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/30 text-muted-foreground border-emerald-100/50 dark:border-emerald-900/20">
                  +{(job.skills || []).length - 4} more
                </Badge>
              )}
            </div>
            
            {/* Employment Type Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {job.employment_type && (
                <Badge variant="outline" className="text-xs">
                  {job.employment_type.replace('-', ' ')}
                </Badge>
              )}
              {job.isRemote && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  Remote
                </Badge>
              )}
              {job.location?.toLowerCase().includes('hybrid') && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                  Hybrid
                </Badge>
              )}
              {job.experienceLevel && (
                <Badge variant="outline" className="text-xs">
                  {job.experienceLevel} level
                </Badge>
              )}
            </div>
            {/* Actions */}
            
          </div>
        </div>
        </CardContent>
      </Card>
    </Link>
    </div>
  )
}
