'use client'

import { useState, useEffect, useMemo } from "react"
import { Job, JobFilters } from "@/types/job"
import { JobCard } from "./job-card"
import { JobFiltersPanel } from "./job-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, SlidersHorizontal, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface JobListingProps {
  lang: string
  headerOnly?: boolean
  contentOnly?: boolean
  filters?: JobFilters
  setFilters?: (filters: JobFilters) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  sortBy?: string
  setSortBy?: (sort: string) => void
  showFilters?: boolean
  setShowFilters?: (show: boolean) => void
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
    description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Experience with Next.js'],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'],
    postedDate: new Date('2024-01-15'),
    applicationDeadline: new Date('2024-02-15'),
    isRemote: false,
    experienceLevel: 'senior',
    category: 'Software Development',
    benefits: ['Health Insurance', '401k Match', 'Remote Work'],
    applicationCount: 45,
    isBookmarked: false
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignTech',
    location: 'Remote',
    type: 'full-time',
    salary: { min: 90000, max: 130000, currency: '$' },
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and engineers to design and prototype new features.',
    requirements: ['3+ years product design experience', 'Figma proficiency', 'User research experience'],
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    postedDate: new Date('2024-01-12'),
    isRemote: true,
    experienceLevel: 'mid',
    category: 'Design',
    benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget'],
    applicationCount: 32,
    isBookmarked: true
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'AI Solutions',
    location: 'New York, NY',
    type: 'full-time',
    salary: { min: 140000, max: 200000, currency: '$' },
    description: 'We are seeking a Data Scientist to help us build ML models and analyze large datasets to drive business insights and product improvements.',
    requirements: ['PhD in Computer Science or related field', 'Python/R proficiency', 'ML experience'],
    skills: ['Python', 'R', 'TensorFlow', 'SQL', 'Statistics', 'Machine Learning'],
    postedDate: new Date('2024-01-10'),
    isRemote: false,
    experienceLevel: 'senior',
    category: 'Data Science',
    benefits: ['Health Insurance', 'Stock Options', 'Conference Budget'],
    applicationCount: 28,
    isBookmarked: false
  },
  {
    id: '4',
    title: 'Junior Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    type: 'full-time',
    salary: { min: 70000, max: 95000, currency: '$' },
    description: 'Great opportunity for a junior developer to grow their skills in a fast-paced startup environment. You will work on both frontend and backend development.',
    requirements: ['1+ years development experience', 'JavaScript proficiency', 'Interest in full stack development'],
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Express.js'],
    postedDate: new Date('2024-01-08'),
    isRemote: false,
    experienceLevel: 'entry',
    category: 'Software Development',
    benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours'],
    applicationCount: 67,
    isBookmarked: false
  }
]

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'salary-high', label: 'Salary: High to Low' },
  { value: 'salary-low', label: 'Salary: Low to High' },
  { value: 'company', label: 'Company A-Z' }
]

export function JobListing({ 
  lang, 
  headerOnly = false, 
  contentOnly = false,
  filters: externalFilters,
  setFilters: setExternalFilters,
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery,
  sortBy: externalSortBy,
  setSortBy: setExternalSortBy,
  showFilters: externalShowFilters,
  setShowFilters: setExternalShowFilters
}: JobListingProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  
  // Use external state if provided, otherwise internal state
  const [internalFilters, setInternalFilters] = useState<JobFilters>({})
  const [internalSortBy, setInternalSortBy] = useState('recent')
  const [internalShowFilters, setInternalShowFilters] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  
  const filters = externalFilters ?? internalFilters
  const setFilters = setExternalFilters ?? setInternalFilters
  const sortBy = externalSortBy ?? internalSortBy
  const setSortBy = setExternalSortBy ?? setInternalSortBy
  const showFilters = externalShowFilters ?? internalShowFilters
  const setShowFilters = setExternalShowFilters ?? setInternalShowFilters
  const searchQuery = externalSearchQuery ?? internalSearchQuery
  const setSearchQuery = setExternalSearchQuery ?? setInternalSearchQuery

  // Simulate API loading
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setJobs(sampleJobs)
      setLoading(false)
    }
    
    loadJobs()
  }, [])

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filteredJobs = jobs.filter(job => {
      // Search filter (from header search bar)
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase()
        const matchesSearch = 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        
        if (!matchesSearch) return false
      }



      // Job type filter
      if (filters.type && filters.type.length > 0 && !filters.type.includes(job.type)) {
        return false
      }


      // Category filter
      if (filters.category && filters.category.length > 0 && 
          !filters.category.includes(job.category)) {
        return false
      }

      // Salary range filter
      if (filters.salaryRange && job.salary) {
        const jobMinSalary = job.salary.min
        const jobMaxSalary = job.salary.max
        const filterMin = filters.salaryRange.min
        const filterMax = filters.salaryRange.max
        
        if (jobMaxSalary < filterMin || jobMinSalary > filterMax) {
          return false
        }
      }

      return true
    })

    // Sort jobs
    filteredJobs.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        case 'salary-high':
          return (b.salary?.max || 0) - (a.salary?.max || 0)
        case 'salary-low':
          return (a.salary?.min || 0) - (b.salary?.min || 0)
        case 'company':
          return a.company.localeCompare(b.company)
        case 'relevant':
        default:
          return 0
      }
    })

    return filteredJobs
  }, [jobs, filters, sortBy, searchQuery])

  const handleJobClick = (jobId: string) => {
    // Navigate to job detail page
    window.location.href = `/${lang}/jobs/${jobId}`
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery) count++
    if (filters.type && filters.type.length > 0) count++
    if (filters.category && filters.category.length > 0) count++
    if (filters.salaryRange) count++
    return count
  }, [filters, searchQuery])

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }


  if (loading && !headerOnly) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  // Header only component for sticky header
  if (headerOnly) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilters}
            className="relative"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
          <p className="text-gray-600 dark:text-gray-400 hidden sm:block">
            {filteredAndSortedJobs.length} jobs found
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 sm:w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Mobile job count */}
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:hidden">
          {filteredAndSortedJobs.length} jobs found
        </p>
      </div>
    )
  }

  // Content only component for main scrollable area
  if (contentOnly) {
    return (
      <div className="flex relative">
        {/* Collapsible Filters Sidebar - Sticky positioned */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden shrink-0",
            showFilters 
              ? "w-80 opacity-100 mr-8" 
              : "w-0 opacity-0 mr-0"
          )}
        >
          <div className="w-80 sticky top-0 self-start">
            <JobFiltersPanel 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={toggleFilters}>
            <div 
              className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-950 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFilters}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <JobFiltersPanel 
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  onClose={() => setShowFilters(false)}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Dynamic width based on filter panel */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out",
            showFilters ? "flex-1" : "w-full"
          )}
        >
          {/* Job Cards */}
          <div className="space-y-4">
            {filteredAndSortedJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No jobs found matching your criteria
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedJobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  salary={job.salary ? `${job.salary.currency}${job.salary.min.toLocaleString()} - ${job.salary.currency}${job.salary.max.toLocaleString()}` : 'Salary not specified'}
                  postedDate={job.postedDate.toLocaleDateString()}
                  description={job.description}
                  skills={job.skills}
                  matchPercentage={Math.floor(Math.random() * 30) + 70} // Mock match percentage
                  isRemote={job.isRemote}
                  isHybrid={!job.isRemote && job.location.toLowerCase().includes('hybrid')}
                  animationDelay={index % 4}
                  logo={job.companyLogo}
                  lang={lang}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredAndSortedJobs.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default return (shouldn't be reached)
  return null
}