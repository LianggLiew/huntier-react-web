'use client'

import { Job } from "@/types/job"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface JobCardProps {
  job: Job
  onClick?: (jobId: string) => void
}

export function JobCard({ job, onClick }: JobCardProps) {
  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return null
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`
  }

  const getTypeBadgeColor = (type: Job['type']) => {
    const colors = {
      'full-time': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
      'part-time': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'contract': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      'remote': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'
    }
    return colors[type]
  }

  const handleCardClick = () => {
    onClick?.(job.id)
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:scale-[1.01] cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          {job.companyLogo ? (
            <img 
              src={job.companyLogo} 
              alt={`${job.company} logo`}
              className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                  {job.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {job.company}
                </p>
              </div>
              
              {/* Job Type Badge */}
              <Badge className={cn("text-xs ml-3", getTypeBadgeColor(job.type))}>
                {job.type.replace('-', ' ')}
              </Badge>
            </div>
            
            {/* Job Details */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Additional Badges */}
            <div className="flex flex-wrap gap-2">
              {job.isRemote && (
                <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Remote
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {job.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}