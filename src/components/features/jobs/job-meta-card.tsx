import { Clock, MapPin, DollarSign, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRelativeTime } from "@/lib/utils"

interface JobMetaCardProps {
  jobTitle: string
  companyName: string
  companyLogo?: string
  salaryMin?: number
  salaryMax?: number
  location: string
  employmentType?: 'full-time' | 'part-time' | 'contract'
  postedDate: Date
}

export function JobMetaCard({ 
  jobTitle,
  companyName,
  companyLogo,
  salaryMin,
  salaryMax,
  location,
  employmentType,
  postedDate
}: JobMetaCardProps) {
  const formatSalary = (salaryMin?: number, salaryMax?: number) => {
    if (!salaryMin && !salaryMax) return 'Salary not specified'
    if (salaryMin && salaryMax) {
      return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`
    }
    if (salaryMin) return `From $${salaryMin.toLocaleString()}`
    if (salaryMax) return `Up to $${salaryMax.toLocaleString()}`
    return 'Salary not specified'
  }

  const getEmploymentTypeBadge = (type: 'full-time' | 'part-time' | 'contract') => {
    const styles = {
      'full-time': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
      'part-time': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'contract': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
    }

    return (
      <Badge className={styles[type]}>
        {type.replace('-', ' ')}
      </Badge>
    )
  }


  return (
    <Card>
      <CardContent className="space-y-4 pt-5">
        {/* Job Title with Company Logo */}
        <div className="flex items-center gap-3 mb-1">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-emerald-600 dark:text-emerald-300 text-sm font-semibold">
              {companyName.substring(0, 2).toUpperCase()}
            </span>
          </div>
          {/* Job Title */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {jobTitle}
          </h3>
        </div>

        {/* Company Name */}
        <div className="flex items-center gap-2 pt-4">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {companyName}
          </span>
        </div>

        {/* Salary Range */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {formatSalary(salaryMin, salaryMax)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {location}
          </span>
        </div>

        {/* Job Type and Posted Time */}
        <div className="flex items-center justify-between">
          <div>
            {employmentType && getEmploymentTypeBadge(employmentType)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Posted {getRelativeTime(postedDate)}
            </span>
          </div>
        </div>

        {/* Apply Job Button */}
        <div className="pt-4">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}