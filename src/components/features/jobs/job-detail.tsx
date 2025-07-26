'use client'

import { useState, useEffect } from "react"
import { Job } from "@/types/job"
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
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface JobDetailProps {
  jobId: string
  lang: string
}

// Sample job data - in a real app, this would come from an API
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    companyLogo: '/api/placeholder/48/48',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: { min: 120000, max: 180000, currency: '$' },
    description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies. You will work closely with our design team to implement beautiful, responsive interfaces that provide excellent user experiences. This role offers the opportunity to work on cutting-edge projects with significant impact on our product and users.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Experience with Next.js', 'Strong CSS and styling skills', 'Experience with state management libraries', 'Knowledge of testing frameworks'],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest', 'Cypress', 'Git'],
    postedDate: new Date('2024-01-15'),
    applicationDeadline: new Date('2024-02-15'),
    isRemote: false,
    experienceLevel: 'senior',
    category: 'Software Development',
    benefits: ['Health Insurance', '401k Match', 'Remote Work Options', 'Professional Development Budget', 'Flexible PTO'],
    applicationCount: 45,
    isBookmarked: false
  },
  // Add other sample jobs here if needed...
]

export function JobDetail({ jobId, lang }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch job details
    const fetchJob = async () => {
      setLoading(true)
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundJob = sampleJobs.find(j => j.id === jobId)
      setJob(foundJob || null)
      setIsBookmarked(foundJob?.isBookmarked || false)
      setLoading(false)
    }

    fetchJob()
  }, [jobId])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href={`/${lang}/jobs`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      {/* Job Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`}
                className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-4">
                    {job.company}
                  </p>
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Apply Now
                  </Button>
                </div>
              </div>
              
              {/* Job Details Row */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
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
                <Badge className={cn("text-sm", getTypeBadgeColor(job.type))}>
                  {job.type?.replace('-', ' ') || job.type || 'Full-time'}
                </Badge>
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

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {/* Requirements & Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Deadline */}
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

      {/* Apply Section */}
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Apply?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join {job.company} and take your career to the next level.
          </p>
          <div className="flex justify-center gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Apply Now
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Company Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}