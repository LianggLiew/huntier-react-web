import Link from "next/link"
import Image from "next/image"
import { MapPin, Sparkles, Clock, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type JobCardProps = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  postedDate: string
  description: string
  skills: string[]
  matchPercentage: number
  isRemote?: boolean
  isHybrid?: boolean
  animationDelay?: number
  logo?: string
  lang: string
}

export function JobCard({
  id,
  title,
  company,
  location,
  salary,
  postedDate,
  description,
  skills,
  matchPercentage,
  isRemote,
  isHybrid,
  animationDelay = 0,
  logo = "/placeholder-logo.svg",
  lang
}: JobCardProps) {
  const locationText = isRemote ? `Remote${location !== "Remote" ? ` - ${location}` : ""}` : isHybrid ? `Hybrid - ${location}` : location

  // Animation delay classes
  const delayClass =
    animationDelay === 0
      ? "animate-fade-in"
      : animationDelay === 1
        ? "animate-fade-in-delay-1"
        : animationDelay === 2
          ? "animate-fade-in-delay-2"
          : "animate-fade-in-delay-3"

  // Match percentage color indicator
  const matchColor = 
    matchPercentage >= 90 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-900/40" :
    matchPercentage >= 80 ? "text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-900/40" :
    "text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/40";

  return (
    <Card className={`hover:shadow-lg transition-all group bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900/70 ${delayClass}`}>
      <CardContent className="p-5 sm:p-6 relative">
        {/* Save/Bookmark button */}
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8 rounded-full text-muted-foreground hover:text-emerald-600 opacity-80 hover:opacity-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
          <Bookmark className="h-[18px] w-[18px]" />
          <span className="sr-only">Save job</span>
        </Button>
        
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="hidden sm:flex h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/30 flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-300 text-lg font-semibold shadow-sm">
            {company?.substring(0, 2).toUpperCase() || 'CO'}
          </div>
          
          <div className="flex-1">
            {/* Job Title & Match */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    <Link href={`/${lang}/job/${id}`} className="hover:underline hover:underline-offset-4">{title}</Link>
                  </h3>
                </div>
                <div className="text-muted-foreground font-medium">{company}</div>
              </div>
              
              <Badge className={`${matchColor} rounded-lg h-7 px-2 flex items-center gap-1 self-start shadow-sm`}>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-medium">{matchPercentage}% Match</span>
              </Badge>
            </div>
            
            {/* Job Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{locationText}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{postedDate?.replace('Posted ', '') || postedDate || 'Recently'}</span>
              </div>
              <div className="font-medium text-emerald-600 dark:text-emerald-400">{salary}</div>
            </div>
            
            {/* Job Description */}
            <div className="mt-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
            
            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(skills || []).slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="bg-white/70 dark:bg-gray-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors border-emerald-100 dark:border-emerald-900/30">
                  {skill}
                </Badge>
              ))}
              {(skills || []).length > 4 && (
                <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/30 text-muted-foreground border-emerald-100/50 dark:border-emerald-900/20">
                  +{(skills || []).length - 4} more
                </Badge>
              )}
            </div>
            
            {/* Actions */}
            <div className="mt-5 flex justify-between items-center">
              <Link 
                href={`/${lang}/job/${id}`} 
                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline hover:underline-offset-4"
              >
                View details
              </Link>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                size="sm"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
