export interface Company {
  company_id: number
  name: string
  website: string
  logo_url?: string
  description?: string
  address?: string
  niche?: string
  benefits?: string[]
}

export interface JobAttributes {
  job_id: number
  hiring_manager?: string
  skill_tags?: string[]
  additional_info?: string
}

export interface Job {
  job_id: number
  title: string
  description?: string
  requirements?: string
  salary_min?: number
  salary_max?: number
  employment_type?: 'full-time' | 'part-time' | 'contract'
  recruit_type?: 'campus' | 'social'
  posted_date: Date
  location?: string
  company_id: number
  
  // Joined data from relations
  company?: Company
  attributes?: JobAttributes
  
  // Legacy fields for backward compatibility with existing UI
  id: string
  companyName: string
  companyLogo?: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salary?: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  postedDate: Date
  applicationDeadline?: Date
  isRemote: boolean
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  category: string
  benefits?: string[]
  applicationCount?: number
  isBookmarked?: boolean
}

// Response type for job listing API
export interface JobListingResponse {
  jobs: Job[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Database types that match the actual schema
export interface DbJob {
  job_id: number
  title: string
  description?: string
  requirements?: string
  salary_min?: number
  salary_max?: number
  employment_type?: 'full-time' | 'part-time' | 'contract'
  recruit_type?: 'campus' | 'social'
  posted_date: string
  location?: string
  company_id: number
  created_at: string
  updated_at: string
  company?: Company
  attributes?: JobAttributes
}

// Utility function to transform database job to UI job
export function transformDbJobToUiJob(dbJob: DbJob): Job {
  return {
    // Database fields
    job_id: dbJob.job_id,
    title: dbJob.title,
    description: dbJob.description,
    requirements: dbJob.requirements,
    salary_min: dbJob.salary_min,
    salary_max: dbJob.salary_max,
    employment_type: dbJob.employment_type,
    recruit_type: dbJob.recruit_type,
    posted_date: new Date(dbJob.posted_date),
    location: dbJob.location,
    company_id: dbJob.company_id,
    company: dbJob.company,
    attributes: dbJob.attributes,
    
    // Legacy/UI fields
    id: dbJob.job_id.toString(),
    companyName: dbJob.company?.name || '',
    companyLogo: dbJob.company?.logo_url,
    type: dbJob.employment_type || 'full-time',
    salary: dbJob.salary_min && dbJob.salary_max ? {
      min: dbJob.salary_min,
      max: dbJob.salary_max,
      currency: '$'
    } : undefined,
    skills: dbJob.attributes?.skill_tags || [],
    postedDate: new Date(dbJob.posted_date),
    isRemote: dbJob.location?.toLowerCase().includes('remote') || false,
    experienceLevel: 'mid', // Default, could be derived from requirements
    category: dbJob.company?.niche || 'General',
    benefits: dbJob.company?.benefits,
    applicationCount: Math.floor(Math.random() * 100), // Mock for now
    isBookmarked: false // Mock for now
  }
}

export interface JobFilters {
  type?: Job['type'][]
  salaryRange?: {
    min: number
    max: number
  }
  category?: string
}

export interface JobListingResponse {
  jobs: Job[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}