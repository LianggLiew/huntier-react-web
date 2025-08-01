import Link from "next/link"
import Image from "next/image"
import { MapPin, Sparkles, Clock, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getRelativeTime } from "@/lib/utils"
import { ApplicationButton } from "./ApplicationButton"
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
  const locationText = job.isRemote 
    ? `Remote${job.location !== "Remote" ? ` - ${job.location}` : ""}`
    : job.isHybrid 
    ? `Hybrid - ${job.location}` 
    : job.location
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Competitive"
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
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
    <Link href={`/${lang}/jobs/${job.job_id}`} className="block">
        <Card className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900/70 ${delayClass} cursor-pointer`}>
        <CardContent className="p-5 sm:p-6 relative">
        {/* Application Status Badge - Top Right */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <ApplicationButton 
            jobId={job.job_id} 
            lang={lang} 
            variant="badge"
            size="sm"
          />
          {/* Save/Bookmark button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-emerald-600 opacity-80 hover:opacity-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            onClick={(e) => e.preventDefault()}
          >
            <Bookmark className="h-[18px] w-[18px]" />
            <span className="sr-only">Save job</span>
          </Button>
        </div>
        
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="hidden sm:flex h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/30 flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-300 text-lg font-semibold shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            {job.companyName?.substring(0, 2).toUpperCase() || 'CO'}
          </div>
          
          <div className="flex-1">
            {/* Job Title & Company */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                </div>
                <div className="text-muted-foreground font-medium">{job.companyName}</div>
              </div>
            </div>
            
            {/* Job Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{locationText}</span>
              </div>
              <div className="font-medium text-emerald-600 dark:text-emerald-400">
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{getRelativeTime(job.posted_date)}</span>
              </div>
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
  )
}
