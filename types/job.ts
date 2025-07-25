export interface Job {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
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

export interface JobFilters {
  type?: Job['type'][]
  salaryRange?: {
    min: number
    max: number
  }
  category?: string[]
}

export interface JobListingResponse {
  jobs: Job[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}